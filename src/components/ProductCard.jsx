import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Plus, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useSettings();

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative overflow-hidden">
      
      <span className="absolute top-3 right-3 rtl:right-3 ltr:left-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-full z-10">
        {product.category}
      </span>

      <Link to={`/product/${product.id}`} className="flex-grow flex flex-col items-center mb-4 overflow-hidden">
        <div className="h-48 w-full flex items-center justify-center p-4 bg-white rounded-lg"> {/* أبقينا خلفية الصورة بيضاء لتظهر بوضوح */}
          <img 
            src={product.image} 
            alt={product.title} 
            className="h-full object-contain transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        <div className="w-full mt-4">
          <h3 className="font-bold text-gray-800 dark:text-white truncate group-hover:text-blue-600 transition mb-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{product.rating?.rate}</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
        <span className="text-xl font-bold text-gray-900 dark:text-blue-400">${product.price}</span>
        <button 
          onClick={() => addToCart(product)}
          className="bg-slate-900 dark:bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="text-sm font-bold">{t.addToCart}</span>
        </button>
      </div>
    </div>
  );
}