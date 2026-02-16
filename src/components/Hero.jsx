import { useSettings } from '../context/SettingsContext';

export default function Hero() {
  const { t } = useSettings(); // جلب النصوص

  return (
    <div className="bg-slate-900 dark:bg-gray-800 text-white py-20 px-4 mb-12 rounded-2xl shadow-xl relative overflow-hidden transition-colors duration-300">
      
      {/* خلفية جمالية */}
      <div className="absolute top-0 right-0 ltr:right-0 rtl:left-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600 opacity-20 blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-start"> {/* text-start مهم جداً */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.heroTitle}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t.heroSubtitle}
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            {t.heroDesc}
          </p>
          <a href="#products-section" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition transform hover:scale-105 hover:shadow-lg inline-block">
            {t.browseBtn}
          </a>
        </div>
        
        <div className="md:w-1/2 flex justify-center perspective-1000">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
            alt="Shopping Model" 
            className="h-64 md:h-96 w-full object-cover rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500 border-4 border-slate-800 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}