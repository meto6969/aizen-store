import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, Trash2, Edit, Layout, Settings, LogOut, Shield, ScanBarcode, Camera, X, Layers, Plus, Store, Palette, Phone, MapPin, Facebook, Instagram, Video, Zap } from 'lucide-react';
import { useZxing } from "react-zxing";

// 🔥 دالة الضغط الخارق (السر الجديد للسرعة) 🔥
// تقوم بتحويل الصور إلى صيغة WebP الخفيفة جداً وتصغير العرض إلى 400 بكسل
const superResizeImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400; // تصغير العرض لتخفيف الحجم جداً
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // 🔥 تحويل الصورة إلى WebP بجودة 50% (حجمها سيكون كيلوبايتات معدودة!)
      resolve(canvas.toDataURL('image/webp', 0.5)); 
    };
    img.onerror = (err) => reject(err);
  });
};

const BarcodeScanner = ({ onScan, onClose }) => {
  const { ref } = useZxing({ onDecodeResult(result) { onScan(result.getText()); }, constraints: { video: { facingMode: "environment" } } });
  return ( <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"> <div className="w-full max-w-sm relative"> <button onClick={onClose} className="absolute -top-12 right-0 text-white bg-white/20 p-2 rounded-full"><X size={24}/></button> <div className="relative border-4 border-blue-500 rounded-lg overflow-hidden aspect-square bg-black"> <video ref={ref} className="w-full h-full object-cover" /> </div> </div> </div> );
};

export default function Admin() {
  const { products, addProduct, deleteProduct, updateProduct, categories, addCategory, deleteCategory, logout, updateAdminCredentials, adminConfig, hero, updateHero, storeInfo, updateStoreInfo, theme, updateTheme, footerData, updateFooter } = useProducts();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  
  // حالة عملية التحسين الخارق
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState("");

  const initialForm = { title: '', price: '', quantity: '', description: '', image: '', image2: '', category: '', barcode: '' };
  const [formData, setFormData] = useState(initialForm);
  const [adminForm, setAdminForm] = useState(adminConfig);
  const [heroForm, setHeroForm] = useState(hero || {});
  const [storeForm, setStoreForm] = useState(storeInfo || {});
  const [themeForm, setThemeForm] = useState(theme || {});
  const [footerForm, setFooterForm] = useState(footerData || { phone: '', address: '', facebook: '', instagram: '', tiktok: '', desc: '' });
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => { if (hero) setHeroForm(hero); }, [hero]);
  useEffect(() => { if (storeInfo) setStoreForm(storeInfo); }, [storeInfo]);
  useEffect(() => { if (theme) setThemeForm(theme); }, [theme]);
  useEffect(() => { if (footerData) setFooterForm(footerData); }, [footerData]);

  const handleImageUploadWithCompression = async (e, setter, currentData) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const compressed = await superResizeImage(event.target.result);
          setter({ ...currentData, image: compressed });
        } catch (error) { console.error(error); }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const compressed = await superResizeImage(event.target.result);
          setFormData(prev => ({ ...prev, [fieldName]: compressed }));
        } catch (error) { console.error(error); }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoUpload = (e) => handleImageUploadWithCompression(e, setStoreForm, storeForm);
  const handleHeroUpload = (e) => handleImageUploadWithCompression(e, setHeroForm, heroForm);

  // 🔥🔥🔥 دالة الضغط الخارق لكل المنتجات القديمة 🔥🔥🔥
  const superOptimizeAllProducts = async () => {
    if (!window.confirm("سيتم ضغط جميع صور المنتجات بشكل خارق (WebP) لتسريع الموقع وجعله يفتح في ثانية واحدة. هل أنت متأكد؟")) return;
    
    setIsOptimizing(true);
    let count = 0;
    const total = products.length;

    for (let product of products) {
      setOptimizeProgress(`جاري المعالجة الخارقة للمنتج ${count + 1} من ${total}...`);
      let updates = {};
      let needsUpdate = false;

      // فحص وتحويل الصورة الأولى
      if (product.image && product.image.startsWith('data:image')) {
        try {
            const compressed = await superResizeImage(product.image);
            if (product.image !== compressed) {
                updates.image = compressed;
                needsUpdate = true;
            }
        } catch (e) { console.error("Error optimizing image 1", e); }
      }

      // فحص وتحويل الصورة الثانية
      if (product.image2 && product.image2.startsWith('data:image')) {
        try {
            const compressed2 = await superResizeImage(product.image2);
            if (product.image2 !== compressed2) {
                updates.image2 = compressed2;
                needsUpdate = true;
            }
        } catch (e) { console.error("Error optimizing image 2", e); }
      }

      if (needsUpdate) {
        await updateProduct(product.id, updates);
      }
      count++;
    }

    setIsOptimizing(false);
    setOptimizeProgress("");
    alert("✅ اكتمل الضغط الخارق بنجاح! الموقع الآن صاروخ 🚀");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("الصورة مطلوبة!");
    const productData = { ...formData, price: Number(formData.price), quantity: Number(formData.quantity), category: formData.category || categories[0], barcode: formData.barcode || String(Date.now()) };
    try {
      if (isEditing) { await updateProduct(currentId, productData); alert("تم التعديل"); setIsEditing(false); } 
      else { await addProduct(productData); alert("تمت الإضافة"); }
      setFormData(initialForm);
    } catch (err) { alert("خطأ: " + err.message); }
  };

  const handleDelete = async (id) => { if (window.confirm("حذف المنتج نهائياً؟")) deleteProduct(id); };
  const startEdit = (p) => { setIsEditing(true); setCurrentId(p.id); setFormData(p); window.scrollTo({ top: 2500, behavior: 'smooth' }); };
  const handleAddCategory = () => { if (!newCatName.trim()) return; addCategory(newCatName.trim()); setNewCatName(""); };
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8 pb-20">
      {showCamera && <BarcodeScanner onScan={(code) => { setFormData({...formData, barcode: code}); setShowCamera(false); }} onClose={() => setShowCamera(false)} />}

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield className="text-blue-600" /> لوحة التحكم</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition"><LogOut size={20} /> خروج</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex gap-2 text-gray-700"><Settings /> إعدادات الحساب</h2>
          <div className="space-y-3">
            <input className="w-full p-2 border rounded" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} placeholder="المستخدم"/>
            <input className="w-full p-2 border rounded" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} placeholder="الرقم السري"/>
            <input className="w-full p-2 border rounded" value={adminForm.phone} onChange={e => setAdminForm({...adminForm, phone: e.target.value})} placeholder="رقم الواتساب"/>
            <button onClick={() => { updateAdminCredentials(adminForm.username, adminForm.password, adminForm.phone); alert("تم الحفظ!"); }} className="bg-gray-800 text-white py-2 px-4 rounded w-full">حفظ البيانات</button>
            
            {/* 🔥 زر الضغط الخارق الجديد 🔥 */}
            <div className="mt-6 pt-4 border-t">
                <h3 className="font-bold text-sm text-red-600 mb-2 flex items-center gap-1"><Zap size={16}/> حل مشكلة البطء</h3>
                <button 
                  onClick={superOptimizeAllProducts} 
                  disabled={isOptimizing}
                  className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition ${isOptimizing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}`}
                >
                  <Zap size={20} fill="currentColor" />
                  {isOptimizing ? "جاري المعالجة الخارقة..." : "ضغط خارق لكل الصور (تسريع الموقع)"}
                </button>
                {isOptimizing && <p className="text-xs text-center text-red-600 mt-2 font-bold animate-pulse">{optimizeProgress}</p>}
                <p className="text-[10px] text-gray-400 mt-2 text-center">اضغط هذا الزر مرة واحدة لتقليل حجم البيانات وجعل المتجر يفتح بثانية واحدة.</p>
            </div>

          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex gap-2 text-gray-700"><Store /> هوية المتجر</h2>
              <div className="space-y-3">
                <input className="w-full p-2 border rounded" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} placeholder="اسم المتجر"/>
                <div className="flex items-center gap-4">
                  <input type="file" onChange={handleLogoUpload} className="text-sm text-gray-500 flex-1"/>
                  {storeForm.logo && <img src={storeForm.logo} className="w-10 h-10 object-contain border rounded"/>}
                </div>
                <button onClick={() => { updateStoreInfo(storeForm); alert("تم التحديث!"); }} className="bg-blue-600 text-white py-2 px-4 rounded w-full">تحديث الاسم والشعار</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex gap-2 text-gray-700"><Palette /> الألوان</h2>
              <div className="flex gap-4">
                 <div className="flex-1"><label className="text-xs">الرئيسي</label><input type="color" value={themeForm.primary} onChange={e => setThemeForm({...themeForm, primary: e.target.value})} className="w-full h-8 cursor-pointer rounded"/></div>
                 <div className="flex-1"><label className="text-xs">الخلفية</label><input type="color" value={themeForm.bg} onChange={e => setThemeForm({...themeForm, bg: e.target.value})} className="w-full h-8 cursor-pointer rounded"/></div>
              </div>
              <button onClick={() => { updateTheme(themeForm); alert("تم تغيير الألوان!"); }} className="mt-3 bg-gray-800 text-white py-2 px-4 rounded w-full">حفظ الألوان</button>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex gap-2 text-gray-700"><Phone /> معلومات التواصل والفوتر</h2>
        <div className="mb-4">
           <label className="text-xs text-gray-500 font-bold block mb-1">وصف الفوتر (الجملة الترحيبية)</label>
           <textarea className="w-full p-2 border rounded-lg h-16 resize-none" placeholder="مثال: تسوق معنا واستمتع بأفضل العروض..." value={footerForm.desc} onChange={e => setFooterForm({...footerForm, desc: e.target.value})}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div><label className="text-xs text-gray-500 font-bold">عنوان المتجر</label><div className="relative mt-1"><MapPin className="absolute right-3 top-2.5 text-gray-400" size={18}/><input className="w-full pr-10 pl-3 py-2 border rounded-lg" placeholder="بغداد، المنصور..." value={footerForm.address} onChange={e => setFooterForm({...footerForm, address: e.target.value})}/></div></div>
           <div><label className="text-xs text-gray-500 font-bold">رقم الهاتف الظاهر للزبائن</label><div className="relative mt-1"><Phone className="absolute right-3 top-2.5 text-gray-400" size={18}/><input className="w-full pr-10 pl-3 py-2 border rounded-lg" placeholder="077..." value={footerForm.phone} onChange={e => setFooterForm({...footerForm, phone: e.target.value})}/></div></div>
           <div><label className="text-xs text-gray-500 font-bold">رابط فيسبوك</label><div className="relative mt-1"><Facebook className="absolute right-3 top-2.5 text-blue-600" size={18}/><input className="w-full pr-10 pl-3 py-2 border rounded-lg text-left" dir="ltr" placeholder="https://facebook.com/..." value={footerForm.facebook} onChange={e => setFooterForm({...footerForm, facebook: e.target.value})}/></div></div>
           <div><label className="text-xs text-gray-500 font-bold">رابط انستغرام</label><div className="relative mt-1"><Instagram className="absolute right-3 top-2.5 text-pink-600" size={18}/><input className="w-full pr-10 pl-3 py-2 border rounded-lg text-left" dir="ltr" placeholder="https://instagram.com/..." value={footerForm.instagram} onChange={e => setFooterForm({...footerForm, instagram: e.target.value})}/></div></div>
           <div><label className="text-xs text-gray-500 font-bold">رابط تيك توك</label><div className="relative mt-1"><Video className="absolute right-3 top-2.5 text-black" size={18}/><input className="w-full pr-10 pl-3 py-2 border rounded-lg text-left" dir="ltr" placeholder="https://tiktok.com/..." value={footerForm.tiktok} onChange={e => setFooterForm({...footerForm, tiktok: e.target.value})}/></div></div>
        </div>
        <button onClick={() => { updateFooter(footerForm); alert("تم تحديث الفوتر!"); }} className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-bold w-full md:w-auto shadow-lg transition">حفظ معلومات التواصل</button>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="font-bold mb-4 flex gap-2 items-center text-xl border-b border-slate-700 pb-2"><Layout className="text-blue-400"/> إعدادات واجهة المتجر</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <input className="w-full bg-slate-800 p-3 rounded border border-slate-600 outline-none" placeholder="العنوان الرئيسي" value={heroForm.title} onChange={e=>setHeroForm({...heroForm, title:e.target.value})}/>
            <input className="w-full bg-slate-800 p-3 rounded border border-slate-600 outline-none" placeholder="العنوان الفرعي" value={heroForm.subtitle} onChange={e=>setHeroForm({...heroForm, subtitle:e.target.value})}/>
            <textarea className="w-full bg-slate-800 p-3 rounded border border-slate-600 outline-none h-20" placeholder="الوصف..." value={heroForm.desc} onChange={e=>setHeroForm({...heroForm, desc:e.target.value})}></textarea>
          </div>
          <div className="w-full md:w-48">
             <div className="relative group cursor-pointer border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl h-48 flex flex-col items-center justify-center bg-slate-800 transition overflow-hidden">
              <input type="file" onChange={handleHeroUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer"/>
              {heroForm.image ? <img src={heroForm.image} className="w-full h-full object-contain p-2" /> : <div className="text-center text-slate-500"><Upload className="mx-auto mb-2"/><span className="text-xs">اضغط للرفع</span></div>}
            </div>
          </div>
        </div>
        <button onClick={() => { updateHero(heroForm); alert("تم تحديث الواجهة!"); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full mt-4 transition shadow-lg">تحديث الواجهة</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex gap-2 text-gray-700"><Layers /> إدارة الأقسام</h2>
        <div className="flex gap-2 mb-6">
          <input className="flex-1 p-2 border rounded-lg outline-none" placeholder="اسم القسم الجديد" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}/>
          <button onClick={handleAddCategory} className="bg-green-600 text-white px-4 rounded-lg font-bold"><Plus size={20} /></button>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <div key={index} className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-3 border shadow-sm group hover:bg-white transition">
              <span className="font-bold">{cat}</span>
              <button onClick={() => { if(window.confirm(`حذف قسم "${cat}"؟`)) deleteCategory(cat); }} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden">
        <h2 className="text-xl font-bold mb-6 flex gap-2 text-gray-800">{isEditing ? <Edit className="text-yellow-500"/> : <PlusCircle className="text-blue-600"/>} {isEditing ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
             <div className="w-32 h-32 relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 group hover:border-blue-500 overflow-hidden">
               {formData.image ? <img src={formData.image} className="w-full h-full object-contain"/> : <div className="text-center text-gray-400 text-xs">رئيسية</div>}
               <input type="file" onChange={(e) => handleProductImageUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
             <div className="w-32 h-32 relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 group hover:border-blue-500 overflow-hidden">
               {formData.image2 ? <img src={formData.image2} className="w-full h-full object-contain"/> : <div className="text-center text-gray-400 text-xs">ثانوية</div>}
               <input type="file" onChange={(e) => handleProductImageUpload(e, 'image2')} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
             <div className="flex-1 space-y-4">
               <div className="flex gap-2">
                 <div className="relative flex-1"><ScanBarcode className="absolute right-3 top-2.5 text-gray-400" size={20} /><input type="text" className="w-full pr-10 pl-4 py-2 border rounded-lg font-mono text-lg" placeholder="الباركود" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} /></div>
                 <button type="button" onClick={() => setShowCamera(true)} className="bg-slate-800 text-white px-4 rounded-lg flex items-center gap-2"><Camera size={20}/> مسح</button>
               </div>
               <input required className="w-full p-2 border rounded-lg" placeholder="اسم المنتج" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               <textarea className="w-full p-2 border rounded-lg h-20" placeholder="وصف المنتج..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
               <div className="flex gap-4">
                 <input required type="number" className="w-1/3 p-2 border rounded-lg" placeholder="السعر" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 <input required type="number" className="w-1/3 p-2 border rounded-lg" placeholder="الكمية" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                 <select className="w-1/3 p-2 border rounded-lg bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option value="" disabled>القسم</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
               </div>
             </div>
          </div>
          <div className="flex gap-3">
            <button className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg ${isEditing ? 'bg-yellow-500' : 'bg-blue-600'}`}>{isEditing ? 'حفظ التعديلات' : 'نشر المنتج'}</button>
            {isEditing && <button type="button" onClick={() => {setIsEditing(false); setFormData(initialForm);}} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">إلغاء</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600 border-b"><tr><th className="p-4">صور</th><th>الباركود</th><th>الاسم</th><th>القسم</th><th>الكمية</th><th>السعر</th><th>تحكم</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 flex gap-1">
                    <img src={p.image} className="w-10 h-10 object-contain rounded border"/>
                    {p.image2 && <img src={p.image2} className="w-10 h-10 object-contain rounded border opacity-70"/>}
                  </td>
                  <td className="font-mono text-sm text-gray-500">{p.barcode}</td>
                  <td className="font-bold text-gray-800">{p.title}</td>
                  <td className="text-sm text-blue-500">{p.category}</td>
                  <td className={`font-bold ${p.quantity > 0 ? 'text-blue-600' : 'text-red-500'}`}>{p.quantity} {p.quantity === 0 && <span className="text-xs bg-red-100 px-1 rounded">نفذت</span>}</td>
                  <td className="text-green-600 font-bold">{p.price.toLocaleString()}</td>
                  <td className="p-4 flex gap-2"><button onClick={() => startEdit(p)} className="p-2 bg-yellow-50 text-yellow-600 rounded"><Edit size={18}/></button><button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={18}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}