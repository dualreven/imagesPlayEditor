import { mountApp } from "./app";
import "./styles/index.css";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root not found.");
}

mountApp(root);
