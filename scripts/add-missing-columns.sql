-- Add missing columns to certificates table
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'category') THEN
        ALTER TABLE certificates ADD COLUMN category TEXT DEFAULT 'Professional';
    END IF;
    
    -- Add visible column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'visible') THEN
        ALTER TABLE certificates ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
    
    -- Add order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'order') THEN
        ALTER TABLE certificates ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to projects table
DO $$ 
BEGIN
    -- Add visible column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'visible') THEN
        ALTER TABLE projects ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
    
    -- Add order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'order') THEN
        ALTER TABLE projects ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to experience table
DO $$ 
BEGIN
    -- Add visible column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'visible') THEN
        ALTER TABLE experience ADD COLUMN visible BOOLEAN DEFAULT true;
    END IF;
    
    -- Add order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'order') THEN
        ALTER TABLE experience ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create hero_section table if it doesn't exist
CREATE TABLE IF NOT EXISTS hero_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    profile_image TEXT,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_section table if it doesn't exist
CREATE TABLE IF NOT EXISTS about_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    profile_image TEXT,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing records to have proper order values
UPDATE certificates SET "order" = 
    (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM certificates c2 WHERE c2.id = certificates.id)
WHERE "order" IS NULL OR "order" = 0;

UPDATE projects SET "order" = 
    (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM projects p2 WHERE p2.id = projects.id)
WHERE "order" IS NULL OR "order" = 0;

UPDATE experience SET "order" = 
    (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM experience e2 WHERE e2.id = experience.id)
WHERE "order" IS NULL OR "order" = 0;
