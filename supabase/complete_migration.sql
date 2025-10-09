-- complete_migration.sql
-- Complete database schema for OrchardMap
-- Execute this entire file in Supabase SQL Editor

-- ==============================================
-- STEP 1: CREATE ENUMS
-- ==============================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'admin',
    'orchard_manager', 
    'orchard_worker',
    'species_manager',
    'registered_user'
);

-- Tree condition states
CREATE TYPE tree_condition AS ENUM (
    'planted',
    'not_productive',
    'productive',
    'dormant'
);

-- Health status
CREATE TYPE health_status AS ENUM (
    'healthy',
    'less_healthy',
    'sick',
    'quarantine'
);

-- Maintenance status
CREATE TYPE maintenance_status AS ENUM (
    'none',
    'pruning_scheduled',
    'removal_scheduled'
);

-- Bloom status
CREATE TYPE bloom_status AS ENUM (
    'dormant',
    'blooming',
    'fruit_bearing',
    'harvest_ready'
);

-- Permission types
CREATE TYPE permission_type AS ENUM (
    'worker',
    'viewer'
);

-- Audit actions
CREATE TYPE audit_action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'access_granted',
    'favorite_updated',
    'system_message'
);

-- Tree species enum types
CREATE TYPE productivity_period AS ENUM ('early', 'late');
CREATE TYPE productivity_amount AS ENUM ('low', 'medium', 'high');
CREATE TYPE bloom_period AS ENUM ('early', 'mid', 'late');
CREATE TYPE pollen_quality AS ENUM ('good', 'poor');
CREATE TYPE pollination_rating AS ENUM ('plus', 'neutral', 'minus');
CREATE TYPE disease_resistance AS ENUM ('plus', 'neutral', 'minus');
CREATE TYPE location_type AS ENUM ('orchard', 'fruit_garden', 'both');
CREATE TYPE target_audience AS ENUM ('hobbyists', 'professionals', 'both');
CREATE TYPE fruit_size AS ENUM ('very_small', 'small', 'medium', 'large', 'very_large');
CREATE TYPE fruit_shape AS ENUM ('round', 'flattened', 'conical', 'oval', 'cylindrical');
CREATE TYPE size_rating AS ENUM ('small', 'medium', 'large');
CREATE TYPE width_rating AS ENUM ('narrow', 'medium', 'wide');
CREATE TYPE depth_rating AS ENUM ('shallow', 'medium', 'deep');
CREATE TYPE calyx_state AS ENUM ('open', 'half_open', 'closed');
CREATE TYPE length_rating AS ENUM ('short', 'medium', 'long');
CREATE TYPE thickness_rating AS ENUM ('thin', 'medium', 'thick');
CREATE TYPE skin_texture AS ENUM ('smooth', 'rough');
CREATE TYPE skin_gloss AS ENUM ('glossy', 'matte');
CREATE TYPE skin_thickness AS ENUM ('thin', 'firm');
CREATE TYPE flesh_bite AS ENUM ('soft', 'crisp');
CREATE TYPE flesh_texture AS ENUM ('fine', 'fine_grained', 'coarse');
CREATE TYPE juice_content AS ENUM ('juicy', 'moderately_juicy', 'dry');
CREATE TYPE taste_profile AS ENUM ('sweet', 'sweet_tart', 'tart', 'bitter', 'bitter_sweet');
CREATE TYPE core_position AS ENUM ('high', 'middle', 'low');
CREATE TYPE seed_count AS ENUM ('few', 'medium', 'many');

-- ==============================================
-- STEP 2: CREATE TABLES
-- ==============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    role user_role DEFAULT 'registered_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TreeSpecies table
CREATE TABLE tree_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basis identificatie
    variety_name VARCHAR(100) NOT NULL,
    synonyms TEXT[],
    main_synonym VARCHAR(100),
    fruit_type VARCHAR(50) NOT NULL,
    
    -- Herkomst
    origin_country VARCHAR(100),
    origin_year INTEGER,
    origin_person VARCHAR(200),
    
    -- Productiviteit
    productivity_period productivity_period,
    alternate_bearing BOOLEAN,
    productivity_amount productivity_amount,
    
    -- Bloei
    bloom_period bloom_period,
    
    -- Stuifmeel
    pollen_quality pollen_quality,
    self_pollinating pollination_rating,
    pollinators TEXT[],
    
    -- Ziektegevoeligheid
    scab_resistance disease_resistance,
    mildew_resistance disease_resistance,
    canker_resistance disease_resistance,
    other_diseases TEXT[],
    
    -- Soorteigenschappen en teelt
    location_type location_type,
    target_audience target_audience,
    soil_requirements TEXT,
    planting_height TEXT,
    rootstock_info TEXT,
    cultivation_notes TEXT,
    
    -- Vorm
    fruit_size fruit_size,
    fruit_shape fruit_shape,
    has_ribs BOOLEAN,
    is_symmetric BOOLEAN,
    
    -- Kelk
    calyx_size size_rating,
    calyx_width width_rating,
    calyx_depth depth_rating,
    calyx_state calyx_state,
    calyx_notes TEXT,
    
    -- Steel
    stem_length length_rating,
    stem_thickness thickness_rating,
    stem_cavity_width width_rating,
    stem_cavity_depth depth_rating,
    stem_notes TEXT,
    
    -- Schil
    skin_texture skin_texture,
    skin_gloss skin_gloss,
    skin_thickness skin_thickness,
    ground_color VARCHAR(50),
    cover_color VARCHAR(50),
    color_pattern TEXT[],
    has_lenticels BOOLEAN,
    
    -- Vruchtvlees
    flesh_color VARCHAR(50),
    flesh_bite flesh_bite,
    flesh_texture flesh_texture,
    juice_content juice_content,
    taste_profile taste_profile,
    has_aroma BOOLEAN,
    flavor_notes TEXT,
    
    -- Klokhuis
    core_shape VARCHAR(100),
    core_position core_position,
    seed_size size_rating,
    seed_count seed_count,
    core_notes TEXT,
    
    -- Rijptijd
    harvest_time VARCHAR(50),
    storage_period VARCHAR(100),
    storage_notes TEXT,
    
    -- Gebruik
    uses TEXT[],
    
    -- Systeem velden
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orchards table
CREATE TABLE orchards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location_name VARCHAR(200),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    owner_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OrchardTrees table
CREATE TABLE orchard_trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orchard_id UUID NOT NULL REFERENCES orchards(id) ON DELETE CASCADE,
    tree_species_id UUID NOT NULL REFERENCES tree_species(id),
    row_number INTEGER NOT NULL,
    column_number INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    planted_date DATE,
    removed_date DATE,
    condition tree_condition DEFAULT 'planted',
    health_status health_status DEFAULT 'healthy',
    maintenance_status maintenance_status DEFAULT 'none',
    bloom_status bloom_status DEFAULT 'dormant',
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(orchard_id, row_number, column_number)
);

