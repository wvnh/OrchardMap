-- fix_rls_policies.sql
-- Fix voor infinite recursion in RLS policies

-- Drop problematische policies
DROP POLICY IF EXISTS "Users can view accessible orchards" ON orchards;
DROP POLICY IF EXISTS "Users can view accessible trees" ON orchard_trees;

-- Nieuwe vereenvoudigde policies
CREATE POLICY "Public orchards viewable by all" ON orchards
    FOR SELECT USING (is_public = true);

CREATE POLICY "Orchard owners can view their orchards" ON orchards
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users with permissions can view orchards" ON orchards
    FOR SELECT USING (
        id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid()
        )
    );

-- Trees policies - vereenvoudigd
CREATE POLICY "Trees in public orchards viewable by all" ON orchard_trees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchards 
            WHERE orchards.id = orchard_trees.orchard_id 
            AND orchards.is_public = true
        )
    );

CREATE POLICY "Orchard owners can view their trees" ON orchard_trees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orchards 
            WHERE orchards.id = orchard_trees.orchard_id 
            AND orchards.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users with permissions can view trees" ON orchard_trees
    FOR SELECT USING (
        orchard_id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid()
        )
    );