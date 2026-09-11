import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/standard-italic.css";
import "./styles.css";
import { App } from "./App";
import { getPage } from "./routes";

const root = document.getElementById("root");
if (!root) throw new Error("The website root is missing.");

const page = getPage(window.location.pathname, import.meta.env.BASE_URL);
const app = (
  <StrictMode>
    <App page={page.id} />
  </StrictMode>
);

// The development template is empty; published pages already contain their HTML.
if (root.children.length > 0) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
