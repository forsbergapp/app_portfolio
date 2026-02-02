#environment
variable "environment_app_port" {
    description = "Environment APP port"
    type = number
    default = 80
}
variable "environment_admin_port" {
    description = "Environment ADMIN port"
    type = number
    default = 3333
}
#Network
variable "vcn_cidr_block" {
    description = "ENVIRONMENT vcn CIDR block"
    type        = string
    default     = "10.0.0.0/16"
}
variable "vcn_subnet_cidr_block" {
    description = "ENVIRONMENT subnet CIDR block"
    type        = string
    default     = "10.0.0.0/24"
}
#Compute
variable "compute_shape" {
    description = "Oracle Cloud Compute shape"
    type        = string
    default     = "VM.Standard.E2.1.Micro"
}
variable "compute_public_ip" {
    description = "Oracle Cloud Compute public ip"
    type        = string
    default     = true
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
