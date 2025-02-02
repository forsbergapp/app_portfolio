variable "compute_shape" {
    description = "Oracle Cloud Compute shape"
    type        = string
    default     = "VM.Standard.E2.1.Micro"
}
variable "compute_display_name" {
    description = "Oracle Cloud Compute display name"
    type        = string
    default     = "App Portfolio"
}
variable "compute_public_ip" {
    description = "Oracle Cloud Compute public ip"
    type        = string
    default     = "true"
}
variable "compute_host_name" {
    description = "Oracle Cloud Compute host name"
    type        = string
    default     = "server"
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
variable "git_repository_url" {
    description = "GIT Repository"
    type        = string
    default     = "https://[server]/[path]/[file].git"
}