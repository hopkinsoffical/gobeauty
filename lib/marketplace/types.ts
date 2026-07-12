/** Marketplace supplier lead-gen types (goBeauty_marketplace.docx §11). */

export type CommercialStatus = "available" | "not_available" | "pending";

export type ProfileStatus =
  | "supplier_profile"
  | "brand_profile"
  | "unclaimed_profile"
  | "claimed_profile"
  | "sponsored_supplier"
  | "official_partner"
  | "featured_supplier"
  | "information_pending";

export type SupplierKind =
  | "multi_brand_source"
  | "skincare_brand"
  | "distributor"
  | "oem_private_label"
  | "equipment"
  | "other";

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  supplierType: string;
  kind: SupplierKind;
  shortDescription: string;
  fullDescription: string;
  logoInitials: string;
  logoColor: string;
  websiteUrl: string | null;
  contactUrl: string | null;
  country: string | null;
  shippingMarkets: string[];
  productCategories: string[];
  bestFitBusinessTypes: string[];
  bestFitServices: string[];
  sampleStatus: CommercialStatus;
  businessPricingStatus: CommercialStatus;
  wholesaleStatus: CommercialStatus;
  trainingStatus: CommercialStatus;
  demoStatus: CommercialStatus;
  privateLabelStatus: CommercialStatus;
  minimumOrder: string | null;
  shippingDetails: string | null;
  profileStatus: ProfileStatus;
  claimed: boolean;
  sponsored: boolean;
  authorizedContent: boolean;
  disclaimer: string | null;
  featured: boolean;
  productFocus: string;
  commonProfessionalUse: string;
  retailOpportunity: string;
  aftercareOpportunity: string;
  useCases: { title: string; body: string }[];
  /** Optional brand slug to pull live product cards from gb API. */
  gbBrandSlug?: string;
}

export interface MarketplaceProduct {
  id: string;
  supplierId: string;
  brandName: string;
  productName: string;
  slug: string;
  category: string;
  professionalUse: string;
  bestFitBusiness: string;
  treatmentPairing: string;
  clientNeed: string;
  aftercareFit: string;
  retailFit: string;
  sampleStatus: CommercialStatus;
  salonPricingStatus: CommercialStatus;
  productUrl: string | null;
  sourceType: "editorial" | "supplier" | "public";
}

export interface MarketplaceService {
  slug: string;
  name: string;
  shortDescription: string;
  searchHints: string[];
  relatedCategories: string[];
}

export type InquiryType =
  | "ask_about_products"
  | "product_information"
  | "business_orders"
  | "samples"
  | "salon_pricing"
  | "product_training"
  | "demo"
  | "private_label"
  | "contact_supplier"
  | "claim_profile"
  | "list_products";

export const PROFILE_STATUS_LABEL: Record<ProfileStatus, string> = {
  supplier_profile: "Supplier Profile",
  brand_profile: "Brand Profile",
  unclaimed_profile: "Unclaimed Profile",
  claimed_profile: "Claimed Profile",
  sponsored_supplier: "Sponsored Supplier",
  official_partner: "Official Supplier Partner",
  featured_supplier: "Featured Supplier",
  information_pending: "Information Pending",
};

export const COMMERCIAL_STATUS_LABEL: Record<CommercialStatus, string> = {
  available: "Available",
  not_available: "Not available",
  pending: "Information not yet provided",
};

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  ask_about_products: "Ask About Products",
  product_information: "Request Product Information",
  business_orders: "Ask About Business Orders",
  samples: "Request Samples",
  salon_pricing: "Get Salon Pricing",
  product_training: "Book Product Training",
  demo: "Book a Demo",
  private_label: "Discuss Private Label",
  contact_supplier: "Contact Supplier",
  claim_profile: "Claim This Profile",
  list_products: "List Your Products",
};

export const BUSINESS_TYPES = [
  "Salon owner",
  "Spa owner",
  "Esthetician",
  "Hairstylist",
  "Nail technician",
  "Lash artist",
  "Med spa",
  "Beauty boutique",
  "Independent beauty pro",
  "Other",
];
