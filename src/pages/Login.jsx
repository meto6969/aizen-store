import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const { login, isAuth } = useProducts();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  // إذا كان مسجلاً للدخول بالفعل، حوله للأدمن
  if (isAuth) {
    navigate('/admin');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(user, pass);
    if (success) {
      navigate('/admin');
    } else {
      setError("خطأ: اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">تسجيل دخول المدير</h1>
          <p className="text-gray-500 mt-2">يرجى إدخال بيانات الدخول للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-3 top-2.5 text-gray-400" size={20} />
              <input 
                type="text" 
                required
                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="أدخل اسم المستخدم"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-2.5 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 mt-4">
            دخول
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/shop')} className="text-sm text-gray-500 hover:text-blue-600 underline">
            العودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
}