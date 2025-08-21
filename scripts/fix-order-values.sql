-- Fix order values for certificates
UPDATE certificates 
SET "order" = subquery.new_order
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM certificates
) AS subquery
WHERE certificates.id = subquery.id;

-- Fix order values for projects  
UPDATE projects 
SET "order" = subquery.new_order
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM projects
) AS subquery
WHERE projects.id = subquery.id;

-- Fix order values for experience
UPDATE experience 
SET "order" = subquery.new_order
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM experience
) AS subquery
WHERE experience.id = subquery.id;

-- Verify the updates
SELECT 'certificates' as table_name, title, "order" FROM certificates ORDER BY "order";
SELECT 'projects' as table_name, title, "order" FROM projects ORDER BY "order";  
SELECT 'experience' as table_name, title, "order" FROM experience ORDER BY "order";
