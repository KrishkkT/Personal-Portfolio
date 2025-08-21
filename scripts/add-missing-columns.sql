-- Add missing columns to certificates table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'order') THEN
        ALTER TABLE certificates ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'visible') THEN
        ALTER TABLE certificates ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'category') THEN
        ALTER TABLE certificates ADD COLUMN category TEXT DEFAULT 'Professional';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'level') THEN
        ALTER TABLE certificates ADD COLUMN level TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'hours') THEN
        ALTER TABLE certificates ADD COLUMN hours TEXT DEFAULT '';
    END IF;
END
$$;

-- Add missing columns to projects table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'order') THEN
        ALTER TABLE projects ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'visible') THEN
        ALTER TABLE projects ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
END
$$;

-- Add missing columns to experience table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'order') THEN
        ALTER TABLE experience ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'visible') THEN
        ALTER TABLE experience ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
END
$$;

-- Update order values for certificates if they're all 0
DO $$
DECLARE
    zero_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO zero_count FROM certificates WHERE "order" = 0;
    SELECT COUNT(*) INTO total_count FROM certificates;
    
    IF zero_count = total_count AND total_count > 0 THEN
        WITH numbered_rows AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as row_num
            FROM certificates
        )
        UPDATE certificates c
        SET "order" = nr.row_num
        FROM numbered_rows nr
        WHERE c.id = nr.id;
        
        RAISE NOTICE 'Updated order values for % certificates', total_count;
    END IF;
END
$$;

-- Update order values for projects if they're all 0
DO $$
DECLARE
    zero_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO zero_count FROM projects WHERE "order" = 0;
    SELECT COUNT(*) INTO total_count FROM projects;
    
    IF zero_count = total_count AND total_count > 0 THEN
        WITH numbered_rows AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as row_num
            FROM projects
        )
        UPDATE projects p
        SET "order" = nr.row_num
        FROM numbered_rows nr
        WHERE p.id = nr.id;
        
        RAISE NOTICE 'Updated order values for % projects', total_count;
    END IF;
END
$$;

-- Update order values for experience if they're all 0
DO $$
DECLARE
    zero_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO zero_count FROM experience WHERE "order" = 0;
    SELECT COUNT(*) INTO total_count FROM experience;
    
    IF zero_count = total_count AND total_count > 0 THEN
        WITH numbered_rows AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as row_num
            FROM experience
        )
        UPDATE experience e
        SET "order" = nr.row_num
        FROM numbered_rows nr
        WHERE e.id = nr.id;
        
        RAISE NOTICE 'Updated order values for % experience items', total_count;
    END IF;
END
$$;

-- Add indexes for better performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'certificates' AND indexname = 'idx_certificates_order') THEN
        CREATE INDEX idx_certificates_order ON certificates ("order");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'projects' AND indexname = 'idx_projects_order') THEN
        CREATE INDEX idx_projects_order ON projects ("order");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'experience' AND indexname = 'idx_experience_order') THEN
        CREATE INDEX idx_experience_order ON experience ("order");
    END IF;
END
$$;
