import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Menu, User, X, Maximize2, Minimize2, MapPin, Search, Eye, Map as MapIcon, Heart, Star, ChevronLeft, ChevronRight, Lock, Settings } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SLOVAKIA_CENTER = [48.6690, 19.6990];

const createCustomIcon = (emoji) => L.divIcon({
  html: `<div class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-cyan-500 hover:border-pink-500 hover:scale-110 transition-transform duration-200 text-2xl">${emoji}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20],
});

const icons = { accommodation: createCustomIcon('🏨'), restaurant: createCustomIcon('🍴'), hiking: createCustomIcon('🥾'), monument: createCustomIcon('🏰'), default: createCustomIcon('📍') };

const translations = {
  en: { title: "Explore Slovakia", subtitle: "Find the best hotels, hikes, and student discounts curated by ESN.", searchPlaceholder: "Where are you going? (Bratislava, Kosice, Poprad...)", filterTitle: "Explore Regions", allRegions: "All Slovakia", popularTitle: "Recommended Places", views: "views", isicBadge: "✨ ISIC Discount Active", btnSeeOn: "Check Availability", mapShow: "Open Interactive Map", profile: "Profile", login: "Sign In", logout: "Sign Out", menuHelp: "Help & Student Guide", menuAbout: "About ESN Slovakia", detailsTitle: "View Details", close: "Close", mobileMapBtn: "View Map", noReviews: "No reviews yet", addReview: "Leave a review", loginRequired: "You must be signed in to leave a review.", authTitleLogin: "Sign In to ESN Guide", authTitleRegister: "Create Student Account", emailPlh: "your.email@domain.com", passwordPlh: "••••••••", usernamePlh: "ErasmusNick", btnAuthSubmitLogin: "Sign In", btnAuthSubmitRegister: "Create Account", switchRegister: "Don't have an account? Sign up", switchLogin: "Already have an account? Sign in", editProfile: "Edit Profile", saveProfile: "Save Changes" },
  fr: { title: "Explore la Slovaquie", subtitle: "Trouve les meilleurs hôtels, randos et réductions choisis par l'ESN.", searchPlaceholder: "Où vas-tu ? (Bratislava, Kosice, Poprad...)", filterTitle: "Explorer les Régions", allRegions: "Toute la Slovaquie", popularTitle: "Coins recommandés", views: "vues", isicBadge: "✨ Réduction ISIC Active", btnSeeOn: "Vérifier la disponibilité", mapShow: "Ouvrir la Carte", profile: "Profil", login: "Connexion", logout: "Déconnexion", menuHelp: "Aide & Guide Étudiant", menuAbout: "À propos d'ESN Slovaquie", detailsTitle: "Voir les Détails", close: "Fermer", mobileMapBtn: "Carte", noReviews: "Aucun avis pour le moment", addReview: "Laisser un avis", loginRequired: "Vous devez être connecté pour laisser un avis.", authTitleLogin: "Connexion à ESN Guide", authTitleRegister: "Créer un compte Étudiant", emailPlh: "votre.email@domaine.com", passwordPlh: "••••••••", usernamePlh: "PseudoErasmus", btnAuthSubmitLogin: "Se connecter", btnAuthSubmitRegister: "Créer le compte", switchRegister: "Pas encore de compte ? S'inscrire", switchLogin: "Déjà un compte ? Se connecter", editProfile: "Modifier le Profil", saveProfile: "Enregistrer" }
};

const IMAGE_BANK = {
  Hiking: [
    "https://images.pexels.com/photos/701816/pexels-photo-1542224566.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
  ],
  Monument: [
    "https://images.unsplash.com/photo-1563814838-f9ff2288eee8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?auto=format&fit=crop&w=800&q=80"
  ],
  Accommodation: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540548149366-85994290765a?auto=format&fit=crop&w=800&q=80"
  ],
  Restaurant: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
  ]
};

export default function App() {
  const [places, setPlaces] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [lang, setLang] = useState('en');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  // --- AUTH STATES ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('esn_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('esn_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthModalMode] = useState('login'); 
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState(''); // Double vérification
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');

  // --- PROFILE CONFIGURATION STATES ---
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileAge, setProfileAge] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileSchool, setProfileSchool] = useState('');
  const [profileIsic, setProfileIsic] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  const t = translations[lang];

  useEffect(() => {
    let url = 'http://localhost:8000/api/places';
    if (selectedDistrict) url += `?district=${selectedDistrict}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (searchQuery) {
          setPlaces(data.filter(p => p.district.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase())));
        } else {
          setPlaces(data);
        }
      });
  }, [selectedDistrict, searchQuery]);

  // Synchronisation des champs à l'ouverture de l'édition profil
  useEffect(() => {
    if (user) {
      setProfileAge(user.age || '');
      setProfileGender(user.gender || '');
      setProfileSchool(user.school || '');
      setProfileIsic(user.isic_number || '');
    }
  }, [user, isProfileModalOpen]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('esn_user');
    localStorage.removeItem('esn_token');
    setIsProfileMenuOpen(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Vérification de la similitude des mots de passe
    if (authMode === 'register' && authPassword !== authConfirmPassword) {
      setAuthError(lang === 'fr' ? "Les mots de passe ne correspondent pas !" : "Passwords do not match!");
      return;
    }

    const endpoint = authMode === 'login' ? 'login' : 'register';
    const bodyData = authMode === 'login' 
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, username: authUsername };

    try {
      const response = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'An error occurred');

      if (authMode === 'login') {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('esn_user', JSON.stringify(data.user));
        localStorage.setItem('esn_token', data.token);
        setIsAuthModalOpen(false);
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
      } else {
        setAuthModalMode('login');
        setAuthError(lang === 'fr' ? 'Compte créé ! Connectez-vous.' : 'Account created! Please sign in.');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // Mise à jour des informations additionnelles du profil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setAuthError('');
    setProfileSuccess('');

    // REGEX ISIC: Commence par S, suivi de 12 chiffres, se termine par une lettre
    const isicRegex = /^S\d{12}[A-Z]$/i;
    if (profileIsic && !isicRegex.test(profileIsic)) {
      setAuthError(lang === 'fr' 
        ? "Format ISIC invalide ! Attendu: S suivi de 12 chiffres et d'une lettre finale (ex: S123456789012X)" 
        : "Invalid ISIC format! Expected: S followed by 12 digits and a trailing letter (ex: S123456789012X)"
      );
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: profileAge ? parseInt(profileAge) : null,
          gender: profileGender,
          school: profileSchool,
          isic_number: profileIsic ? profileIsic.toUpperCase() : null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update failed');

      // Mettre à jour l'état utilisateur global
      const updatedUser = { ...user, age: profileAge, gender: profileGender, school: profileSchool, isic_number: profileIsic.toUpperCase() };
      setUser(updatedUser);
      localStorage.setItem('esn_user', JSON.stringify(updatedUser));
      setProfileSuccess(lang === 'fr' ? "Profil mis à jour !" : "Profile updated successfully!");
      setTimeout(() => setIsProfileModalOpen(false), 1200);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const submitRating = async (placeId, score) => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ place_id: placeId, rating: score, comment: "" })
      });
      if (response.ok) {
        setRatings(prev => ({ ...prev, [placeId]: score }));
      }
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  const handlePrevImage = (placeId, imageList, e) => {
    e.stopPropagation();
    const currentIndex = currentImageIndices[placeId] || 0;
    const nextIndex = currentIndex === 0 ? imageList.length - 1 : currentIndex - 1;
    setCurrentImageIndices(prev => ({ ...prev, [placeId]: nextIndex }));
  };

  const handleNextImage = (placeId, imageList, e) => {
    e.stopPropagation();
    const currentIndex = currentImageIndices[placeId] || 0;
    const nextIndex = currentIndex === imageList.length - 1 ? 0 : currentIndex + 1;
    setCurrentImageIndices(prev => ({ ...prev, [placeId]: nextIndex }));
  };

  const getImagesForPlace = (place) => {
    const category = place.category || 'Hiking';
    const baseList = IMAGE_BANK[category] || IMAGE_BANK.Hiking;
    const offset = (place.id || 0) % baseList.length;
    return [
      baseList[offset],
      baseList[(offset + 1) % baseList.length],
      baseList[(offset + 2) % baseList.length]
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 flex flex-col font-sans relative antialiased">
      
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-sm">
        <div className="flex-1 flex justify-start">
          <div className="relative">
            <button onClick={() => setIsNavMenuOpen(!isNavMenuOpen)} className="p-2 hover:bg-gray-50 active:scale-95 rounded-xl transition-all text-gray-600 border border-gray-100">
              <Menu size={20} />
            </button>
            {isNavMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">{t.menuHelp}</button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">{t.menuAbout}</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <span className="text-2xl font-extrabold tracking-tight cursor-pointer whitespace-nowrap bg-gradient-to-r from-cyan-600 via-blue-600 to-pink-500 bg-clip-text text-transparent" onClick={() => { setSelectedDistrict(''); setSearchQuery(''); }}>
            ESN<span className="font-semibold text-pink-500">Guide</span>
          </span>
          <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl text-xs font-bold border border-gray-200/50">
            <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-400'}`}>EN</button>
            <button onClick={() => setLang('fr')} className={`px-2.5 py-1 rounded-lg transition-all ${lang === 'fr' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-400'}`}>FR</button>
          </div>
        </div>

        <div className="flex-1 flex justify-end relative">
          <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={`p-2 hover:bg-gray-50 border border-gray-200/60 shadow-sm rounded-full px-4 flex items-center gap-2 text-gray-600 transition-all active:scale-95 ${user ? 'border-green-500 bg-green-50/30' : ''}`}>
            <User size={16} className={user ? "text-green-600" : ""} />
            <span className="text-xs font-bold hidden sm:inline">{user ? user.username : t.profile}</span>
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              {user ? (
                <>
                  <button onClick={() => { setIsProfileModalOpen(true); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    <Settings size={14} /> {t.editProfile}
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-gray-50 border-t border-gray-100 transition-colors">
                    {t.logout}
                  </button>
                </>
              ) : (
                <button onClick={() => { setIsAuthModalOpen(true); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-cyan-600 hover:bg-gray-50 transition-colors">
                  {t.login}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-gradient-to-br from-orange-950 via-red-950 to-gray-950 text-white py-20 px-4 text-center relative overflow-hidden shadow-lg">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-none bg-gradient-to-r from-white via-orange-100 to-amber-200 bg-clip-text text-transparent">{t.title}</h2>
          <p className="text-sm sm:text-base md:text-lg opacity-80 mb-8 max-w-xl mx-auto font-medium">{t.subtitle}</p>
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center max-w-2xl mx-auto border border-gray-100 focus-within:ring-4 focus-within:ring-orange-500/20 transition-all duration-300">
            <Search className="text-gray-400 ml-3 shrink-0" size={20} />
            <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent p-2.5 text-gray-800 font-semibold focus:outline-none text-sm placeholder-gray-400" />
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex-1">
        <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-gray-400">{t.filterTitle}</h3>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar -mx-4 px-4">
          <button onClick={() => setSelectedDistrict('')} className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${!selectedDistrict ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/10' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{t.allRegions}</button>
          {['Bratislava', 'Trnava', 'Trencin', 'Nitra', 'Zilina', 'Banska Bystrica', 'Poprad', 'Kosice'].map(dist => (
            <button key={dist} onClick={() => setSelectedDistrict(dist)} className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${selectedDistrict === dist ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/10' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>{dist}</button>
          ))}
        </div>

        <h3 className="text-2xl font-extrabold mb-6 text-gray-900 tracking-tight">{t.popularTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {places.map((place) => {
            const imageList = getImagesForPlace(place);
            const activeImgIndex = currentImageIndices[place.id] || 0;
            const hasVoted = ratings[place.id] !== undefined;
            const currentRating = ratings[place.id];

            return (
              <div key={place.id} onClick={() => setSelectedPlace({ ...place, resolvedImages: imageList })} className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between group relative transform hover:-translate-y-1">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img src={imageList[activeImgIndex]} alt={place.name} className="w-full h-full object-cover" />
                  <button onClick={(e) => handlePrevImage(place.id, imageList, e)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={(e) => handleNextImage(place.id, imageList, e)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <ChevronRight size={16} />
                  </button>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-sm z-10">
                    {place.category === 'Accommodation' ? '🏨 Hotel' : place.category === 'Restaurant' ? '🍴 Resto' : place.category === 'Hiking' ? '🥾 Rando' : '🏰 Spot'}
                  </span>
                  <button onClick={(e) => toggleFavorite(place.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 z-20">
                    <Heart size={16} className={favorites[place.id] ? "fill-red-500 text-red-500" : "text-gray-600"} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/30">
                  <div>
                    <h4 className="font-bold text-base text-gray-900 line-clamp-1">{place.name}</h4>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1.5"><MapPin size={12} className="text-cyan-500" /> {place.district}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      {hasVoted ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((circle) => (
                            <span key={circle} className={`w-3 h-3 rounded-full border border-emerald-600 ${circle <= currentRating ? 'bg-emerald-600' : 'bg-transparent'}`}></span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">{t.noReviews}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3.5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Eye size={11}/> {place.views_count} {t.views}</span>
                    {place.has_isic_discount && <span className="bg-green-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">ISIC %</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* DETAILS MODAL */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col relative border border-gray-100 no-scrollbar">
            <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2.5 rounded-full z-10 shadow-lg"><X size={18} /></button>
            <div className="h-72 w-full bg-gray-100 relative shrink-0">
              <img src={selectedPlace.resolvedImages ? selectedPlace.resolvedImages[0] : ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 sm:p-8 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg">{selectedPlace.category} • {selectedPlace.district}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 mb-4">{selectedPlace.name}</h3>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">{t.addReview}</h4>
                {user ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => submitRating(selectedPlace.id, star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                        <Star size={24} className={`transition-colors ${star <= (hoverRating || ratings[selectedPlace.id] || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div onClick={() => { setIsAuthModalOpen(true); setSelectedPlace(null); }} className="flex items-center gap-2 text-red-500 cursor-pointer hover:underline text-xs font-medium">
                    <Lock size={14} /> {t.loginRequired}
                  </div>
                )}
              </div>

              {selectedPlace.external_link && (
                <a href={selectedPlace.external_link} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl text-center block text-sm shadow-md">
                  {t.btnSeeOn}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN / REGISTER MODAL WITH CONFIRM PASSWORD */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button onClick={() => { setIsAuthModalOpen(false); setAuthError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-full">
              <X size={18} />
            </button>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
              {authMode === 'login' ? t.authTitleLogin : t.authTitleRegister}
            </h3>
            <form onSubmit={handleAuthSubmit} className="space-y-4 mt-6">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                  <input type="text" required placeholder={t.usernamePlh} value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" required placeholder={t.emailPlh} value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" required placeholder={t.passwordPlh} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}</label>
                  <input type="password" required placeholder={t.passwordPlh} value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
                </div>
              )}
              {authError && <p className="text-xs font-semibold text-red-500 mt-2">{authError}</p>}
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/10 transition-all mt-4">
                {authMode === 'login' ? t.btnAuthSubmitLogin : t.btnAuthSubmitRegister}
              </button>
            </form>
            <div className="text-center mt-6">
              <button onClick={() => { setAuthModalMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-xs font-bold text-cyan-600 hover:underline">
                {authMode === 'login' ? t.switchRegister : t.switchLogin}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE WEB PANEL CONFIGURATION MODAL (Age, Sex, School, ISIC Check) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => { setIsProfileModalOpen(false); setAuthError(''); setProfileSuccess(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-full">
              <X size={18} />
            </button>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{t.editProfile}</h3>
            <p className="text-xs text-gray-400 font-semibold mb-6">{user?.email}</p>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Âge' : 'Age'}</label>
                  <input type="number" placeholder="22" value={profileAge} onChange={(e) => setProfileAge(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Sexe' : 'Gender'}</label>
                  <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white">
                    <option value="">--</option>
                    <option value="Male">{lang === 'fr' ? 'Homme' : 'Male'}</option>
                    <option value="Female">{lang === 'fr' ? 'Femme' : 'Female'}</option>
                    <option value="Other">{lang === 'fr' ? 'Autre' : 'Other'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Université / École' : 'University / School'}</label>
                <input type="text" placeholder="Comenius University" value={profileSchool} onChange={(e) => setProfileSchool(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ISIC Card Number</label>
                <input type="text" placeholder="S123456789012X" value={profileIsic} onChange={(e) => setProfileIsic(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-semibold tracking-wider focus:outline-none focus:border-cyan-500 focus:bg-white placeholder-gray-300 uppercase" />
                <p className="text-[10px] font-medium text-gray-400 mt-1.5">Format: S + 12 digits + 1 letter.</p>
              </div>

              {authError && <p className="text-xs font-semibold text-red-500 mt-2">{authError}</p>}
              {profileSuccess && <p className="text-xs font-semibold text-emerald-600 mt-2">{profileSuccess}</p>}

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/10 hover:opacity-95 active:scale-98 transition-all mt-4">
                {t.saveProfile}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIVE MAP */}
      <div className={`hidden md:flex fixed bottom-6 right-6 z-40 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out flex-col ${isMapExpanded ? 'w-[550px] h-[450px]' : 'w-72 h-44'}`}>
        <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center font-bold text-xs">
          <span className="flex items-center gap-1.5 font-extrabold tracking-wide"><MapIcon size={14} className="text-cyan-400" /> LIVE MAP ({places.length})</span>
          <button onClick={() => setIsMapExpanded(!isMapExpanded)} className="p-1 hover:bg-gray-800 text-gray-400 rounded-lg">
            {isMapExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        <div className="flex-1 relative">
          <MapContainer center={SLOVAKIA_CENTER} zoom={6} style={{ width: '100%', height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {places.map(place => {
              const lat = parseFloat(place.latitude); const lng = parseFloat(place.longitude);
              if (isNaN(lat) || isNaN(lng)) return null;
              return (
                <Marker key={place.id} position={[lat, lng]} icon={icons[place.category.toLowerCase()] || icons.default}>
                  <Popup>
                    <div className="w-48 font-sans p-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">{place.name}</h3>
                      <button onClick={() => setSelectedPlace(place)} className="block w-full text-center bg-cyan-600 text-white text-[11px] font-bold py-1.5 px-2 rounded-xl mt-2.5 shadow-sm">{t.detailsTitle}</button>
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