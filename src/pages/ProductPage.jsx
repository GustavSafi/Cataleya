import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import DisclaimerBanner from "@/components/product/DisclaimerBanner";
import LabResultsSection from "@/components/product/LabResultsSection";

const productData = {
  id: "bpc157-5mg",
  name: "BPC-157 5mg",
  price: 49.99,
  inStock: true,
  preorderEta: "Ships in 2-3 weeks",
  image: "/images/product-vial.png",
  studies: [
    "Facilitates analysis of nitric oxide-mediated angiogenic and cytoprotective signaling cascades",
    "Supports investigation into vascular endothelial growth factor upregulation and receptor activation",
    "Enables research on growth factor-mediated fibroblast migration and collagen synthesis pathways",
    "Useful for evaluating modulation of G-protein coupled receptor-dependent gastrointestinal protective mechanisms",
  ],
};

const productImages = [
  "/images/product-vial.png",
  "/images/vial-alt-1.png",
  "/images/vial-alt-2.png",
];

export default function ProductPage() {
  const { addToCart } = useOutletContext() || {};

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: product.qty,
      preorder: product.preorder,
    });
  };

  return (
    <div>
      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductImageGallery images={productImages} />
          <ProductInfo product={productData} onAddToCart={handleAddToCart} />
        </div>

        <DisclaimerBanner />
        <ProductTabs product={productData} />
        <LabResultsSection productId={productData.id} productName={productData.name} />
      </section>

      <RelatedProducts productImage={productImages[0]} />
    </div>
  );
}