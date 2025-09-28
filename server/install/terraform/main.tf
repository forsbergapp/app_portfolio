#Installs linux server with minimum required network configuration
#Runs script on server to install app portfolio
#Enter  http://[host] to set admin username and password after installation finished

terraform {
  required_providers {
    oci = {
      source  = "oci"
      version = "~> 6.16.0"
    }
  }
}
#Provider
provider "oci" {
  tenancy_ocid     = var.oci_tenency_ocid
  user_ocid        = var.oci_user_ocid
  fingerprint      = var.oci_fingerprint
  private_key_path = var.oci_private_key_path
  region           = var.oci_region
}

provider "tls" {}

resource "tls_private_key" "AppPortfolioKey"{
  algorithm = "RSA"
  rsa_bits  = 2048
}

#VCN
resource "oci_core_virtual_network" "vcn" {
  compartment_id = var.oci_tenency_ocid
  display_name   = var.vcn_name
  cidr_block     = var.vcn_cidr_block
  dns_label      = var.vcn_dns_label
}
resource "oci_core_dhcp_options" "dhcp_options"{
    compartment_id = var.oci_tenency_ocid
    display_name   = var.vcn_dhcp_options_name
    options {
        type = "DomainNameServer"
        server_type = "VcnLocalPlusInternet"
        custom_dns_servers = []
    }
    options {
        type = "SearchDomain"
        search_domain_names =[oci_core_virtual_network.vcn.dns_label]       
    }
    vcn_id = oci_core_virtual_network.vcn.id
}
resource "oci_core_subnet" "subnet" {
  vcn_id              = oci_core_virtual_network.vcn.id
  compartment_id      = var.oci_tenency_ocid
  display_name        = var.vcn_subnet_name
  cidr_block          = var.vcn_subnet_cidr_block
  availability_domain = var.vcn_availability_domain
  security_list_ids   = [oci_core_security_list.security-list.id]
  dhcp_options_id     = oci_core_dhcp_options.dhcp_options.id
}

