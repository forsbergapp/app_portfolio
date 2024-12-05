output "public_ip" {
    description = "The public IP of compute instance"
    value = oci_core_instance.compute_instance_network.public_ip
}
output "public_ip_server_only" {
    description = "The public IP of compute instance"
    value = oci_core_instance.compute_instance_only.public_ip
}
output "key-public-openssh" {
    value = tls_private_key.AppPortfolioKey.public_key_openssh
}
output "key-private-pem" {
    value = tls_private_key.AppPortfolioKey.private_key_pem
    sensitive = true
}