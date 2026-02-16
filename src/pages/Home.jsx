import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Package, ArrowUpDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { products, categories, searchQuery, loading, hero, theme } = useProducts();
  const { addToCart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortOrder, setSortOrder] = useState("default"); 

  // 1. التصفية
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.barcode && p.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === "الكل" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. الترتيب
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "newest": return String(b.id).localeCompare(String(a.id));
      case "oldest": 
      default: return String(a.id).localeCompare(String(b.id));
    }
  });

  if (loading) return (
    <div className="container mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
       {[...Array(8)].map((_,i) => <div key={i} className="bg-white rounded-xl h-64 border border-gray-100 skeleton-pulse"></div>)}
    </div>
  );

  return (
    <div className="container mx-auto p-4 pb-24 md:pb-20 animate-fade-in">
      
      {/* البانر */}
      <div style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }} className="rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transform transition hover:scale-[1.01] duration-500">
        <div className="relative z-10 max-w-lg text-center md:text-right">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{hero.title}</h1>
          <h2 className="text-lg md:text-2xl font-light mb-4 text-blue-100">{hero.subtitle}</h2>
          <p className="mb-6 opacity-90 text-sm md:text-base">{hero.desc}</p>
        </div>
        {hero.image && <img src={hero.image} className="w-40 h-40 md:w-64 md:h-64 object-contain relative z-10 animate-fade-in" />}
      </div>

      {/* 🔥 قسم الفلاتر والترتيب (تصميم جديد) 🔥 */}
      <div className="flex flex-col gap-6 mb-8">
        
        {/* السطر العلوي: العنوان وقائمة الترتيب */}
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-gray-800 border-r-4 border-blue-600 pr-3">تصفح الأقسام</h2>
           
           {/* قائمة الترتيب */}
           <div className="relative w-40 md:w-48">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <ArrowUpDown size={16} />
              </div>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pr-9 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold shadow-sm cursor-pointer"
              >
                <option value="default">الأقدم (الافتراضي)</option>
                <option value="newest">الأحدث (جديدنا)</option>
                <option value="price-low">السعر: الأقل أولاً</option>
                <option value="price-high">السعر: الأكثر أولاً</option>
              </select>
           </div>
        </div>

        {/* 🔥 الأقسام: شريط في الموبايل، وتلتف (Wrap) في الحاسوب 🔥 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-start">
          <button 
            onClick={() => setSelectedCategory("الكل")} 
            style={{ 
              backgroundColor: selectedCategory === "الكل" ? theme.primary : 'white', 
              color: selectedCategory === "الكل" ? 'white' : 'gray' 
            }} 
            className="px-5 py-2.5 rounded-full whitespace-nowrap text-sm md:text-base transition duration-300 shadow-sm border hover:shadow-md font-bold"
          >
            الكل
          </button>
          
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              style={{ 
                backgroundColor: selectedCategory === cat ? theme.primary : 'white', 
                color: selectedCategory === cat ? 'white' : 'gray' 
              }} 
              className="px-5 py-2.5 rounded-full whitespace-nowrap text-sm md:text-base transition duration-300 shadow-sm border hover:shadow-md font-bold"
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-1">
              <Link to={`/product/${product.id}`} className="h-36 md:h-52 p-4 bg-gray-50 relative overflow-hidden block">
                <img src={product.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" loading="lazy" />
                {product.quantity === 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]"><span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold shadow">نفذت</span></div>}
              </Link>
              
              <div className="p-3 md:p-4 flex flex-col flex-1">
                <Link to={`/product/${product.id}`} className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm md:text-base flex-1 hover:text-blue-600 transition">
                  {product.title}
                </Link>
                
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 mb-3">
                  <Package size={14}/> <span>المتبقي: {product.quantity}</span>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <div><span className="text-base md:text-lg font-bold" style={{ color: theme.primary }}>{product.price.toLocaleString()}</span> <span className="text-[10px] md:text-xs text-gray-500 mr-1">د.ع</span></div>
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product); }} 
                    disabled={product.quantity === 0} 
                    style={{ backgroundColor: product.quantity > 0 ? theme.primary : '#d1d5db' }}
                    className="p-2 md:p-2.5 rounded-full text-white shadow-md transition-all duration-200 active:scale-90 hover:opacity-90"
                  >
                    <ShoppingCart size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 flex flex-col items-center">
            <div className="text-gray-200 mb-4"><Filter size={64} /></div>
            <p className="text-gray-500 text-lg">لم يتم العثور على منتجات تطابق بحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
}