import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('my_cart')) || []);

  useEffect(() => {
    localStorage.setItem('my_cart', JSON.stringify(cart));
  }, [cart]);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  // 🔥 دالة الإضافة المعدلة (مع فحص الكمية) 🔥
  const addToCart = (product) => {
    // 1. البحث هل المنتج موجود مسبقاً في السلة؟
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // 2. تحديد الحد الأقصى (نأخذه من البيانات المحفوظة أو من المنتج الجديد)
      const maxLimit = existingItem.maxQuantity || product.quantity;

      // 3. فحص: هل وصلنا للحد الأقصى؟
      if (existingItem.quantity >= maxLimit) {
        alert(`عذراً، الكمية المتوفرة لهذا المنتج هي ${maxLimit} فقط!`);
        return; // ⛔ توقف هنا ولا تضف المزيد
      }

      // 4. إذا لم نصل للحد، نزيد الكمية
      setCart((prev) => prev.map((item) => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));

    } else {
      // 5. منتج جديد: نضيفه ونحفظ معه "الحد الأقصى" (maxQuantity)
      setCart((prev) => [...prev, { ...product, quantity: 1, maxQuantity: product.quantity }]);
    }
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const decreaseQuantity = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);