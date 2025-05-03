import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { I18nProvider } from "@/hooks/use-i18n";

// Определить начальную локаль из localStorage или использовать 'ru' по умолчанию
const savedLocale = localStorage.getItem('locale');
const initialLocale = savedLocale || 'ru';

createRoot(document.getElementById("root")!).render(
  <I18nProvider initialLocale={initialLocale}>
    <App />
  </I18nProvider>
);
