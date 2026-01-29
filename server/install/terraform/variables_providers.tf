variable "oci_tenency_ocid" {
    description = "Oracle Cloud tenancy ocid"
    type        = string
    default     = "ocid1.tenancy.oc1.."
}
variable "oci_compartment_ocid" {
    description = "Oracle Cloud compartment ocid"
    type        = string
    default     = "ocid1.compartment.oc1.."
}
variable "oci_user_ocid" {
    description = "Oracle Cloud user ocid"
    type        = string
    default     = "ocid1.user.oc1.."
}
variable "oci_fingerprint" {
    description = "Oracle Cloud API KEY fingerprint"
    type        = string
    default     = "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
}
variable "oci_private_key_path" {
    description = "Oracle Cloud API KEY private key path"
    type        = string
    default     = "[API KEY FILE PATH]"
}
variable "oci_region" {
    description = "Oracle Cloud region"
    type        = string
    default     = "[REGION]"
}
variable "git_repository_url" {
    description = "GIT Repository"
    type        = string
    default     = "https://[server]/[path]/[file].git"
}