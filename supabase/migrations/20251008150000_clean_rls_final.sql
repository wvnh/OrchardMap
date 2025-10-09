-- Clean RLS setup - alle policies vervangen
-- Migratie: 20251008150000_clean_rls_final.sql

-- Disable RLS first
ALTER TABLE orchards DISABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees DISABLE ROW LEVEL SECURITY;
ALTER TABLE tree_species DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_trees DISABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_permissions DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "orchards_public_access" ON orchards;
DROP POLICY IF EXISTS "orchards_owner_access" ON orchards;
DROP POLICY IF EXISTS "orchards_permission_access" ON orchards;
DROP POLICY IF EXISTS "orchards_simple_access" ON orchards;
DROP POLICY IF EXISTS "orchards_owner_write" ON orchards;

DROP POLICY IF EXISTS "trees_public_orchard_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_owner_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_permission_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_simple_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_owner_write" ON orchard_trees;

DROP POLICY IF EXISTS "tree_species_public_read" ON tree_species;
DROP POLICY IF EXISTS "tree_species_admin_write" ON tree_species;

DROP POLICY IF EXISTS "favorite_trees_own_only" ON favorite_trees;
DROP POLICY IF EXISTS "orchard_permissions_involved_users" ON orchard_permissions;
DROP POLICY IF EXISTS "orchard_permissions_owner_manage" ON orchard_permissions;

-- Opnieuw enable RLS
ALTER TABLE orchards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_permissions ENABLE ROW LEVEL SECURITY;

-- NIEUWE SIMPELE POLICIES ZONDER RECURSIE

-- 1. Orchards: Super simpel
CREATE POLICY "orchards_read" ON orchards
    FOR SELECT
    USING (
        is_public = true
        OR 
        (auth.uid() IS NOT NULL AND owner_id = auth.uid())
    );

-- 2. Trees: Via orchard ID zonder join
CREATE POLICY "trees_read" ON orchard_trees
    FOR SELECT
    USING (
        orchard_id IN (
            SELECT id FROM orchards 
            WHERE is_public = true
            OR (auth.uid() IS NOT NULL AND owner_id = auth.uid())
        )
    );

-- 3. Tree species: Publiek
CREATE POLICY "species_read" ON tree_species
    FOR SELECT
    USING (true);

-- 4. Favorites: Alleen eigen
CREATE POLICY "favorites_all" ON favorite_trees
    FOR ALL
    USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 5. Permissions: Alleen betrokken users
CREATE POLICY "permissions_read" ON orchard_permissions
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND (
            user_id = auth.uid()
            OR orchard_id IN (
                SELECT id FROM orchards WHERE owner_id = auth.uid()
            )
        )
    );

-- WRITE POLICIES voor owners
CREATE POLICY "orchards_write" ON orchards
    FOR ALL
    USING (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "trees_write" ON orchard_trees
    FOR ALL
    USING (
        auth.uid() IS NOT NULL 
        AND orchard_id IN (
            SELECT id FROM orchards WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "species_write" ON tree_species
    FOR ALL
    USING (
        auth.uid() IS NOT NULL 
        AND auth.uid() IN (
            SELECT id FROM users WHERE role = 'species_manager'
        )
    );

CREATE POLICY "permissions_write" ON orchard_permissions
    FOR ALL
    USING (
        auth.uid() IS NOT NULL
        AND orchard_id IN (
            SELECT id FROM orchards WHERE owner_id = auth.uid()
        )
    );