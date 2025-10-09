# Database Schema - OrchardMap (Basis Versie)

## Schema Overzicht
Dit document beschrijft het basis database schema voor OrchardMap MVP, gefocust op de kern functionaliteiten.

## Tabellen

### 1. Users (Basis Gebruikersgegevens)
```sql
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

CREATE TYPE user_role AS ENUM (
    'admin',
    'orchard_manager', 
    'orchard_worker',
    'species_manager',
    'registered_user'
);
```

### 2. TreeSpecies (Boomsoorten)
```sql
CREATE TABLE tree_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basis identificatie
    variety_name VARCHAR(100) NOT NULL, -- Variëteitsnaam
    synonyms TEXT[], -- Array van synoniemen
    main_synonym VARCHAR(100), -- Belangrijkste synoniem (vet)
    fruit_type VARCHAR(50) NOT NULL, -- Type fruit (appel, peer, kers, etc.)
    
    -- Herkomst
    origin_country VARCHAR(100), -- Land van herkomst
    origin_year INTEGER, -- Jaar van ontstaan
    origin_person VARCHAR(200), -- Persoon/kwekersnaam
    
    -- Productiviteit
    productivity_period productivity_period, -- Vroeg/Laat
    alternate_bearing BOOLEAN, -- Beurtjaren Y/N
    productivity_amount productivity_amount, -- Laag/Gemiddeld/Hoog
    
    -- Bloei
    bloom_period bloom_period, -- Vroeg/Middentijds/Laat
    
    -- Stuifmeel
    pollen_quality pollen_quality, -- Goed/Slecht
    self_pollinating pollination_rating, -- +/=/- 
    pollinators TEXT[], -- Array van bevruchters
    
    -- Ziektegevoeligheid
    scab_resistance disease_resistance, -- +/=/- Schurft
    mildew_resistance disease_resistance, -- +/=/- Meeldauw
    canker_resistance disease_resistance, -- +/=/- Kanker
    other_diseases TEXT[], -- Andere ziektes
    
    -- Soorteigenschappen en teelt
    location_type location_type, -- Boomgaard/Fruittuin/Beide
    target_audience target_audience, -- Liefhebbers/Professionelen
    soil_requirements TEXT, -- Geschikt voor welke grond
    planting_height TEXT, -- Hoogte waarop aangeplant
    rootstock_info TEXT, -- Stamvormer/tussenstam info
    cultivation_notes TEXT, -- Andere eigenschappen
    
    -- Vorm
    fruit_size fruit_size, -- Zeer klein tot Zeer groot
    fruit_shape fruit_shape, -- Bol/Afgeplat/Conisch/etc
    has_ribs BOOLEAN, -- Ribben Y/N
    is_symmetric BOOLEAN, -- Symmetrie Y/N
    
    -- Kelk
    calyx_size size_rating, -- Klein/Middelgroot/Groot
    calyx_width width_rating, -- Smal/Gemiddeld/Breed
    calyx_depth depth_rating, -- Ondiep/Gemiddeld/Diep
    calyx_state calyx_state, -- Open/Halfopen/Gesloten
    calyx_notes TEXT, -- Roest, ribben, etc
    
    -- Steel
    stem_length length_rating, -- Kort/Middellang/Lang
    stem_thickness thickness_rating, -- Dun/Middelmatig/Dik
    stem_cavity_width width_rating, -- Smal/Gemiddeld/Breed
    stem_cavity_depth depth_rating, -- Ondiep/Gemiddeld/Diep
    stem_notes TEXT, -- Roest, ribben, etc
    
    -- Schil
    skin_texture skin_texture, -- Glad/Ruw
    skin_gloss skin_gloss, -- Glanzend/Dof
    skin_thickness skin_thickness, -- Dun/Stevig
    ground_color VARCHAR(50), -- Groen/gele ondertonen
    cover_color VARCHAR(50), -- Rood/roze/oranje
    color_pattern TEXT[], -- Effen/Gevlekt/Gestreept/etc (combo mogelijk)
    has_lenticels BOOLEAN, -- Lenticellen Y/N
    
    -- Vruchtvlees
    flesh_color VARCHAR(50), -- Wit/Witgroen/Créme/etc
    flesh_bite flesh_bite, -- Zacht/Krokant
    flesh_texture flesh_texture, -- Fijn/Fijnkorrelig/Korrelig
    juice_content juice_content, -- Sappig/Matig sappig/Droog
    taste_profile taste_profile, -- Zoet/Zuurzoet/etc
    has_aroma BOOLEAN, -- Aroma Y/N
    flavor_notes TEXT, -- Noten van (ananas, banaan, etc)
    
    -- Klokhuis
    core_shape VARCHAR(100), -- Vorm beschrijving
    core_position core_position, -- Hoog/Midden/Laag
    seed_size size_rating, -- Klein/Middelgroot/Groot
    seed_count seed_count, -- Weinig/Middelmatig/Veel
    core_notes TEXT, -- Speciale eigenschappen
    
    -- Rijptijd
    harvest_time VARCHAR(50), -- Maand(deel) bv: eind augustus
    storage_period VARCHAR(100), -- Bewaarbaar tot
    storage_notes TEXT, -- Verrimpelen, vettig worden, etc
    
    -- Gebruik
    uses TEXT[], -- Array: Cider/Verwerking/Eetappel/etc
    
    -- Systeem velden
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum types voor tree_species (English values for internationalization)
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
```

