import Product from "./components/Product";
import { QueryProvider } from "./providers/QuerryProvider";

export default function App() {
  return (
    <QueryProvider>
      <Product />
    </QueryProvider>
  );
}