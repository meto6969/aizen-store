import { useProducts } from "../context/ProductContext";
import { Phone, MapPin, Facebook, Instagram, Video } from "lucide-react";

export default function Footer() {
  const { footerData, theme, storeInfo } = useProducts();

  if (!footerData) return null;

  return (
    <footer 
      style={{ backgroundColor: theme?.secondary || '#1e40af' }} 
      className="fixed bottom-0 left-0 w-full z-50 text-white py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-white/10"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-xs md:text-sm">
        
        {/* اليمين: الشعار والوصف */}
        <div className="flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
          <div className="flex items-center gap-2 font-bold shrink-0">
            {storeInfo.logo && <img src={storeInfo.logo} className="w-6 h-6 object-contain bg-white rounded-full p-0.5"/>}
            <span className="hidden sm:inline">{storeInfo.name}</span>
          </div>
          
          <span className="hidden sm:block w-px h-4 bg-white/30"></span>
          
          <p className="opacity-90 truncate max-w-[150px] sm:max-w-xs">
            {footerData.desc || "تسوق معنا بأفضل الأسعار"}
          </p>
        </div>

        {/* اليسار: معلومات التواصل (العنوان + الهاتف + الأيقونات) */}
        <div className="flex items-center gap-4 opacity-90 justify-center md:justify-end w-full md:w-auto">
          
          {/* 🔥 تم إرجاع العنوان هنا 🔥 */}
          {footerData.address && (
            <div className="flex items-center gap-1 hidden sm:flex"> {/* مخفي في الموبايل الصغير جداً لتوفير المساحة */}
              <MapPin size={14} className="text-blue-300"/> 
              <span>{footerData.address}</span>
            </div>
          )}

          {footerData.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-blue-300"/> 
              <span dir="ltr">{footerData.phone}</span>
            </div>
          )}
          
          <div className="flex gap-3 border-r border-white/20 pr-3 mr-1">
            {footerData.facebook && <a href={footerData.facebook} target="_blank" className="hover:text-blue-300"><Facebook size={16} /></a>}
            {footerData.instagram && <a href={footerData.instagram} target="_blank" className="hover:text-pink-300"><Instagram size={16} /></a>}
            {footerData.tiktok && <a href={footerData.tiktok} target="_blank" className="hover:text-gray-300"><Video size={16} /></a>}
          </div>
        </div>

      </div>
    </footer>
  );
}