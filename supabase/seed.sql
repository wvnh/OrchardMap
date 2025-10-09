-- seed.sql
-- Test data voor OrchardMap development

-- ==============================================
-- STEP 1: TEST USERS
-- ==============================================

INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
-- Admin gebruiker
('550e8400-e29b-41d4-a716-446655440001', 'admin@orchardmap.com', '$2b$10$dummy.hash.for.testing', 'Admin', 'Beheerder', 'admin'),

-- Orchard Managers
('550e8400-e29b-41d4-a716-446655440002', 'jan.peeters@fruitboer.be', '$2b$10$dummy.hash.for.testing', 'Jan', 'Peeters', 'orchard_manager'),
('550e8400-e29b-41d4-a716-446655440003', 'marie.janssen@appelboomgaard.nl', '$2b$10$dummy.hash.for.testing', 'Marie', 'Janssen', 'orchard_manager'),

-- Species Manager
('550e8400-e29b-41d4-a716-446655440004', 'expert@boomsoorten.be', '$2b$10$dummy.hash.for.testing', 'Dr. Karel', 'Boomkunde', 'species_manager'),

-- Orchard Workers
('550e8400-e29b-41d4-a716-446655440005', 'piet.werkman@fruitboer.be', '$2b$10$dummy.hash.for.testing', 'Piet', 'Werkman', 'orchard_worker'),
('550e8400-e29b-41d4-a716-446655440006', 'anna.helper@appelboomgaard.nl', '$2b$10$dummy.hash.for.testing', 'Anna', 'Helper', 'orchard_worker'),

-- Registered Users
('550e8400-e29b-41d4-a716-446655440007', 'liefhebber@email.com', '$2b$10$dummy.hash.for.testing', 'Tom', 'Liefhebber', 'registered_user'),
('550e8400-e29b-41d4-a716-446655440008', 'wandelaar@natuur.be', '$2b$10$dummy.hash.for.testing', 'Lisa', 'Wandelaar', 'registered_user');

-- ==============================================
-- STEP 2: TREE SPECIES (Boomsoorten)
-- ==============================================

INSERT INTO tree_species (
    id, variety_name, synonyms, fruit_type, 
    origin_country, origin_year,
    productivity_period, productivity_amount, bloom_period,
    taste_profile, fruit_size, fruit_shape,
    harvest_time, uses,
    is_validated, created_by
) VALUES
-- Jonagold
('660e8400-e29b-41d4-a716-446655440001', 
 'Jonagold', 
 ARRAY['Jonagold Classic'],
 'Appel',
 'Verenigde Staten',
 1968,
 'late',
 'high',
 'mid',
 'sweet_tart',
 'large',
 'round',
 'Oktober',
 ARRAY['Eetappel', 'Bewaring'],
 true,
 '550e8400-e29b-41d4-a716-446655440004'),

-- Cox Orange Pippin
('660e8400-e29b-41d4-a716-446655440002',
 'Cox Orange Pippin',
 ARRAY['Cox Orange', 'Cox'],
 'Appel',
 'Engeland',
 1825,
 'early',
 'medium',
 'mid',
 'sweet_tart',
 'medium',
 'round',
 'September',
 ARRAY['Eetappel', 'Cider'],
 true,
 '550e8400-e29b-41d4-a716-446655440004'),

-- Conference Peer
('660e8400-e29b-41d4-a716-446655440003',
 'Conference',
 ARRAY['Conference Peer'],
 'Peer',
 'Engeland',
 1885,
 'late',
 'high',
 'mid',
 'sweet',
 'large',
 'oval',
 'September-Oktober',
 ARRAY['Eetpeer', 'Bewaring'],
 true,
 '550e8400-e29b-41d4-a716-446655440004'),

-- Elstar
('660e8400-e29b-41d4-a716-446655440004',
 'Elstar',
 ARRAY['Elstar Classic'],
 'Appel',
 'Nederland',
 1955,
 'early',
 'high',
 'early',
 'sweet_tart',
 'medium',
 'round',
 'September',
 ARRAY['Eetappel', 'Sap'],
 true,
 '550e8400-e29b-41d4-a716-446655440004'),

-- Granny Smith
('660e8400-e29b-41d4-a716-446655440005',
 'Granny Smith',
 ARRAY['Granny'],
 'Appel',
 'Australië',
 1868,
 'late',
 'high',
 'late',
 'tart',
 'large',
 'round',
 'November',
 ARRAY['Eetappel', 'Verwerking'],
 true,
 '550e8400-e29b-41d4-a716-446655440004');

-- ==============================================
-- STEP 3: ORCHARDS (Boomgaarden)
-- ==============================================

INSERT INTO orchards (
    id, name, description, location_name, 
    latitude, longitude, is_public, owner_id
) VALUES
-- Publieke boomgaard
('770e8400-e29b-41d4-a716-446655440001',
 'Fruitpark Sterrebos',
 'Educatieve boomgaard met oude appelrassen',
 'Sterrebos, Brugge',
 51.2093, 3.2247,
 true,
 '550e8400-e29b-41d4-a716-446655440002'),

-- Private commerciële boomgaard
('770e8400-e29b-41d4-a716-446655440002',
 'Peeters Fruitbedrijf',
 'Moderne commerciële appelboomgaard',
 'Haspengouw, Sint-Truiden',
 50.8167, 5.1864,
 false,
 '550e8400-e29b-41d4-a716-446655440002'),

