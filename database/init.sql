-- ============================================================
-- 1. Table USERS (Avec gestion Expiration ISIC et rôles ex-ESN)
-- ============================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isic_number VARCHAR(50) UNIQUE,
    isic_expiry_date DATE, -- Stocke la date de fin de validité
    role VARCHAR(50) DEFAULT 'erasmus_active', -- 'erasmus_active' ou 'ex_esn'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Table PLACES (Table unique pour tous les lieux)
-- ============================================================
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category VARCHAR(100) NOT NULL, -- ex: 'Restaurant', 'Monument', 'Hiking', 'Accommodation'
    has_isic_discount BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 3. Table REVIEWS (Notes et commentaires sur les lieux)
-- ============================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    place_id INT REFERENCES places(id) ON DELETE CASCADE,
    budget_rating INT CHECK (budget_rating BETWEEN 1 AND 5),
    quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. Table EXCURSIONS (Voyages organisés en train/bus)
-- ============================================================
CREATE TABLE excursions (
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
-- 5. JEU DE DONNÉES DE TEST (Seeding)
-- ============================================================
INSERT INTO places (name, latitude, longitude, category, has_isic_discount) VALUES
('Bratislava Castle', 48.1419, 17.1001, 'Monument', FALSE),
('Ristorante Italiano (Bratislava)', 48.1445, 17.1110, 'Restaurant', TRUE),
('High Tatras Hiking Trail (Popradske Pleso)', 49.1540, 20.0700, 'Hiking', FALSE),
('Kosice Hostel Central', 48.7212, 21.2570, 'Accommodation', TRUE);