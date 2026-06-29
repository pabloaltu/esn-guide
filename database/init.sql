-- ============================================================
-- 1. Table USERS 
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    role VARCHAR(50) DEFAULT 'erasmus_active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Table PROFILES (Mise à jour avec tes nouveaux champs !)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    age INT,
    gender VARCHAR(20),
    school VARCHAR(255),
    isic_number VARCHAR(14),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================
-- 3. Table PLACES 
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category VARCHAR(100) NOT NULL, 
    district VARCHAR(100) NOT NULL,
    views_count INT DEFAULT 0,
    external_link TEXT,
    image_url TEXT, 
    has_isic_discount BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 4. Table REVIEWS 
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5), 
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, place_id)
);

-- ============================================================
-- 5. Table EXCURSIONS 
-- ============================================================
CREATE TABLE IF NOT EXISTS excursions (
    id SERIAL PRIMARY KEY,
    host_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    group_capacity INT NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. INJECTION DES DONNÉES 
-- ============================================================
INSERT INTO places (name, latitude, longitude, category, district, views_count, external_link, has_isic_discount) VALUES
-- --- BRATISLAVSKÝ KRAJ (Région de Bratislava) ---
('Château de Bratislava', 48.1420, 17.1008, 'Monument', 'Bratislava', 120, 'https://www.tripadvisor.com', FALSE),
('Falkensteiner Hotel Bratislava', 48.1435, 17.1043, 'Accommodation', 'Bratislava', 45, 'https://www.booking.com', TRUE),
('Park Inn by Radisson Danube Bratislava', 48.1406, 17.1073, 'Accommodation', 'Bratislava', 30, 'https://www.booking.com', FALSE),
('Hotel Devin', 48.1402, 17.1088, 'Accommodation', 'Bratislava', 25, 'https://www.booking.com', FALSE),
('Modrá Hviezda', 48.1423, 17.1018, 'Restaurant', 'Bratislava', 60, 'https://www.tripadvisor.com', TRUE),
('Hradná Reštaurácia', 48.1424, 17.1006, 'Restaurant', 'Bratislava', 40, 'https://www.tripadvisor.com', FALSE),
('Zylinder Cafe & Restaurant', 48.1438, 17.1062, 'Restaurant', 'Bratislava', 35, 'https://www.tripadvisor.com', FALSE),
('Bratislavský Meštiansky Pivovar', 48.1480, 17.1102, 'Restaurant', 'Bratislava', 85, 'https://www.tripadvisor.com', TRUE),
('Parlamentka', 48.1430, 17.0998, 'Restaurant', 'Bratislava', 20, 'https://www.tripadvisor.com', FALSE),
('Vieille Ville de Bratislava (Staré Mesto)', 48.1447, 17.1077, 'Monument', 'Bratislava', 150, 'https://www.tripadvisor.com', FALSE),
('Radisson Blu Carlton', 48.1416, 17.1104, 'Accommodation', 'Bratislava', 55, 'https://www.booking.com', FALSE),
('Arcadia Boutique Hotel', 48.1446, 17.1097, 'Accommodation', 'Bratislava', 18, 'https://www.booking.com', FALSE),
('LOFT Hotel Bratislava', 48.1510, 17.1089, 'Accommodation', 'Bratislava', 42, 'https://www.booking.com', TRUE),
('Slovak Pub', 48.1481, 17.1130, 'Restaurant', 'Bratislava', 190, 'https://www.tripadvisor.com', TRUE),
('Urban House', 48.1454, 17.1117, 'Restaurant', 'Bratislava', 95, 'https://www.tripadvisor.com', FALSE),
('Gatto Matto', 48.1438, 17.1092, 'Restaurant', 'Bratislava', 48, 'https://www.tripadvisor.com', FALSE),
('Mondieu', 48.1451, 17.1088, 'Restaurant', 'Bratislava', 70, 'https://www.tripadvisor.com', FALSE),
('Château de Devín', 48.1733, 16.9786, 'Monument', 'Bratislava', 110, 'https://www.tripadvisor.com', FALSE),
('Hotel Baronka', 48.2098, 17.1294, 'Accommodation', 'Bratislava', 15, 'https://www.booking.com', FALSE),
('River Park Hotel', 48.1453, 17.0953, 'Accommodation', 'Bratislava', 28, 'https://www.booking.com', FALSE),
('Restaurácia Hrad Devín', 48.1730, 16.9793, 'Restaurant', 'Bratislava', 33, 'https://www.tripadvisor.com', FALSE),
('Devínska Reštaurácia', 48.1745, 16.9811, 'Restaurant', 'Bratislava', 22, 'https://www.tripadvisor.com', FALSE),
('Pri Mlyne', 48.1765, 16.9855, 'Restaurant', 'Bratislava', 19, 'https://www.tripadvisor.com', FALSE),
('Eden Devín', 48.1719, 16.9806, 'Restaurant', 'Bratislava', 14, 'https://www.tripadvisor.com', FALSE),
('Rybárska Bašta Devín', 48.1724, 16.9822, 'Restaurant', 'Bratislava', 26, 'https://www.tripadvisor.com', FALSE),
('Château de Červený Kameň', 48.3994, 17.3335, 'Monument', 'Bratislava', 80, 'https://www.tripadvisor.com', FALSE),
('Hotel Majolika Modra', 48.3347, 17.3075, 'Accommodation', 'Bratislava', 24, 'https://www.booking.com', TRUE),
('Hotel Zochova Chata', 48.3733, 17.2898, 'Accommodation', 'Bratislava', 50, 'https://www.booking.com', FALSE),
('Hotel Sebastian u Hoffera', 48.3766, 17.5858, 'Accommodation', 'Bratislava', 12, 'https://www.booking.com', FALSE),
('Hradná Reštaurácia Červený Kameň', 48.3991, 17.3337, 'Restaurant', 'Bratislava', 31, 'https://www.tripadvisor.com', FALSE),
('Furmanská Krčma', 48.3935, 17.3406, 'Restaurant', 'Bratislava', 45, 'https://www.tripadvisor.com', TRUE),
('Restaurácia Rozálka', 48.3022, 17.2715, 'Restaurant', 'Bratislava', 27, 'https://www.tripadvisor.com', FALSE),
('Danubiana Meulensteen Art Museum', 48.0345, 17.2468, 'Monument', 'Bratislava', 85, 'https://www.tripadvisor.com', TRUE),
('X-BIONIC Hotel', 48.0297, 17.3098, 'Accommodation', 'Bratislava', 36, 'https://www.booking.com', FALSE),
('Hotel Kormorán', 48.0325, 17.2915, 'Accommodation', 'Bratislava', 21, 'https://www.booking.com', FALSE),
('Hotel Sun', 48.0565, 17.2924, 'Accommodation', 'Bratislava', 17, 'https://www.booking.com', FALSE),
('Danubiana Restaurant', 48.0344, 17.2469, 'Restaurant', 'Bratislava', 40, 'https://www.tripadvisor.com', FALSE),
('Marina Restaurant Čunovo', 48.0318, 17.2485, 'Restaurant', 'Bratislava', 33, 'https://www.tripadvisor.com', FALSE),
('Divoká Voda Restaurant', 48.0291, 17.2476, 'Restaurant', 'Bratislava', 29, 'https://www.tripadvisor.com', FALSE),

-- --- TRNAVSKÝ KRAJ (Région de Trnava) ---
('Centre historique de Trnava (Trojičné námestie)', 48.3776, 17.5873, 'Monument', 'Trnava', 75, 'https://www.tripadvisor.com', FALSE),
('Holiday Inn Trnava', 48.3790, 17.5896, 'Accommodation', 'Trnava', 32, 'https://www.booking.com', FALSE),
('Hotel MAXPLAZA', 48.3774, 17.5864, 'Accommodation', 'Trnava', 14, 'https://www.booking.com', FALSE),
('Hotel Spectrum', 48.3725, 17.5952, 'Accommodation', 'Trnava', 19, 'https://www.booking.com', TRUE),
('Forhaus', 48.3773, 17.5866, 'Restaurant', 'Trnava', 45, 'https://www.tripadvisor.com', TRUE),
('Thalmeiner', 48.3782, 17.5881, 'Restaurant', 'Trnava', 58, 'https://www.tripadvisor.com', FALSE),
('Synagóga Café', 48.3784, 17.5845, 'Restaurant', 'Trnava', 66, 'https://www.tripadvisor.com', FALSE),
('Akademia Restaurant', 48.3766, 17.5885, 'Restaurant', 'Trnava', 38, 'https://www.tripadvisor.com', FALSE),
('Wasabi Sushi Bar', 48.3778, 17.5902, 'Restaurant', 'Trnava', 29, 'https://www.tripadvisor.com', FALSE),
('Piešťany – Île thermale (Kúpeľný ostrov)', 48.5949, 17.8388, 'Monument', 'Trnava', 115, 'https://www.tripadvisor.com', FALSE),
('Ensana Thermia Palace', 48.5955, 17.8391, 'Accommodation', 'Trnava', 22, 'https://www.booking.com', FALSE),
('Ensana Esplanade', 48.5966, 17.8395, 'Accommodation', 'Trnava', 31, 'https://www.booking.com', FALSE),
('Hotel Park Piešťany', 48.5914, 17.8354, 'Accommodation', 'Trnava', 26, 'https://www.booking.com', TRUE),
('Le Griffon Café & Restaurant', 48.5943, 17.8392, 'Restaurant', 'Trnava', 41, 'https://www.tripadvisor.com', FALSE),
('Elizabeth Restaurant', 48.5934, 17.8382, 'Restaurant', 'Trnava', 34, 'https://www.tripadvisor.com', FALSE),
('Concept Coffee Roasters', 48.5937, 17.8366, 'Restaurant', 'Trnava', 53, 'https://www.tripadvisor.com', TRUE),
('La Musica', 48.5927, 17.8369, 'Restaurant', 'Trnava', 23, 'https://www.tripadvisor.com', FALSE),
('Thermalpark Dunajská Streda', 47.9968, 17.6175, 'Accommodation', 'Trnava', 98, 'https://www.booking.com', TRUE),
('Hotel Thermalpark', 47.9970, 17.6178, 'Accommodation', 'Trnava', 44, 'https://www.booking.com', FALSE),
('Villa Rosa', 48.0002, 17.6154, 'Accommodation', 'Trnava', 16, 'https://www.booking.com', FALSE),
('Buena Coffee House', 47.9993, 17.6164, 'Restaurant', 'Trnava', 37, 'https://www.tripadvisor.com', FALSE),
('Château de Smolenice', 48.5047, 17.4305, 'Monument', 'Trnava', 85, 'https://www.tripadvisor.com', FALSE),
('Hotel Smolenice', 48.5040, 17.4296, 'Accommodation', 'Trnava', 12, 'https://www.booking.com', FALSE),
('Penzión Villa Agnes', 48.5007, 17.4274, 'Accommodation', 'Trnava', 15, 'https://www.booking.com', TRUE),
('Reštaurácia Smolenický zámok', 48.5048, 17.4308, 'Restaurant', 'Trnava', 29, 'https://www.tripadvisor.com', FALSE),

-- --- TRENČIANSKY KRAJ (Région de Trenčín) ---
('Château de Trenčín (Trenčiansky hrad)', 48.8945, 18.0447, 'Monument', 'Trencin', 140, 'https://www.tripadvisor.com', FALSE),
('Hotel Elizabeth', 48.8948, 18.0428, 'Accommodation', 'Trencin', 49, 'https://www.booking.com', FALSE),
('Grand Hotel Trenčín', 48.8942, 18.0409, 'Accommodation', 'Trencin', 22, 'https://www.booking.com', FALSE),
('Hotel Magnus', 48.8889, 18.0479, 'Accommodation', 'Trencin', 31, 'https://www.booking.com', TRUE),
('Fatima Restaurant', 48.8949, 18.0436, 'Restaurant', 'Trencin', 68, 'https://www.tripadvisor.com', TRUE),
('Restaurant Pod Hradom', 48.8939, 18.0438, 'Restaurant', 'Trencin', 41, 'https://www.tripadvisor.com', FALSE),
('Oyshi Sushi Bar', 48.8941, 18.0420, 'Restaurant', 'Trencin', 35, 'https://www.tripadvisor.com', FALSE),
('Château de Bojnice (Bojnický zámok)', 48.7711, 18.5786, 'Monument', 'Trencin', 240, 'https://www.tripadvisor.com', FALSE),
('Hotel pod Zámkom', 48.7715, 18.5789, 'Accommodation', 'Trencin', 56, 'https://www.booking.com', TRUE),
('Hotel Belassi', 48.7722, 18.5798, 'Accommodation', 'Trencin', 27, 'https://www.booking.com', FALSE),
('Biograf Restaurant', 48.7716, 18.5792, 'Restaurant', 'Trencin', 82, 'https://www.tripadvisor.com', TRUE),
('Muzika Restaurant', 48.7718, 18.5800, 'Restaurant', 'Trencin', 61, 'https://www.tripadvisor.com', FALSE),
('Zoo de Bojnice', 48.7719, 18.5808, 'Monument', 'Trencin', 130, 'https://www.tripadvisor.com', FALSE),
('Gorges de Manín (Manínska tiesňava)', 49.1293, 18.5217, 'Hiking', 'Trencin', 95, 'https://www.alltrails.com', FALSE),
('Hotel Gino Park Palace', 49.1144, 18.4434, 'Accommodation', 'Trencin', 38, 'https://www.booking.com', FALSE),
('Koliba Pod Skalami', 49.1215, 18.5169, 'Restaurant', 'Trencin', 53, 'https://www.tripadvisor.com', TRUE),
('Village de Čičmany', 48.9536, 18.5169, 'Monument', 'Trencin', 110, 'https://www.tripadvisor.com', FALSE),
('Penzión Javorina', 48.9540, 18.5172, 'Accommodation', 'Trencin', 24, 'https://www.booking.com', TRUE),
('Koliba Čičmany', 48.9538, 18.5170, 'Restaurant', 'Trencin', 59, 'https://www.tripadvisor.com', TRUE),

-- --- NITRIANSKY KRAJ (Région de Nitra) ---
('Château de Nitra (Nitriansky hrad)', 48.3129, 18.0857, 'Monument', 'Nitra', 85, 'https://www.tripadvisor.com', FALSE),
('Hotel Zlatý Kľúčik', 48.3220, 18.0836, 'Accommodation', 'Nitra', 29, 'https://www.booking.com', FALSE),
('Hotel Capital', 48.3125, 18.0879, 'Accommodation', 'Nitra', 18, 'https://www.booking.com', FALSE),
('Restaurant Castello', 48.3132, 18.0864, 'Restaurant', 'Nitra', 42, 'https://www.tripadvisor.com', FALSE),
('Beer Palace Nitra', 48.3118, 18.0849, 'Restaurant', 'Nitra', 51, 'https://www.tripadvisor.com', TRUE),
('Forteresse de Komárno (Komárňanská pevnosť)', 47.7586, 18.1291, 'Monument', 'Nitra', 65, 'https://www.tripadvisor.com', FALSE),
('Hotel Litovel', 47.7592, 18.1304, 'Accommodation', 'Nitra', 21, 'https://www.booking.com', FALSE),
('Court Street Restaurant', 47.7588, 18.1296, 'Restaurant', 'Nitra', 33, 'https://www.tripadvisor.com', FALSE),
('Arboretum Mlyňany', 48.3514, 18.3620, 'Monument', 'Nitra', 50, 'https://www.tripadvisor.com', TRUE),
('Thermes Vadaš Štúrovo', 47.7989, 18.7166, 'Accommodation', 'Nitra', 92, 'https://www.booking.com', TRUE),
('Hotel Thermal Vadaš', 47.7991, 18.7169, 'Accommodation', 'Nitra', 40, 'https://www.booking.com', FALSE),
('Vadaš Restaurant', 47.7991, 18.7169, 'Restaurant', 'Nitra', 47, 'https://www.tripadvisor.com', FALSE),
('Château de Levice (Levický hrad)', 48.2163, 18.6071, 'Monument', 'Nitra', 45, 'https://www.tripadvisor.com', FALSE),
('Hotel Astrum Laus', 48.2175, 18.6092, 'Accommodation', 'Nitra', 31, 'https://www.booking.com', FALSE),
('Castle Restaurant Levice', 48.2164, 18.6073, 'Restaurant', 'Nitra', 28, 'https://www.tripadvisor.com', FALSE),

-- --- ŽILINSKÝ KRAJ (Région de Žilina) ---
('Château d’Orava (Oravský hrad)', 49.2594, 19.3566, 'Monument', 'Zilina', 195, 'https://www.tripadvisor.com', FALSE),
('Hotel Orava', 49.2591, 19.3572, 'Accommodation', 'Zilina', 44, 'https://www.booking.com', TRUE),
('Restaurácia Pod Hradom', 49.2596, 19.3568, 'Restaurant', 'Zilina', 62, 'https://www.tripadvisor.com', FALSE),
('Jánošíkove diery (Malá Fatra)', 49.2428, 19.0576, 'Hiking', 'Zilina', 270, 'https://www.alltrails.com', FALSE),
('Hotel Diery Terchová', 49.2451, 19.0568, 'Accommodation', 'Zilina', 72, 'https://www.booking.com', TRUE),
('Koliba Podžiar', 49.2435, 19.0569, 'Restaurant', 'Zilina', 85, 'https://www.tripadvisor.com', TRUE),
('Parc national de Malá Fatra', 49.1529, 19.0717, 'Hiking', 'Zilina', 155, 'https://www.alltrails.com', FALSE),
('Hotel Diana Stráža', 49.1538, 19.0709, 'Accommodation', 'Zilina', 29, 'https://www.booking.com', FALSE),
('Koliba Diana', 49.1538, 19.0709, 'Restaurant', 'Zilina', 41, 'https://www.tripadvisor.com', FALSE),
('Vlkolínec (UNESCO)', 49.0407, 19.2765, 'Monument', 'Zilina', 105, 'https://www.tripadvisor.com', FALSE),
('Hotel Malina', 49.0432, 19.2781, 'Accommodation', 'Zilina', 23, 'https://www.booking.com', FALSE),
('Koliba Vlkolínec', 49.0411, 19.2767, 'Restaurant', 'Zilina', 54, 'https://www.tripadvisor.com', TRUE),
('Grotte de la Liberté Demänová', 49.0319, 19.5801, 'Monument', 'Zilina', 125, 'https://www.tripadvisor.com', TRUE),
('Hotel Tri Studničky', 49.0268, 19.5755, 'Accommodation', 'Zilina', 48, 'https://www.booking.com', FALSE),
('Koliba Tri Studničky', 49.0268, 19.5755, 'Restaurant', 'Zilina', 66, 'https://www.tripadvisor.com', FALSE),

-- --- BANSKOBYSTRICKÝ KRAJ (Région de Banská Bystrica) ---
('Banská Štiavnica (UNESCO)', 48.4584, 18.8914, 'Monument', 'Banska Bystrica', 170, 'https://www.tripadvisor.com', FALSE),
('Hotel Grand Matej', 48.4588, 18.8923, 'Accommodation', 'Banska Bystrica', 35, 'https://www.booking.com', FALSE),
('Monarchia Restaurant', 48.4587, 18.8921, 'Restaurant', 'Banska Bystrica', 52, 'https://www.tripadvisor.com', FALSE),
('ERB Restaurant', 48.4583, 18.8917, 'Restaurant', 'Banska Bystrica', 74, 'https://www.tripadvisor.com', TRUE),
('Chopok – Parc national des Basses Tatras', 48.9436, 19.5889, 'Hiking', 'Banska Bystrica', 235, 'https://www.alltrails.com', FALSE),
('Hotel Srdiečko', 48.9438, 19.5869, 'Accommodation', 'Banska Bystrica', 51, 'https://www.booking.com', FALSE),
('Rotunda Restaurant', 48.9437, 19.5888, 'Restaurant', 'Banska Bystrica', 80, 'https://www.tripadvisor.com', TRUE),
('Château de Zvolen', 48.5746, 19.1265, 'Monument', 'Banska Bystrica', 55, 'https://www.tripadvisor.com', FALSE),
('Franko Restaurant', 48.5709, 19.1305, 'Restaurant', 'Banska Bystrica', 43, 'https://www.tripadvisor.com', FALSE),
('Špania Dolina', 48.8073, 19.1353, 'Monument', 'Banska Bystrica', 78, 'https://www.tripadvisor.com', TRUE),
('Penzión Klopačka', 48.8078, 19.1359, 'Accommodation', 'Banska Bystrica', 26, 'https://www.booking.com', TRUE),
('Banícka Krčma', 48.8072, 19.1356, 'Restaurant', 'Banska Bystrica', 49, 'https://www.tripadvisor.com', FALSE),
('Banská Bystrica – Place SNP et centre historique', 48.7363, 19.1462, 'Monument', 'Banska Bystrica', 90, 'https://www.tripadvisor.com', FALSE),
('Bernardov Dvor', 48.7369, 19.1466, 'Restaurant', 'Banska Bystrica', 61, 'https://www.tripadvisor.com', FALSE),

-- --- PREŠOVSKÝ KRAJ (Poprad/Tatras) ---
('Štrbské Pleso (Hautes Tatras)', 49.1194, 20.0629, 'Hiking', 'Poprad', 325, 'https://www.alltrails.com', FALSE),
('Grand Hotel Kempinski High Tatras', 49.1192, 20.0624, 'Accommodation', 'Poprad', 92, 'https://www.booking.com', FALSE),
('Hotel Patria', 49.1205, 20.0638, 'Accommodation', 'Poprad', 46, 'https://www.booking.com', TRUE),
('Grand Restaurant Kempinski', 49.1192, 20.0624, 'Restaurant', 'Poprad', 78, 'https://www.tripadvisor.com', FALSE),
('Koliba Patria', 49.1205, 20.0638, 'Restaurant', 'Poprad', 89, 'https://www.tripadvisor.com', TRUE),
('Treetop Walk Bachledka (Chodník korunami stromov)', 49.2712, 20.3096, 'Monument', 'Poprad', 150, 'https://www.tripadvisor.com', TRUE),
('Hotel Bachledka', 49.2707, 20.3091, 'Accommodation', 'Poprad', 33, 'https://www.booking.com', FALSE),
('Panorama Restaurant Bachledka', 49.2709, 20.3094, 'Restaurant', 'Poprad', 64, 'https://www.tripadvisor.com', FALSE),
('Château de Spiš (Spišský hrad)', 49.0008, 20.7682, 'Monument', 'Poprad', 295, 'https://www.tripadvisor.com', FALSE),
('Reštaurácia U Leva', 48.9986, 20.7418, 'Restaurant', 'Poprad', 52, 'https://www.tripadvisor.com', TRUE),
('Centre historique de Bardejov (UNESCO)', 49.2925, 21.2756, 'Monument', 'Poprad', 85, 'https://www.tripadvisor.com', FALSE),
('Roland Café Restaurant', 49.2924, 21.2759, 'Restaurant', 'Poprad', 43, 'https://www.tripadvisor.com', FALSE),
('Parc national des Pieniny', 49.3958, 20.4145, 'Hiking', 'Poprad', 110, 'https://www.alltrails.com', TRUE),
('Penzión Pltník', 49.3962, 20.4141, 'Accommodation', 'Poprad', 28, 'https://www.booking.com', TRUE),
('Koliba Pltník', 49.3961, 20.4142, 'Restaurant', 'Poprad', 57, 'https://www.tripadvisor.com', TRUE),

-- --- KOŠICKÝ KRAJ (Région de Košice) ---
('Cathédrale Sainte-Élisabeth de Košice', 48.7209, 21.2581, 'Monument', 'Kosice', 210, 'https://www.tripadvisor.com', FALSE),
('DoubleTree by Hilton Košice', 48.7205, 21.2593, 'Accommodation', 'Kosice', 61, 'https://www.booking.com', FALSE),
('Boutique Hotel Bristol', 48.7212, 21.2586, 'Accommodation', 'Kosice', 34, 'https://www.booking.com', FALSE),
('Villa Regia', 48.7215, 21.2574, 'Restaurant', 'Kosice', 76, 'https://www.tripadvisor.com', FALSE),
('Med Malina', 48.7204, 21.2578, 'Restaurant', 'Kosice', 82, 'https://www.tripadvisor.com', TRUE),
('Republika Východu', 48.7217, 21.2581, 'Restaurant', 'Kosice', 105, 'https://www.tripadvisor.com', TRUE),
('Parc national du Paradis slovaque', 48.9366, 20.4845, 'Hiking', 'Kosice', 255, 'https://www.alltrails.com', FALSE),
('Hotel Podlesok', 48.9367, 20.4848, 'Accommodation', 'Kosice', 40, 'https://www.booking.com', TRUE),
('Restaurant Podlesok', 48.9368, 20.4849, 'Restaurant', 'Kosice', 59, 'https://www.tripadvisor.com', FALSE),
('Grotte de glace de Dobšiná (UNESCO)', 48.8741, 20.3025, 'Monument', 'Kosice', 135, 'https://www.tripadvisor.com', TRUE),
('Dobšinská Restaurant', 48.8739, 20.3023, 'Restaurant', 'Kosice', 41, 'https://www.tripadvisor.com', FALSE),
('Manoir de Betliar', 48.7058, 20.5185, 'Monument', 'Kosice', 90, 'https://www.tripadvisor.com', FALSE),
('Kaštieľ Betliar Restaurant', 48.7059, 20.5187, 'Restaurant', 'Kosice', 38, 'https://www.tripadvisor.com', FALSE),
('Gorges de Zádiel (Zádielska tiesňava)', 48.6036, 20.8216, 'Hiking', 'Kosice', 75, 'https://www.alltrails.com', FALSE),
('Koliba Zádiel', 48.6035, 20.8213, 'Restaurant', 'Kosice', 44, 'https://www.tripadvisor.com', TRUE);