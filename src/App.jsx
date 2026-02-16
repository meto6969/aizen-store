import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login'; // 👈 استدعاء صفحة الدخول الجديدة
import Footer from './components/Footer';
import { useProducts } from './context/ProductContext';

function App() {
  const { isAuth, theme } = useProducts();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-24" style={{ backgroundColor: theme?.bg || '#f8fafc' }}>
      <Navbar />
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/shop" />} />
          <Route path="/shop" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          
          {/* 🔥 التعديل هنا: إذا لم يكن مسجلاً، اعرض صفحة Login بدلاً من الزر القديم */}
          <Route path="/admin" element={isAuth ? <Admin /> : <Login />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;