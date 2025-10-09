-- enable_rls_correct.sql
-- Correcte RLS implementatie zonder recursie

-- RLS opnieuw inschakelen
ALTER TABLE orchards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchard_trees ENABLE ROW LEVEL SECURITY;

-- Simpele, werkende policies zonder recursie

-- 1. Orchards policy: Guest users kunnen alleen publieke boomgaarden zien
CREATE POLICY "orchards_public_access" ON orchards
    FOR SELECT USING (
        -- Publieke boomgaarden voor iedereen
        is_public = true
        OR
        -- Eigenaren kunnen hun eigen boomgaarden zien (alleen als ingelogd)
        (auth.uid() IS NOT NULL AND owner_id = auth.uid())
        OR
        -- Gebruikers met expliciete toegang (alleen als ingelogd)
        (auth.uid() IS NOT NULL AND id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid()
        ))
    );

-- 2. Trees policy: Alleen bomen in toegankelijke boomgaarden
CREATE POLICY "trees_access_via_orchard" ON orchard_trees
    FOR SELECT USING (
        -- Check of de boomgaard toegankelijk is via directe logica (geen recursie)
        orchard_id IN (
            SELECT id FROM orchards WHERE
            is_public = true
            OR (auth.uid() IS NOT NULL AND owner_id = auth.uid())
            OR (auth.uid() IS NOT NULL AND id IN (
                SELECT orchard_id FROM orchard_permissions 
                WHERE user_id = auth.uid()
            ))
        )
    );

-- 3. Insert/Update/Delete policies voor eigenaars
CREATE POLICY "orchards_owner_full_access" ON orchards
    FOR ALL USING (auth.uid() IS NOT NULL AND owner_id = auth.uid());

CREATE POLICY "trees_owner_full_access" ON orchard_trees
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        orchard_id IN (
            SELECT id FROM orchards WHERE owner_id = auth.uid()
        )
    );

-- 4. Worker access voor trees
CREATE POLICY "trees_worker_access" ON orchard_trees
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        orchard_id IN (
            SELECT orchard_id FROM orchard_permissions 
            WHERE user_id = auth.uid() AND permission_type = 'worker'
        )
    );