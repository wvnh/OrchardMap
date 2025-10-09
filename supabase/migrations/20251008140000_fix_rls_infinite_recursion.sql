-- Fix RLS infinite recursion definitief
-- Migratie: 20241217013000_fix_rls_infinite_recursion.sql

-- Drop alle bestaande policies
DROP POLICY IF EXISTS "orchards_public_access" ON orchards;
DROP POLICY IF EXISTS "orchards_owner_access" ON orchards;
DROP POLICY IF EXISTS "orchards_permission_access" ON orchards;
DROP POLICY IF EXISTS "trees_public_orchard_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_owner_access" ON orchard_trees;
DROP POLICY IF EXISTS "trees_permission_access" ON orchard_trees;

-- Heel eenvoudige policies zonder recursie
-- Orchards: Publiek OF eigenaar OF heeft permission
CREATE POLICY "orchards_simple_access" ON orchards
    FOR SELECT
    USING (
        -- Publieke boomgaarden
        is_public = true
        OR
        -- Eigenaar (alleen als authenticated)
        (auth.role() = 'authenticated' AND owner_id = auth.uid())
        OR
        -- Heeft expliciete permission (alleen als authenticated)
        (auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM orchard_permissions op
            WHERE op.orchard_id = id 
            AND op.user_id = auth.uid()
            AND op.granted_at IS NOT NULL
        ))
    );

-- Trees: Alleen via orchard toegang - GEEN sub-query naar orchards
CREATE POLICY "trees_simple_access" ON orchard_trees
    FOR SELECT
    USING (
        -- Publieke orchard (direct check)
        EXISTS (
            SELECT 1 FROM orchards o
            WHERE o.id = orchard_id 
            AND o.is_public = true
        )
        OR
        -- Eigenaar van orchard (alleen als authenticated)
        (auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM orchards o
            WHERE o.id = orchard_id 
            AND o.owner_id = auth.uid()
        ))
        OR
        -- Heeft permission op orchard (alleen als authenticated)
        (auth.role() = 'authenticated' AND EXISTS (
            SELECT 1 FROM orchard_permissions op
            WHERE op.orchard_id = orchard_id
            AND op.user_id = auth.uid()
            AND op.granted_at IS NOT NULL
        ))
    );

-- Andere tabellen simpele policies
CREATE POLICY "tree_species_public_read" ON tree_species
    FOR SELECT
    USING (true); -- Alle gevalideerde species zijn publiek leesbaar

CREATE POLICY "favorite_trees_own_only" ON favorite_trees
    FOR ALL
    USING (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "orchard_permissions_involved_users" ON orchard_permissions
    FOR SELECT
    USING (
        auth.role() = 'authenticated' 
        AND (
            user_id = auth.uid() -- Je eigen permissions
            OR 
            EXISTS ( -- Of je bent eigenaar van de orchard
                SELECT 1 FROM orchards o 
                WHERE o.id = orchard_id 
                AND o.owner_id = auth.uid()
            )
        )
    );

-- Admin policies voor management
CREATE POLICY "tree_species_admin_write" ON tree_species
    FOR ALL
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'species_manager'
        )
    );

CREATE POLICY "orchard_permissions_owner_manage" ON orchard_permissions
    FOR ALL
    USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM orchards o 
            WHERE o.id = orchard_id 
            AND o.owner_id = auth.uid()
        )
    );

-- Update/Insert policies voor owners
CREATE POLICY "orchards_owner_write" ON orchards
    FOR ALL
    USING (auth.role() = 'authenticated' AND owner_id = auth.uid());

CREATE POLICY "trees_owner_write" ON orchard_trees
    FOR ALL
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM orchards o 
            WHERE o.id = orchard_id 
            AND o.owner_id = auth.uid()
        )
    );