-- debug-rls.sql - Bekijk alle actieve RLS policies

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('orchards', 'orchard_trees', 'tree_species', 'favorite_trees', 'orchard_permissions')
ORDER BY tablename, policyname;