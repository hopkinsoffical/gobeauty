"use client";

import { useState } from "react";
import type { InquiryType, Supplier } from "@/lib/marketplace/types";
import InquiryModal, { type InquiryContext } from "./InquiryModal";

function allowedInquiries(supplier: Supplier): InquiryType[] {
  const list: InquiryType[] = ["ask_about_products", "product_information", "contact_supplier"];
  if (supplier.kind === "multi_brand_source") {
    list.splice(1, 0, "business_orders");
  }
  // Only show sample/pricing/training/demo/private-label when confirmed available
  if (supplier.sampleStatus === "available") list.push("samples");
  if (supplier.businessPricingStatus === "available" || supplier.wholesaleStatus === "available") {
    list.push("salon_pricing");
  }
  if (supplier.trainingStatus === "available") list.push("product_training");
  if (supplier.demoStatus === "available") list.push("demo");
  if (supplier.privateLabelStatus === "available") list.push("private_label");
  return list;
}

const CTA_LABEL: Partial<Record<InquiryType, string>> = {
  ask_about_products: "Ask About Products",
  product_information: "Request Product Information",
  business_orders: "Ask About Business Orders",
  samples: "Request Samples",
  salon_pricing: "Get Salon Pricing",
  product_training: "Book Product Training",
  demo: "Book a Demo",
  private_label: "Discuss Private Label",
  contact_supplier: "Contact Supplier",
};

export default function SupplierActions({
  supplier,
  productName,
  productId,
}: {
  supplier: Supplier;
  productName?: string;
  productId?: string;
}) {
  const [ctx, setCtx] = useState<InquiryContext | null>(null);
  const inquiries = allowedInquiries(supplier);
  const primary = inquiries[0];
  const secondary = inquiries.slice(1, 3);

  const open = (type: InquiryType) =>
    setCtx({
      inquiryType: type,
      supplierName: supplier.name,
      supplierSlug: supplier.slug,
      productName,
      productId,
      referringUrl: `/marketplace/suppliers/${supplier.slug}`,
    });

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => open(primary)}
          className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-500 px-6 text-[14.5px] font-semibold text-white shadow-[0_4px_14px_rgba(232,90,130,0.30)] transition hover:bg-brand-600"
        >
          {CTA_LABEL[primary] ?? "Ask About Products"}
        </button>
        {secondary.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => open(t)}
            className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white px-5 text-[14px] font-semibold text-ink transition hover:bg-surface-tint"
          >
            {CTA_LABEL[t]}
          </button>
        ))}
        {supplier.websiteUrl && (
          <a
            href={supplier.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-pill border border-line bg-white px-5 text-[14px] font-semibold text-ink transition hover:bg-surface-tint"
          >
            Visit Supplier Website
          </a>
        )}
      </div>
      {ctx && (
        <InquiryModal open={!!ctx} onClose={() => setCtx(null)} context={ctx} />
      )}
    </>
  );
}

export function AskProductButton({
  supplier,
  productName,
  productId,
  label = "Ask About This Product",
  className,
}: {
  supplier: Supplier;
  productName: string;
  productId?: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex h-10 items-center justify-center rounded-pill bg-brand-500 px-4 text-[13px] font-semibold text-white transition hover:bg-brand-600"
        }
      >
        {label}
      </button>
      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        context={{
          inquiryType: "product_information",
          supplierName: supplier.name,
          supplierSlug: supplier.slug,
          productName,
          productId,
          referringUrl: `/marketplace/suppliers/${supplier.slug}`,
        }}
      />
    </>
  );
}
