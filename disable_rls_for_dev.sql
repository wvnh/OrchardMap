-- disable_rls_for_dev.sql
-- Tijdelijk RLS uitschakelen voor ontwikkeling

-- RLS uitschakelen voor ontwikkeling
ALTER TABLE orchards DISABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees DISABLE ROW LEVEL SECURITY;

-- Policies verwijderen om conflicten te voorkomen
DROP POLICY IF EXISTS "Anyone can view public orchards" ON orchards;
DROP POLICY IF EXISTS "Owners can view own orchards" ON orchards;
DROP POLICY IF EXISTS "Permitted users can view orchards" ON orchards;
DROP POLICY IF EXISTS "Anyone can view trees in public orchards" ON orchard_trees;
DROP POLICY IF EXISTS "Owners can view trees in own orchards" ON orchard_trees;
DROP POLICY IF EXISTS "Permitted users can view trees" ON orchard_trees;