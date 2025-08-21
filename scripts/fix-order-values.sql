-- Fix order values for all tables to have proper sequential ordering
-- This script assigns sequential order values (0, 1, 2, 3...) to all items

-- Fix certificates order values
WITH ordered_certificates AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM certificates
)
UPDATE certificates 
SET "order" = ordered_certificates.new_order,
    updated_at = NOW()
FROM ordered_certificates 
WHERE certificates.id = ordered_certificates.id;

-- Fix projects order values
WITH ordered_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM projects
)
UPDATE projects 
SET "order" = ordered_projects.new_order,
    updated_at = NOW()
FROM ordered_projects 
WHERE projects.id = ordered_projects.id;

-- Fix experience order values
WITH ordered_experience AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM experience
)
UPDATE experience 
SET "order" = ordered_experience.new_order,
    updated_at = NOW()
FROM ordered_experience 
WHERE experience.id = ordered_experience.id;
