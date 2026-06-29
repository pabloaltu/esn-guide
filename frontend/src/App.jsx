import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Menu, User, X, Maximize2, Minimize2, MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SLOVAKIA_CENTER = [48.6690, 19.6990];

// --- CRÉATION DES ICÔNES PERSONNALISÉES POUR LA CARTE ---
const createCustomIcon = (emoji) => {
  return L.divIcon({
    html: `<div style="font-size: 24px; background: white; p-1.5 rounded-full shadow-md text-center border-2 border-cyan-500 w-9 h-9 flex items-center justify-center rounded-full bg-white">${emoji}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const icons = {
  accommodation: createCustomIcon('🏨'),
  restaurant: createCustomIcon('🍴'),
  hiking: createCustomIcon('🥾'),
  monument: createCustomIcon('🏰'),
  default: createCustomIcon('📍')
};

// --- TRADUCTIONS ---
const translations = {
  en: {
    title: "Where to go in Slovakia?",
    subtitle: "Discover hotels, restaurants and amazing spots recommended by Erasmus students.",
    searchPlaceholder: "Search by region (Bratislava, Kosice, Poprad...)",
    filterTitle: "Explore Regions",
    allRegions: "All Regions",
    popularTitle: "Trending Destinations",
    views: "views",
    isicBadge: "🔥 ISIC Discount!",
    btnSeeOn: "Book / View",
    mapShow: "Show Map",
    mapHide: "Minimize",
    profile: "My Profile",
    login: "Sign In",
    menuHelp: "Help & Guide",
    menuAbout: "About ESN"
  },
  fr: {
    title: "Où aller en Slovaquie ?",
    subtitle: "Découvre les hôtels, restos et spots incroyables recommandés par les étudiants Erasmus.",
    searchPlaceholder: "Rechercher une région (Bratislava, Kosice, Poprad...)",
    filterTitle: "Explorer les Régions",
    allRegions: "Toutes les Régions",
    popularTitle: "Destinations Tendances",
    views: "vues",
    isicBadge: "🔥 Réduction ISIC !",
    btnSeeOn: "Réserver / Voir",
    mapShow: "Afficher la Carte",
    mapHide: "Réduire",
    profile: "Mon Profil",
    login: "Connexion",
    menuHelp: "Aide & Guide",
    menuAbout: "À propos d'ESN"
  }
};

export default function App() {
  const [places, setPlaces] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('en');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    let url = 'http://localhost:8000/api/places';
    if (selectedDistrict) {
      url += `?district=${selectedDistrict}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Optionnel : Filtrer aussi par texte saisi dans la barre de recherche
        if (searchQuery) {
          const filtered = data.filter(p => p.district.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setPlaces(filtered);
        } else {
          setPlaces(data);
        }
      })
      .catch(error => console.error("Erreur:", error));
  }, [selectedDistrict, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans relative">
      
      {/* ==========================================
          HEADER TRIPLE SECTIONS
         ========================================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-3 flex justify-between items-center shadow-sm">
        {/* À GAUCHE : Menu Déroulant */}
        <div className="relative">
          <button onClick={() => setIsNavMenuOpen(!isNavMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
            <Menu size={24} />
          </button>
          {isNavMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{t.menuHelp}</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{t.menuAbout}</button>
            </div>
          )}
        </div>

        {/* AU CENTRE : Logo & Langues */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-cyan-600 tracking-tight cursor-pointer" onClick={() => { setSelectedDistrict(''); setSearchQuery(''); }}>
            ESN<span className="text-pink-500">Guide</span>
          </span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-md text-xs font-bold">
            <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-white shadow text-cyan-600' : 'text-gray-500'}`}>EN</button>
            <button onClick={() => setLang('fr')} className={`px-2 py-0.5 rounded ${lang === 'fr' ? 'bg-white shadow text-cyan-600' : 'text-gray-500'}`}>FR</button>
          </div>
        </div>

        {/* À DROITE : Profil Utilisateur */}
        <div className="relative">
          <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 text-gray-700 border border-gray-200 shadow-sm rounded-full px-3">
            <User size={18} />
            <span className="text-xs font-semibold hidden sm:inline">{t.profile}</span>
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-medium text-cyan-600">{t.login}</button>
            </div>
          )}
        </div>
      </header>

      {/* ==========================================
          HERO BANNER (Façon TripAdvisor)
         ========================================== */}
      <section className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white py-16 px-6 text-center shadow-inner relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">{t.title}</h2>
          <p className="text-base md:text-lg opacity-90 mb-8 font-medium max-w-xl mx-auto">{t.subtitle}</p>
          
          {/* BARRE DE RECHERCHE PRINCIPALE */}
          <div className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto border-2 border-white focus-within:border-cyan-400 transition-all">
            <Search className="text-gray-400 ml-3" size={22} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent p-2 text-gray-800 font-medium focus:outline-none placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
      </section>

      {/* ==========================================
          CONTENU : GRILLE DES CARTES DE LIEUX
         ========================================== */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 flex-1">
        {/* BOUTONS FILTRES RAPIDES RÉGIONS */}
        <h3 className="text-xl font-bold mb-4 text-gray-800">{t.filterTitle}</h3>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button onClick={() => setSelectedDistrict('')} className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm border transition-all shrink-0 ${!selectedDistrict ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{t.allRegions}</button>
          {['Bratislava', 'Trnava', 'Trencin', 'Nitra', 'Zilina', 'Banska Bystrica', 'Poprad', 'Kosice'].map(dist => (
            <button key={dist} onClick={() => setSelectedDistrict(dist)} className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm border transition-all shrink-0 ${selectedDistrict === dist ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{dist}</button>
          ))}
        </div>

        {/* GRILLE DES ADRESSES */}
        <h3 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">{t.popularTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {places.map((place) => (
            <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img 
                  src={place.image_url || `https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=600&q=80`} 
                  alt={place.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                  {place.category === 'Accommodation' ? '🏨 Hotel' : place.category === 'Restaurant' ? '🍴 Resto' : place.category === 'Hiking' ? '🥾 Rando' : '🏰 Spot'}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-cyan-600 transition-colors">{place.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {place.district}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-400">👀 {place.views_count} {t.views}</span>
                  {place.has_isic_discount && <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-0.5 rounded border border-green-200">ISIC %</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ==========================================
          POP-UP CARTE RIGIDE (En bas à droite)
         ========================================== */}
      <div 
        className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col
          ${isMapExpanded ? 'w-[calc(100vw-3rem)] h-[calc(100vh-6rem)] sm:w-[600px] sm:h-[500px]' : 'w-72 h-44'}`}
      >
        {/* Entête du Pop-up Carte */}
        <div className="bg-gray-900 text-white px-4 py-2.5 flex justify-between items-center font-bold text-xs">
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-cyan-400" /> Live Map ({places.length})</span>
          <div className="flex gap-1">
            <button onClick={() => setIsMapExpanded(!isMapExpanded)} className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-300">
              {isMapExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Zone de la Carte */}
        <div className="flex-1 relative bg-gray-100">
          <MapContainer center={SLOVAKIA_CENTER} zoom={6.5} style={{ width: '100%', height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {places.map(place => {
              const lat = parseFloat(place.latitude);
              const lng = parseFloat(place.longitude);
              if (isNaN(lat) || isNaN(lng)) return null;

              // Détermination de l'icône selon la catégorie
              const iconType = icons[place.category.toLowerCase()] || icons.default;

              return (
                <Marker key={place.id} position={[lat, lng]} icon={iconType}>
                  <Popup>
                    <div className="w-48 font-sans">
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">{place.name}</h3>
                      <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider mt-0.5 mb-2">{place.category}</p>
                      {place.external_link && (
                        <a href={place.external_link} target="_blank" rel="noopener noreferrer" className="block text-center bg-cyan-600 text-white text-[10px] font-bold py-1 px-2 rounded mt-1">
                          {t.btnSeeOn} ➔
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

    </div>
  );
}