terraform {
  required_providers {
    oci = {
      source  = "oci"
      version = "~> 7.32.0"
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

resource "tls_private_key" "PRIVATE_KEY"{
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "oci_core_vcn" "vcn" {
  compartment_id = var.oci_tenency_ocid
  display_name   = "${terraform.workspace}_vcn"
  cidr_blocks    = [var.vcn_cidr_block]
}

resource "oci_core_dhcp_options" "dhcp_options"{
    compartment_id = var.oci_tenency_ocid
    vcn_id = oci_core_vcn.vcn.id
    display_name   = "${terraform.workspace}_dhcp_options"
    
    options {
        type = "DomainNameServer"
        server_type = "VcnLocalPlusInternet"
        custom_dns_servers = []
    }
    
}
resource "oci_core_subnet" "subnet" {
  vcn_id              = oci_core_vcn.vcn.id
  compartment_id      = var.oci_tenency_ocid
  display_name        = "${terraform.workspace}_subnet"
  cidr_block          = var.vcn_subnet_cidr_block
  availability_domain = data.oci_identity_availability_domain.ad.name
  security_list_ids   = [oci_core_security_list.security-list.id]
  dhcp_options_id     = oci_core_dhcp_options.dhcp_options.id
}

resource "oci_core_internet_gateway" "ig" {
    compartment_id = var.oci_tenency_ocid
    display_name = "${terraform.workspace}_internet_gateway"
    vcn_id = oci_core_vcn.vcn.id

    enabled = true
}

resource oci_core_default_route_table "route_table" {
    compartment_id = var.oci_tenency_ocid
    display_name = "${terraform.workspace}_route_table"
    manage_default_resource_id = oci_core_vcn.vcn.default_route_table_id

    route_rules {
        description       = "${terraform.workspace}_route_rules"
        destination       = "0.0.0.0/0"
        destination_type  = "CIDR_BLOCK"
        network_entity_id = oci_core_internet_gateway.ig.id
        route_type        = "STATIC"
    }
}
resource "oci_core_security_list" "security-list" {
  vcn_id           = oci_core_vcn.vcn.id
  compartment_id   = var.oci_tenency_ocid
  display_name     = "${terraform.workspace}_security_list"

  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 22
        max = 22
    }
    description = "SSH"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = var.environment_app_port
        max = var.environment_app_port
    }
    description = "HTTP"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = var.environment_admin_port
        max = var.environment_admin_port
    }
    description = "HTTP Admin"
  }
  ingress_security_rules {
    protocol = "6" #tcp protocol
    source  = "0.0.0.0/0"
    tcp_options {
        min = 443
        max = 443
    }
    description = "HTTPS"
  }
  egress_security_rules {
    protocol = "all" #all protocols or -1
    destination  = "0.0.0.0/0"
    description = "Allow all outbound"
  }  

}

resource "oci_core_instance" "instance" {
  availability_domain = data.oci_identity_availability_domain.ad.name
  compartment_id      = var.oci_tenency_ocid
  
  shape              = var.compute_shape
  
  display_name       = "${terraform.workspace}"

  create_vnic_details {
    subnet_id          = oci_core_subnet.subnet.id
    display_name       = "${terraform.workspace}_vnic"
    assign_public_ip   = var.compute_public_ip
    assign_private_dns_record = false
  }

  source_details {
    source_type       = "image"
    source_id         = data.oci_core_images.image.images[0].id
  }
  metadata = {
    user_data               = base64encode(<<-EOF
                              #!/bin/bash
                              sudo apt update -y
                              sudo apt upgrade -y
                              sudo apt install -y git vim inetutils-ping net-tools ufw
                              sudo ufw allow 22/tcp
                              sudo ufw allow ${var.environment_app_port}/tcp
                              sudo ufw allow 443/tcp
                              sudo ufw allow ${var.environment_admin_port}/tcp
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
                              sudo apt -y autoremove --purge
                              sudo -i -u ubuntu mkdir node
                              sudo -i -u ubuntu wget ${var.environment_node_release_url}
                              sudo -i -u ubuntu tar -xJf ${var.environment_node_release_file} -C node --strip-components=1
                              sudo -i -u ubuntu echo 'export PATH="$PATH:$HOME/node/bin"' >> ~/.bashrc
                              sudo setcap CAP_NET_BIND_SERVICE=+eip /home/ubuntu/node/bin/node
                              sudo -i -u ubuntu git clone ${var.git_repository_url} app_portfolio
                              sudo systemctl enable /home/ubuntu/app_portfolio/server/scripts/app_portfolio.service
                              sudo systemctl enable /home/ubuntu/app_portfolio/server/scripts/app_portfolio_microservice_batch.service
                              sudo systemctl daemon-reload
                              sudo -u ubuntu bash -c 'cd /home/ubuntu/app_portfolio && /usr/bin/node server/init.js ${terraform.workspace} localhost ${var.environment_app_port} ${var.environment_admin_port}'
                              sleep 10
                              sudo reboot
                              EOF
                              )
    ssh_authorized_keys     = tls_private_key.PRIVATE_KEY.public_key_openssh
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
data "oci_identity_availability_domain" "ad" {
  compartment_id = var.oci_tenency_ocid
  ad_number      = 1
}