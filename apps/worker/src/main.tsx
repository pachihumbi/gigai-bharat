import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ConfigGuard } from "./components/ConfigGuard.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ConfigGuard>
    <App />
  </ConfigGuard>,
);
