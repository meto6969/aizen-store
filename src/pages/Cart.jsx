import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Trash2, Plus, Minus, MessageCircle, ArrowRight, ShoppingBag, X, MapPin, User, Phone, FileText, Landmark } from 'lucide-react'; // 👈 أضفنا أيقونة Landmark
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, decreaseQuantity, addToCart, totalPrice, clearCart } = useCart();
  const { adminConfig, products, updateProduct } = useProducts();

  const [showModal, setShowModal] = useState(false);
  // 👇 أضفنا landmark هنا
  const [customer, setCustomer] = useState({ name: '', address: '', landmark: '', phone: '', notes: '' });

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setShowModal(true);
  };

  const sendOrderToWhatsapp = async (e) => {
    e.preventDefault();

    if (!customer.name || !customer.address || !customer.phone) {
      alert("يرجى ملء الاسم والعنوان ورقم الهاتف");
      return;
    }

    // خصم الكمية من قاعدة البيانات
    cart.forEach(cartItem => {
      const productInStore = products.find(p => p.id === cartItem.id);
      
      if (productInStore) {
        const newQuantity = productInStore.quantity - cartItem.quantity;
        updateProduct(cartItem.id, { 
          quantity: newQuantity >= 0 ? newQuantity : 0 
        });
      }
    });

    // تجهيز رسالة الواتساب
    let message = `🔔 *طلب جديد من المتجر*\n\n`;
    message += `👤 *معلومات الزبون:*\n`;
    message += `▪️ الاسم: ${customer.name}\n`;
    message += `▪️ العنوان: ${customer.address}\n`;
    // 👇 إضافة نقطة دالة للرسالة
    if (customer.landmark) message += `▪️ نقطة دالة: ${customer.landmark}\n`;
    message += `▪️ الهاتف: ${customer.phone}\n`;
    if (customer.notes) message += `▪️ ملاحظات: ${customer.notes}\n`;
    
    message += `\n🛒 *الطلبات:*\n`;
    cart.forEach(item => {
      message += `▫️ ${item.title} (العدد: ${item.quantity}) - ${(item.price * item.quantity).toLocaleString()} د.ع\n`;
    });
    
    message += `\n💰 *المجموع الكلي: ${totalPrice.toLocaleString()} د.ع*`;

    let phone = adminConfig.phone.replace(/^0+/, ''); 
    if (!phone.startsWith('964')) phone = '964' + phone;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setShowModal(false);
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-400"><ShoppingBag size={64} /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">سلتك فارغة</h2>
        <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات للسلة بعد.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2"><ArrowRight size={20} /> تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20 max-w-4xl relative">
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto"> {/* أضفنا scroll للمودال الصغير */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-bold text-lg text-gray-800">إكمال الطلب</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 bg-white p-1 rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <form onSubmit={sendOrderToWhatsapp} className="p-6 space-y-4">
              
              {/* الاسم */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400" size={18}/>
                  <input required type="text" className="w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="الاسم" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                </div>
              </div>

              {/* الهاتف */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 text-gray-400" size={18}/>
                  <input required type="tel" className="w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="077..." value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                </div>
              </div>

              {/* العنوان */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-gray-400" size={18}/>
                  <input required type="text" className="w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="المدينة، المنطقة..." value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
                </div>
              </div>

              {/* 🔥 خانة أقرب نقطة دالة الجديدة 🔥 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">أقرب نقطة دالة</label>
                <div className="relative">
                  <Landmark className="absolute right-3 top-3 text-gray-400" size={18}/>
                  <input 
                    type="text" 
                    className="w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                    placeholder="جامع، مدرسة، محل معروف..." 
                    value={customer.landmark} 
                    onChange={e => setCustomer({...customer, landmark: e.target.value})} 
                  />
                </div>
              </div>

              {/* الملاحظات */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ملاحظات إضافية</label>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 text-gray-400" size={18}/>
                  <textarea className="w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none" placeholder="ملاحظات..." value={customer.notes} onChange={e => setCustomer({...customer, notes: e.target.value})}></textarea>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"><MessageCircle size={20} /> تأكيد وإرسال للواتساب</button>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="text-blue-600" /> سلة المشتريات</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-contain bg-gray-50 rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-blue-600 font-bold">{item.price.toLocaleString()} د.ع</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-200 text-gray-700 transition"><Minus size={16}/></button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition"><Plus size={16}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs flex items-center gap-1 hover:underline"><Trash2 size={14} /> حذف</button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-80 h-fit bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">ملخص الطلب</h3>
          <div className="flex justify-between mb-2 text-gray-600"><span>عدد المنتجات</span><span>{cart.reduce((a, c) => a + c.quantity, 0)}</span></div>
          <div className="flex justify-between mb-6 text-xl font-bold text-gray-900"><span>المجموع الكلي</span><span className="text-blue-600">{totalPrice.toLocaleString()} د.ع</span></div>
          <button onClick={handleCheckoutClick} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"><MessageCircle size={24} /> إتمام الطلب</button>
          <button onClick={clearCart} className="w-full mt-3 text-red-500 text-sm hover:underline text-center">تفريغ السلة</button>
        </div>
      </div>
    </div>
  );
}