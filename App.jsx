import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { QueryProvider } from "./providers/QuerryProvider";
import { setTokenProvider } from "./lib/api/client";

function BridgeTokenProvider() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.shopify?.idToken) {
      setTokenProvider(() => window.shopify.idToken());
    }
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryProvider>
      <BridgeTokenProvider />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </QueryProvider>
  );
}