### 3. Orchards (Boomgaarden)
```sql
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
```

### 4. OrchardTrees (Bomen in Boomgaarden)
```sql
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

CREATE TYPE tree_condition AS ENUM (
    'planted',
    'not_productive',
    'productive',
    'dormant'
);

CREATE TYPE health_status AS ENUM (
    'healthy',
    'less_healthy',
    'sick',
    'quarantine'
);

CREATE TYPE maintenance_status AS ENUM (
    'none',
    'pruning_scheduled',
    'removal_scheduled'
);

CREATE TYPE bloom_status AS ENUM (
    'dormant',
    'blooming',
    'fruit_bearing',
    'harvest_ready'
);
```

### 5. OrchardPermissions (Toegangsrechten)
```sql
CREATE TABLE orchard_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orchard_id UUID NOT NULL REFERENCES orchards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_type permission_type NOT NULL,
    granted_by UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(orchard_id, user_id)
);

CREATE TYPE permission_type AS ENUM (
    'worker',
    'viewer'
);
```

### 6. FavoriteTrees (Favoriete Bomen)
```sql
CREATE TABLE favorite_trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    orchard_tree_id UUID NOT NULL REFERENCES orchard_trees(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, orchard_tree_id)
);
```

### 7. AuditLog (Audit Trail)
```sql
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

CREATE TYPE audit_action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE'
);
```

### 8. Notifications (Basis Notificaties)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_id UUID, -- kan verwijzen naar orchard, tree, etc.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
    'access_granted',
    'favorite_updated',
    'system_message'
);
```

## Indexen voor Performance

```sql
-- Orchards indexen
CREATE INDEX idx_orchards_owner_id ON orchards(owner_id);
CREATE INDEX idx_orchards_public ON orchards(is_public);
CREATE INDEX idx_orchards_location ON orchards USING GIST(ll_to_earth(latitude, longitude));

-- OrchardTrees indexen
CREATE INDEX idx_orchard_trees_orchard_id ON orchard_trees(orchard_id);
CREATE INDEX idx_orchard_trees_species_id ON orchard_trees(tree_species_id);
CREATE INDEX idx_orchard_trees_condition ON orchard_trees(condition);
CREATE INDEX idx_orchard_trees_health ON orchard_trees(health_status);
CREATE INDEX idx_orchard_trees_bloom ON orchard_trees(bloom_status);
CREATE INDEX idx_orchard_trees_location ON orchard_trees USING GIST(ll_to_earth(latitude, longitude));

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
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS op alle tabellen
ALTER TABLE orchards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Voorbeelden van RLS policies (uitgebreidere policies volgen later)

-- Orchards: Eigenaren + workers + publieke orchards
CREATE POLICY "Users can view accessible orchards" ON orchards
    FOR SELECT USING (
        is_public = true OR 
        owner_id = auth.uid() OR
        id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid()
        )
    );

-- OrchardTrees: Toegang via orchard permissions
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

-- TreeSpecies: Gevalideerde soorten voor iedereen, alle voor species managers
CREATE POLICY "Users can view validated species" ON tree_species
    FOR SELECT USING (
        is_validated = true OR
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'species_manager'
        )
    );
```

## Schema Validatie (MVP Versie)

Dit basis schema ondersteunt de kern user stories:
- ✅ Volledig rollenbeheer en toegangscontrole
- ✅ Boomgaardbeheer (publiek/privé)
- ✅ Boombeheer met status tracking
- ✅ Boomsoortenbeheer met validatie
- ✅ Favorieten functionaliteit
- ✅ GPS-functionaliteit voor navigatie
- ✅ Audit trail voor traceerbaarheid
- ✅ Basis notificatiesysteem

**Weggelaten voor later (v2.0)**:
- ❌ Tree comments systeem
- ❌ Maintenance tasks planning
- ❌ Saved searches functionaliteit

**Bijgewerkt met data**:
- ✅ TreeSpecies volledig uitgewerkt met boomgaardenstichting velden

Volgende stap: TreeSpecies velden definiëren op basis van boomgaardenstichting data.