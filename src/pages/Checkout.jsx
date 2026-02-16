import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', address: '', card: '' });

  const handlePayment = (e) => {
    e.preventDefault();
    alert(`تم الدفع بنجاح يا ${formData.name}! شكراً لطلبك.`);
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) return <div className="text-center mt-20">لا توجد منتجات للدفع!</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">بيانات الشحن والدفع</h2>
        <form onSubmit={handlePayment} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-2">الاسم الكامل</label>
            <input 
              required
              type="text" 
              className="w-full border p-3 rounded focus:outline-blue-500"
              placeholder="مثال: أحمد محمد"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">العنوان</label>
            <input 
              required
              type="text" 
              className="w-full border p-3 rounded focus:outline-blue-500"
              placeholder="المدينة، الشارع، رقم المنزل"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رقم البطاقة (وهمي)</label>
            <input 
              required
              type="text" 
              className="w-full border p-3 rounded focus:outline-blue-500"
              placeholder="0000 0000 0000 0000"
              value={formData.card}
              onChange={(e) => setFormData({...formData, card: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition mt-4">
            تأكيد ودفع ${total.toFixed(2)}
          </button>
        </form>
      </div>

      <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg border h-fit">
        <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
        <div className="flex flex-col gap-3 mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.title.substring(0, 20)}... (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>الإجمالي</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}