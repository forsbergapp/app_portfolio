variable "vcn_name" {
    description = "Oracle Cloud VCN name"
    type        = string
    default     = "App Portfolio VCN"
}
variable "vcn_dns_label" {
    description = "Oracle Cloud VCN DNS label"
    type        = string
    default     = "appportfolio"
}
variable "vcn_cidr_block" {
    description = "Oracle Cloud CIDR block for VCN"
    type        = string
    default     = "10.0.0.0/16"
}
variable "vcn_dhcp_options_name" {
    description = "Oracle Cloud DHCP options name"
    type        = string
    default     = "App Portfolio DHCP Options for VCN"
}
variable "vcn_subnet_name" {
    description = "Oracle Cloud VCN subnet"
    type        = string
    default     = "App Portfolio subnet"
}
variable "vcn_subnet_cidr_block" {
    description = "Oracle Cloud VCN subnet CIDR block"
    type        = string
    default     = "10.0.1.0/24"
}
variable "vcn_security_list_display_name"{
    description = "Oracle Cloud VCN security list display name"
    type        = string
    default     = "App Portfolio Security List for VCN"
}