-- OrchardPermissions table
CREATE TABLE orchard_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orchard_id UUID NOT NULL REFERENCES orchards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_type permission_type NOT NULL,
    granted_by UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(orchard_id, user_id)
);

-- FavoriteTrees table
CREATE TABLE favorite_trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    orchard_tree_id UUID NOT NULL REFERENCES orchard_trees(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, orchard_tree_id)
);

-- AuditLog table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STEP 3: CREATE INDEXES
-- ==============================================

-- Orchards indexen
CREATE INDEX idx_orchards_owner_id ON orchards(owner_id);
CREATE INDEX idx_orchards_public ON orchards(is_public);

-- OrchardTrees indexen
CREATE INDEX idx_orchard_trees_orchard_id ON orchard_trees(orchard_id);
CREATE INDEX idx_orchard_trees_species_id ON orchard_trees(tree_species_id);
CREATE INDEX idx_orchard_trees_condition ON orchard_trees(condition);
CREATE INDEX idx_orchard_trees_health ON orchard_trees(health_status);
CREATE INDEX idx_orchard_trees_bloom ON orchard_trees(bloom_status);

-- TreeSpecies indexen
CREATE INDEX idx_tree_species_validated ON tree_species(is_validated);
CREATE INDEX idx_tree_species_variety_name ON tree_species(variety_name);
CREATE INDEX idx_tree_species_fruit_type ON tree_species(fruit_type);
CREATE INDEX idx_tree_species_uses ON tree_species USING GIN(uses);
CREATE INDEX idx_tree_species_synonyms ON tree_species USING GIN(synonyms);
CREATE INDEX idx_tree_species_bloom_period ON tree_species(bloom_period);
CREATE INDEX idx_tree_species_harvest_time ON tree_species(harvest_time);
CREATE INDEX idx_tree_species_taste_profile ON tree_species(taste_profile);

-- Permission indexen
CREATE INDEX idx_orchard_permissions_user_id ON orchard_permissions(user_id);
CREATE INDEX idx_orchard_permissions_orchard_id ON orchard_permissions(orchard_id);

-- Performance indexen
CREATE INDEX idx_favorite_trees_user_id ON favorite_trees(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- Users indexen
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ==============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 5: CREATE RLS POLICIES
-- ==============================================

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Orchards policies
CREATE POLICY "Users can view accessible orchards" ON orchards
    FOR SELECT USING (
        is_public = true OR 
        owner_id = auth.uid() OR
        id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Orchard managers can create orchards" ON orchards
    FOR INSERT WITH CHECK (
        owner_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'orchard_manager')
        )
    );

CREATE POLICY "Orchard owners can update their orchards" ON orchards
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Orchard owners can delete their orchards" ON orchards
    FOR DELETE USING (owner_id = auth.uid());

-- OrchardTrees policies
CREATE POLICY "Users can view accessible trees" ON orchard_trees
    FOR SELECT USING (
        orchard_id IN (
            SELECT id FROM orchards WHERE 
            is_public = true OR 
            owner_id = auth.uid() OR
            id IN (
                SELECT orchard_id FROM orchard_permissions 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Orchard managers and workers can manage trees" ON orchard_trees
    FOR ALL USING (
        orchard_id IN (
            SELECT id FROM orchards WHERE 
            owner_id = auth.uid() OR
            id IN (
                SELECT orchard_id FROM orchard_permissions 
                WHERE user_id = auth.uid() 
                AND permission_type = 'worker'
            )
        )
    );

-- TreeSpecies policies
CREATE POLICY "Users can view validated species" ON tree_species
    FOR SELECT USING (
        is_validated = true OR
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'species_manager')
        )
    );

CREATE POLICY "Species managers can manage species" ON tree_species
    FOR ALL USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'species_manager')
        )
    );

-- OrchardPermissions policies
CREATE POLICY "Orchard owners can manage permissions" ON orchard_permissions
    FOR ALL USING (
        orchard_id IN (
            SELECT id FROM orchards WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their permissions" ON orchard_permissions
    FOR SELECT USING (user_id = auth.uid());

-- FavoriteTrees policies
CREATE POLICY "Users can manage their favorites" ON favorite_trees
    FOR ALL USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ==============================================
-- MIGRATION COMPLETE! 
-- ==============================================