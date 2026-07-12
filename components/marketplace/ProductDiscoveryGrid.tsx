"use client";

import { useState } from "react";
import type { MarketplaceProduct, Supplier } from "@/lib/marketplace/types";
import MarketplaceProductCard from "./MarketplaceProductCard";
import InquiryModal, { type InquiryContext } from "./InquiryModal";

export default function ProductDiscoveryGrid({
  products,
  suppliersById,
}: {
  products: MarketplaceProduct[];
  suppliersById: Record<string, Supplier>;
}) {
  const [ctx, setCtx] = useState<InquiryContext | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const supplier = suppliersById[p.supplierId];
          if (!supplier) return null;
          return (
            <MarketplaceProductCard
              key={p.id}
              product={p}
              supplierSlug={supplier.slug}
              onAsk={(product) =>
                setCtx({
                  inquiryType: "product_information",
                  supplierName: supplier.name,
                  supplierSlug: supplier.slug,
                  productName: product.productName,
                  productId: product.id,
                  referringUrl: "/marketplace",
                })
              }
            />
          );
        })}
      </div>
      {ctx && (
        <InquiryModal open={!!ctx} onClose={() => setCtx(null)} context={ctx} />
      )}
    </>
  );
}
