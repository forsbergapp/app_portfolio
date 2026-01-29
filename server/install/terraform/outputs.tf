output "public_ip_server_only" {
    description = "The public IP of compute instance"
    value = oci_core_instance.instance.public_ip
}
output "key-public-openssh" {
    value = tls_private_key.PRIVATE_KEY.public_key_openssh
}
output "key-private-pem" {
    value = tls_private_key.PRIVATE_KEY.private_key_pem
    sensitive = true
}