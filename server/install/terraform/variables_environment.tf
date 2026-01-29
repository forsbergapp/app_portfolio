#Network
variable "vcn_name" {
    description = "ENVIRONMENT vcn"
    type        = string
    default     = "ENVIRONMENT_vcn"
}
variable "vcn_dns_label" {
    description = "ENVIRONMENT dns"
    type        = string
    default     = "ENVIRONMENT"
}
variable "vcn_cidr_block" {
    description = "ENVIRONMENT vcn CIDR block"
    type        = string
    default     = "10.0.0.0/16"
}
variable "vcn_dhcp_options_name" {
    description = "ENVIRONMENT DHCP options"
    type        = string
    default     = "ENVIRONMENT_dhcp"
}
variable "vcn_subnet_name" {
    description = "ENVIRONMENT vcn subnet"
    type        = string
    default     = "ENVIRONMENT_subnet"
}
variable "vcn_subnet_cidr_block" {
    description = "ENVIRONMENT subnet CIDR block"
    type        = string
    default     = "10.0.0.0/24"
}
variable "vcn_security_list_display_name" {
    description = "ENVIRONMENT VCN security list"
    type        = string
    default     = "ENVIRONMENT_security_list"
}
variable "vcn_route_table_display_name" {
    description = "ENVIRONMENT Route table"
    type        = string
    default     = "ENVIRONMENT Route table"
}
variable "vcn_route_table_route_rules_description"{
    description = "ENVIRONMENT Route rules"
    type        = string
    default     = "ENVIRONMENT Route rules"
}
variable "vcn_internet_gateway_display_name" {
    description = "ENVIRONMENT Internet gateway"
    type        = string
    default     = "ENVIRONMENT Internet gateway"
}
#Compute
variable "compute_shape" {
    description = "Oracle Cloud Compute shape"
    type        = string
    default     = "VM.Standard.E2.1.Micro"
}
variable "compute_display_name" {
    description = "Oracle Cloud Compute display name"
    type        = string
    default     = "ENVIRONMENT"
}
variable "compute_vnic_display_name" {
    description = "Oracle Cloud Compute VNIC display name"
    type        = string
    default     = "ENVIRONMENT"
}
variable "compute_public_ip" {
    description = "Oracle Cloud Compute public ip"
    type        = string
    default     = true
}
variable "compute_host_name" {
    description = "Oracle Cloud Compute host name"
    type        = string
    default     = "ENVIRONMENT"
}
variable "oci_core_image_operating_system" {
    description = "Oracle Cloud Compute operating system"
    type        = string
    default     = "Canonical Ubuntu"
}
variable "oci_core_image_operating_system_version" {
    description = "Oracle Cloud Compute operating system version"
    type        = string
    default     = "20.04"
}
