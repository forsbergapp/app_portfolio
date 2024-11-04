variable "oci_tenency_ocid" {
    description = "Oracle Cloud tenancy ocid"
    type        = string
    default     = "ocid1.tenancy.oc1..."
}
variable "oci_user_ocid" {
    description = "Oracle Cloud user ocid"
    type        = string
    default     = "ocid1.user.oc1..."
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
variable "vcn_availability_domain" {
    description = "Oracle Cloud VCN availability domain"
    type        = string
    default     = "[AVAILABILITY DOMAIN]"
}
variable "vcn_subnet_id" {
    description = "Oracle Cloud VCN subnet id"
    type        = string
    default     = "ocid1.subnet.oc1..."
}