import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart, Store, Search, User } from 'lucide-react';

export default function Navbar() {
  const { cart } = useCart();
  const { searchQuery, setSearchQuery, storeInfo } = useProducts(); // 👈 استدعاء storeInfo

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center gap-4">
        
        {/* 🔥 الشعار والاسم (ديناميكي الآن) 🔥 */}
        <Link to="/shop" className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-700 transition">
          {storeInfo.logo ? (
            <img src={storeInfo.logo} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <Store />
          )}
          <span>{storeInfo.name}</span>
        </Link>

        {/* شريط البحث */}
        <div className="flex-1 max-w-md relative hidden md:block">
           <input 
             className="w-full border-2 border-gray-100 rounded-full py-2 px-10 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
             placeholder="ابحث عن منتج..." 
             value={searchQuery} 
             onChange={e => setSearchQuery(e.target.value)}
           />
           <Search className="absolute right-3 top-3 text-gray-400" size={20}/>
        </div>

        {/* الأيقونات */}
        <div className="flex gap-4 items-center">
          <Link to="/admin" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition" title="لوحة التحكم">
            <User size={24}/>
          </Link>
          
          <Link to="/cart" className="relative p-2 bg-gray-100 rounded-full hover:bg-yellow-100 text-gray-600 hover:text-yellow-600 transition">
            <ShoppingCart size={24}/>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* شريط البحث للموبايل */}
      <div className="mt-3 md:hidden relative">
        <input 
           className="w-full border rounded-lg py-2 px-10 bg-gray-50 outline-none" 
           placeholder="ابحث..." 
           value={searchQuery} 
           onChange={e => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20}/>
      </div>
    </nav>
  );
}