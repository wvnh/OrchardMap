-- fix_rls_final.sql
-- Definitieve fix voor RLS policies

-- Eerst alle bestaande policies verwijderen
DROP POLICY IF EXISTS "Public orchards viewable by all" ON orchards;
DROP POLICY IF EXISTS "Orchard owners can view their orchards" ON orchards;
DROP POLICY IF EXISTS "Users with permissions can view orchards" ON orchards;
DROP POLICY IF EXISTS "Trees in public orchards viewable by all" ON orchard_trees;
DROP POLICY IF EXISTS "Orchard owners can view their trees" ON orchard_trees;
DROP POLICY IF EXISTS "Users with permissions can view trees" ON orchard_trees;

-- Eenvoudige, werkende policies

-- Orchards: Iedereen kan publieke boomgaarden zien
CREATE POLICY "Anyone can view public orchards" ON orchards
    FOR SELECT USING (is_public = true);

-- Orchards: Eigenaren kunnen hun eigen boomgaarden zien  
CREATE POLICY "Owners can view own orchards" ON orchards
    FOR SELECT USING (owner_id = auth.uid());

-- Orchards: Gebruikers met expliciete toegang
CREATE POLICY "Permitted users can view orchards" ON orchards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchard_permissions op 
            WHERE op.orchard_id = orchards.id 
            AND op.user_id = auth.uid()
        )
    );

-- Trees: Bomen in publieke boomgaarden
CREATE POLICY "Anyone can view trees in public orchards" ON orchard_trees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchards o 
            WHERE o.id = orchard_trees.orchard_id 
            AND o.is_public = true
        )
    );

-- Trees: Eigenaren kunnen bomen in hun boomgaarden zien
CREATE POLICY "Owners can view trees in own orchards" ON orchard_trees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchards o 
            WHERE o.id = orchard_trees.orchard_id 
            AND o.owner_id = auth.uid()
        )
    );

-- Trees: Gebruikers met expliciete toegang tot boomgaard
CREATE POLICY "Permitted users can view trees" ON orchard_trees  
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchard_permissions op 
            WHERE op.orchard_id = orchard_trees.orchard_id 
            AND op.user_id = auth.uid()
        )
    );