resource "oci_core_security_list" "security-list" {
  vcn_id           = oci_core_virtual_network.vcn.id
  compartment_id   = var.oci_tenency_ocid
  display_name     = var.vcn_security_list_display_name

  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 22
        max = 22
    }
    description = "Allow HTTP"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 80
        max = 80
    }
    description = "Allow HTTP"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 443
        max = 443
    }
    description = "Allow HTTPS"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 3000
        max = 3000
    }
    description = "HTTP 3000"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 3333
        max = 3333
    }
    description = "HTTP Admin"
  }
  egress_security_rules {
    protocol = "all" #all protocols or -1
    destination  = "0.0.0.0/0"
    description = "Allow all outbound"
  }  

}
#Compute instance
resource "oci_core_instance" "compute_instance_network" {
  availability_domain = var.vcn_availability_domain
  compartment_id      = var.oci_tenency_ocid
  
  shape              = var.compute_shape
  
  display_name       = var.compute_display_name

  create_vnic_details {
    ##use specific subnet if specified when creating server only
    subnet_id          = oci_core_subnet.subnet.id
    assign_public_ip   = var.compute_public_ip
    hostname_label     = var.compute_host_name
  }

  source_details {
    source_type       = "image"
    source_id         = data.oci_core_images.image.images[0].id
  }
  metadata = {
    user_data               = base64encode(<<-EOF
                              #!/bin/bash
                              sudo apt-get update -y
                              sudo apt-get upgrade -y
                              sudo apt-get install git -y
                              sudo apt-get install vim -y
                              sudo apt install inetutils-ping -y
                              sudo apt-get install net-tools -y
                              sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                              sudo apt install nodejs -y
                              sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
                              sudo apt-get install ufw -y
                              sudo ufw allow 22/tcp
                              sudo ufw allow 80/tcp
                              sudo ufw allow 443/tcp
                              sudo ufw allow 3000/tcp
                              sudo ufw allow 3333/tcp
                              sudo ufw --force enable
                              sudo apt remove --purge -y update-notifier-common
                              sudo apt remove --purge -y ubuntu-release-upgrader-core
                              sudo apt remove --purge -y popularity-contest
                              sudo apt remove --purge -y apport
                              sudo apt remove --purge -y whoopsie
                              sudo apt remove --purge -y friendly-recovery
                              sudo apt remove --purge -y command-not-found
                              sudo apt remove --purge -y man-db
                              sudo apt remove --purge -y vim-tiny
                              sudo apt remove --purge -y nano
                              sudo apt remove --purge -y rsyslog
                              sudo apt -y autoremove
                              sudo -i -u ubuntu git clone ${var.git_repository_url} app_portfolio
                              sudo npm install -g pm2
                              sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/server/init.js --cwd /home/ubuntu/app_portfolio --name app_portfolio -o "/dev/null" -e "/dev/null" --watch --ignore-watch=".git .vscode .well-known data node_modules .gitignore .eslintignore .eslintrc.js README.md tsconfig.json"
                              sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/serviceregistry/microservice/batch/server.js --cwd /home/ubuntu/app_portfolio --name batch --no-autorestart --silent
                              sudo -i -u ubuntu pm2 save
                              EOF
                              )
    ssh_authorized_keys     = tls_private_key.AppPortfolioKey.public_key_openssh
 }
}
resource "oci_core_instance" "compute_instance_only" {
  availability_domain = var.vcn_availability_domain
  compartment_id      = var.oci_tenency_ocid
  
  shape              = var.compute_shape
  
  display_name       = var.compute_display_name

  create_vnic_details {
    ##use specific subnet if specified when creating server only
    subnet_id          = var.vcn_subnet_id
    assign_public_ip   = var.compute_public_ip
    hostname_label     = var.compute_host_name
  }

  source_details {
    source_type       = "image"
    source_id         = data.oci_core_images.image.images[0].id
  }
  metadata = {
    user_data               = base64encode(<<-EOF
                              #!/bin/bash
                              sudo apt-get update -y
                              sudo apt-get upgrade -y
                              sudo apt-get install git -y
                              sudo apt-get install vim -y
                              sudo apt install inetutils-ping -y
                              sudo apt-get install net-tools -y
                              sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                              sudo apt install nodejs -y
                              sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
                              sudo apt-get install ufw -y
                              sudo ufw allow 22/tcp
                              sudo ufw allow 80/tcp
                              sudo ufw allow 443/tcp
                              sudo ufw allow 3000/tcp
                              sudo ufw allow 3333/tcp
                              sudo ufw --force enable
                              sudo apt remove --purge -y update-notifier-common
                              sudo apt remove --purge -y ubuntu-release-upgrader-core
                              sudo apt remove --purge -y popularity-contest
                              sudo apt remove --purge -y apport
                              sudo apt remove --purge -y whoopsie
                              sudo apt remove --purge -y friendly-recovery
                              sudo apt remove --purge -y command-not-found
                              sudo apt remove --purge -y man-db
                              sudo apt remove --purge -y vim-tiny
                              sudo apt remove --purge -y nano
                              sudo apt remove --purge -y rsyslog
                              sudo apt -y autoremove
                              sudo -i -u ubuntu git clone ${var.git_repository_url} app_portfolio
                              sudo npm install -g pm2
                              sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/server/init.js --cwd /home/ubuntu/app_portfolio --name app_portfolio -o "/dev/null" -e "/dev/null" --watch --ignore-watch=".git .vscode .well-known data node_modules .gitignore .eslintignore .eslintrc.js README.md tsconfig.json"
                              sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/serviceregistry/microservice/batch/server.js --cwd /home/ubuntu/app_portfolio --name batch --no-autorestart --silent
                              sudo -i -u ubuntu pm2 save
                              EOF
                              )
    ssh_authorized_keys     = tls_private_key.AppPortfolioKey.public_key_openssh
 }
}

data "oci_core_images" "image" {
  compartment_id            = var.oci_tenency_ocid
  shape                     = var.compute_shape
  operating_system          = var.oci_core_image_operating_system
  operating_system_version  = var.oci_core_image_operating_system_version
  sort_by                   = "TIMECREATED"
  sort_order                = "DESC"
}