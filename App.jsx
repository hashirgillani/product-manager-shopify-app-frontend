import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LogsPage from "./pages/LogsPage";
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
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </QueryProvider>
  );
}