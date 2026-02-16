import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowRight, Star, Package } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, theme } = useProducts();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find(p => p.id === id);
  if (!product) return <div className="h-screen flex items-center justify-center">المنتج غير موجود</div>;

  return (
    <div className="container mx-auto p-4 pb-20 max-w-5xl animate-fade-in">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-bold">
        <ArrowRight size={20} /> العودة للمتجر
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* الصور */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center relative">
          <div className="w-full h-80 md:h-96 flex items-center justify-center mb-4">
             <img src={activeImage === 0 ? product.image : product.image2} className="max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-300"/>
          </div>
          {product.image2 && (
            <div className="flex gap-4">
              <button onClick={() => setActiveImage(0)} className={`w-16 h-16 border-2 rounded-lg p-1 ${activeImage === 0 ? 'border-blue-500' : 'border-gray-300'}`}><img src={product.image} className="w-full h-full object-contain"/></button>
              <button onClick={() => setActiveImage(1)} className={`w-16 h-16 border-2 rounded-lg p-1 ${activeImage === 1 ? 'border-blue-500' : 'border-gray-300'}`}><img src={product.image2} className="w-full h-full object-contain"/></button>
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <div className="text-3xl font-bold mb-6" style={{ color: theme.primary }}>{product.price.toLocaleString()} <span className="text-lg text-gray-500">د.ع</span></div>
          
          <div className="prose prose-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">الوصف:</h3>
            <p className="whitespace-pre-line leading-relaxed">{product.description || "لا يوجد وصف."}</p>
          </div>

          <div className="mt-auto">
             <div className="flex items-center gap-2 text-gray-500 mb-4"><Package size={18}/> <span>الكمية: {product.quantity}</span></div>
             <button onClick={() => addToCart(product)} disabled={product.quantity === 0} style={{ backgroundColor: product.quantity > 0 ? theme.primary : '#d1d5db' }} className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition active:scale-95 disabled:cursor-not-allowed">
               <ShoppingCart /> {product.quantity > 0 ? 'إضافة للسلة' : 'نفذت الكمية'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}