-- Publieke perenboomgaard
('770e8400-e29b-41d4-a716-446655440003',
 'Historische Perenboomgaard',
 'Collectie van historische peresoorten',
 'Bommels, Gent',
 51.0543, 3.7174,
 true,
 '550e8400-e29b-41d4-a716-446655440003'),

-- Private hobbyistenboomgaard
('770e8400-e29b-41d4-a716-446655440004',
 'De Kleine Bongerd',
 'Familie boomgaard met diverse fruitsoorten',
 'Kempen, Turnhout',
 51.3227, 4.9447,
 false,
 '550e8400-e29b-41d4-a716-446655440003');

-- ==============================================
-- STEP 4: ORCHARD PERMISSIONS
-- ==============================================

INSERT INTO orchard_permissions (orchard_id, user_id, permission_type, granted_by) VALUES
-- Workers toegang tot Peeters Fruitbedrijf
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'worker', '550e8400-e29b-41d4-a716-446655440002'),

-- Workers toegang tot Historische Perenboomgaard
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'worker', '550e8400-e29b-41d4-a716-446655440003'),

-- Viewers toegang tot private boomgaarden
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'viewer', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440008', 'viewer', '550e8400-e29b-41d4-a716-446655440003');

-- ==============================================
-- STEP 5: ORCHARD TREES (Bomen in boomgaarden)
-- ==============================================

INSERT INTO orchard_trees (
    id, orchard_id, tree_species_id, 
    row_number, column_number, latitude, longitude,
    planted_date, condition, health_status, bloom_status,
    notes, created_by
) VALUES
-- Fruitpark Sterrebos bomen
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
 1, 1, 51.20935, 3.22475, '2020-03-15', 'productive', 'healthy', 'dormant',
 'Prachtige grote Jonagold, ideaal voor bezoekers', '550e8400-e29b-41d4-a716-446655440002'),

('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002',
 1, 2, 51.20940, 3.22480, '2020-03-15', 'productive', 'healthy', 'dormant',
 'Cox Orange klassieke smaak', '550e8400-e29b-41d4-a716-446655440002'),

('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004',
 1, 3, 51.20945, 3.22485, '2019-11-20', 'productive', 'healthy', 'dormant',
 'Nederlandse trots - Elstar', '550e8400-e29b-41d4-a716-446655440002'),

-- Peeters Fruitbedrijf (commercieel)
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001',
 1, 1, 50.81675, 5.18645, '2018-04-10', 'productive', 'healthy', 'dormant',
 'Hoofdras voor commerciële productie', '550e8400-e29b-41d4-a716-446655440002'),

('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001',
 1, 2, 50.81680, 5.18650, '2018-04-10', 'productive', 'healthy', 'dormant',
 'Tweede Jonagold boom rij 1', '550e8400-e29b-41d4-a716-446655440005'),

('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005',
 2, 1, 50.81685, 5.18655, '2019-03-25', 'productive', 'healthy', 'dormant',
 'Granny Smith voor late oogst', '550e8400-e29b-41d4-a716-446655440005'),

-- Historische Perenboomgaard
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003',
 1, 1, 51.05435, 3.71745, '2017-10-15', 'productive', 'healthy', 'dormant',
 'Conference peer - zeer betrouwbare soort', '550e8400-e29b-41d4-a716-446655440003'),

('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003',
 1, 2, 51.05440, 3.71750, '2017-10-15', 'productive', 'less_healthy', 'dormant',
 'Heeft wat aandacht nodig - schurft', '550e8400-e29b-41d4-a716-446655440006'),

-- De Kleine Bongerd (hobby)
('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002',
 1, 1, 51.32275, 4.94475, '2021-11-01', 'not_productive', 'healthy', 'dormant',
 'Jonge Cox boom, nog geen vruchten', '550e8400-e29b-41d4-a716-446655440003'),

('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004',
 1, 2, 51.32280, 4.94480, '2020-12-05', 'productive', 'healthy', 'dormant',
 'Elstar doet het goed in de tuin', '550e8400-e29b-41d4-a716-446655440003');

-- ==============================================
-- STEP 6: FAVORITE TREES
-- ==============================================

INSERT INTO favorite_trees (user_id, orchard_tree_id) VALUES
-- Tom's favorieten
('550e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440001'), -- Jonagold in Fruitpark
('550e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007'), -- Conference peer

-- Lisa's favorieten  
('550e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440002'), -- Cox Orange
('550e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440010'); -- Elstar in De Kleine Bongerd

-- ==============================================
-- STEP 7: NOTIFICATIONS
-- ==============================================

INSERT INTO notifications (user_id, title, message, type, related_id) VALUES
-- Welkomst notificaties
('550e8400-e29b-41d4-a716-446655440007', 'Welkom bij OrchardMap!', 'Je hebt nu toegang tot publieke boomgaarden. Ontdek de wereld van fruit!', 'system_message', NULL),
('550e8400-e29b-41d4-a716-446655440008', 'Welkom bij OrchardMap!', 'Je hebt nu toegang tot publieke boomgaarden. Ontdek de wereld van fruit!', 'system_message', NULL),

-- Toegang verleend notificaties
('550e8400-e29b-41d4-a716-446655440007', 'Toegang verleend', 'Je hebt nu toegang gekregen tot Peeters Fruitbedrijf', 'access_granted', '770e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440008', 'Toegang verleend', 'Je hebt nu toegang gekregen tot De Kleine Bongerd', 'access_granted', '770e8400-e29b-41d4-a716-446655440004');

-- ==============================================
-- TESTDATA COMPLETE!
-- ==============================================