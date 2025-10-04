import { createRoot } from "react-dom/client";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/assets/css/leaflet.css";
import "./index.css";
import "./utils/leafletIconFix";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
