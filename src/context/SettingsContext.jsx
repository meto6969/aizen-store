import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

const translations = {
  ar: {
    home: "الرئيسية",
    cart: "السلة",
    searchPlaceholder: "ابحث عن منتج...",
    heroTitle: "تسوق بذكاء،",
    heroSubtitle: "وتميز بأسلوبك.",
    heroDesc: "اكتشف تشكيلة واسعة من أحدث الإلكترونيات والأزياء العصرية. أفضل الماركات العالمية بين يديك الآن.",
    browseBtn: "تصفح العروض",
    addToCart: "إضافة",
    myStore: "متجري",
  },
  en: {
    home: "Home",
    cart: "Cart",
    searchPlaceholder: "Search products...",
    heroTitle: "Shop Smart,",
    heroSubtitle: "Style Your Life.",
    heroDesc: "Discover a wide range of modern electronics and fashion. The best global brands are now in your hands.",
    browseBtn: "Shop Now",
    addToCart: "Add",
    myStore: "MyStore",
  },
};

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "ar");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", language);
  }, [darkMode, language]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage((prev) => (prev === "ar" ? "en" : "ar"));

  return (
    <SettingsContext.Provider value={{ darkMode, toggleTheme, language, toggleLanguage, t: translations[language] }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);