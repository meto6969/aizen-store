import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, set, push, remove, update } from "firebase/database";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  
  // التخزين السريع (Caching)
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('fast_store_products');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [categories, setCategories] = useState(["إلكترونيات", "مجوهرات", "ملابس"]);
  const [loading, setLoading] = useState(products.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [hero, setHero] = useState({ title: "تسوق بذكاء", subtitle: "وتميز بأسلوبك", desc: "اكتشف تشكيلة واسعة...", image: "" });
  const [storeInfo, setStoreInfo] = useState({ name: "متجري", logo: "" });
  const [theme, setTheme] = useState({ primary: "#2563eb", secondary: "#1e40af", bg: "#f8fafc" });
  const [footerData, setFooterData] = useState({ phone: "", address: "", facebook: "", instagram: "", tiktok: "", desc: "تسوق معنا واستمتع بأفضل العروض والمنتجات الحصرية." });

  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('is_auth') === 'true');
  const [adminConfig, setAdminConfig] = useState(() => JSON.parse(localStorage.getItem('admin_config')) || { username: "admin", password: "123", phone: "9647700000000" });

  useEffect(() => {
    const dbRef = ref(db);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.products) {
          const parsedProducts = Object.entries(data.products).map(([id, val]) => ({ id, ...val }));
          setProducts(parsedProducts);
          try { localStorage.setItem('fast_store_products', JSON.stringify(parsedProducts)); } catch (e) {}
        } else {
          setProducts([]);
        }
        
        if (data.categories) setCategories(data.categories);
        if (data.hero) setHero(data.hero);
        if (data.storeInfo) setStoreInfo(data.storeInfo);
        if (data.theme) setTheme(data.theme);
        if (data.footer) setFooterData(data.footer);
        
        // 🔥 التعديل هنا: جلب رقم الواتساب من قاعدة البيانات للزبون 🔥
        if (data.adminPhone) {
          setAdminConfig(prev => ({ ...prev, phone: data.adminPhone }));
        }
      }
      setLoading(false);
    });
  }, []);

  const addProduct = (item) => { const newRef = push(ref(db, 'products')); set(newRef, { ...item, rating: { rate: 5, count: 0 }, barcode: item.barcode || String(Date.now()) }); };
  const deleteProduct = async (id) => { setProducts(prev => prev.filter(item => item.id !== id)); await remove(ref(db, `products/${id}`)); };
  const updateProduct = (id, data) => update(ref(db, `products/${id}`), data);
  const addCategory = (name) => { if (name && !categories.includes(name)) set(ref(db, 'categories'), [...categories, name]); };
  const deleteCategory = (name) => { set(ref(db, 'categories'), categories.filter(c => c !== name)); };
  
  const updateHero = (newData) => { set(ref(db, 'hero'), newData); setHero(newData); };
  const updateStoreInfo = (newData) => { set(ref(db, 'storeInfo'), newData); setStoreInfo(newData); };
  const updateTheme = (newData) => { set(ref(db, 'theme'), newData); setTheme(newData); };
  const updateFooter = (newData) => { const updatedData = { ...footerData, ...newData }; set(ref(db, 'footer'), updatedData); setFooterData(updatedData); };

  const login = (u, p) => { if (u === adminConfig.username && p === adminConfig.password) { setIsAuth(true); localStorage.setItem('is_auth', 'true'); return true; } return false; };
  const logout = () => { setIsAuth(false); localStorage.removeItem('is_auth'); };
  
  // 🔥 التعديل هنا: رفع الرقم لقاعدة البيانات عند حفظ الإعدادات 🔥
  const updateAdminCredentials = (u, p, ph) => { 
    const cfg = { username: u, password: p, phone: ph }; 
    setAdminConfig(cfg); 
    localStorage.setItem('admin_config', JSON.stringify(cfg)); 
    
    // رفع الرقم للفايربيس ليقرأه الزبون
    set(ref(db, 'adminPhone'), ph); 
  };

  return (
    <ProductContext.Provider value={{ 
      products, loading, addProduct, deleteProduct, updateProduct, 
      categories, addCategory, deleteCategory, 
      hero, updateHero, 
      storeInfo, updateStoreInfo,
      theme, updateTheme,
      footerData, updateFooter,
      isAuth, login, logout, adminConfig, updateAdminCredentials, 
      searchQuery, setSearchQuery 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);