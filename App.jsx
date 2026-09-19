import { useEffect } from "react";
import ProductListPage from "./pages/ProductListPage";
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
      <ProductListPage />
    </QueryProvider>
  );
}