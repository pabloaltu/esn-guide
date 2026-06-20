import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordonnées pour centrer la carte sur la Slovaquie
const SLOVAKIA_CENTER = [48.6690, 19.6990];

export default function App() {
  const [places, setPlaces] = useState([]);

  // Cette fonction s'exécute à l'allumage de la page pour aller chercher ton JSON
  useEffect(() => {
    fetch('http://localhost:8000/api/places')
      .then(response => response.json())
      .then(data => setPlaces(data))
      .catch(error => console.error("Erreur de récupération des lieux:", error));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Barre de titre stylisée avec Tailwind */}
      <header className="bg-blue-600 text-white p-4 shadow-md text-center">
        <h1 className="text-2xl font-bold">🇸🇰 ESN Guide - Slovaquie</h1>
        <p className="text-sm opacity-90">Trouve les meilleurs spots et réductions ISIC !</p>
      </header>

      {/* Zone principale qui contient la carte */}
      <main className="flex-1 p-4">
        <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          
          <MapContainer center={SLOVAKIA_CENTER} zoom={7.5} style={{ width: '100%', height: '100%' }}>
            {/* Le fond de carte (le dessin de la carte) */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* On boucle sur tes faux lieux pour créer un marqueur pour chacun */}
            {places.map(place => (
              <Marker key={place.id} position={[parseFloat(place.latitude), parseFloat(place.longitude)]}>
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-base text-gray-800">{place.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold mb-1">{place.category}</p>
                    {place.has_isic_discount ? (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                        🔥 Réduction ISIC dispo !
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Pas de réduction</span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

        </div>
      </main>
    </div>
  );
}