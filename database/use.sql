-- ====================================
-- FRESH START - CLEAN SCHEMA SETUP
-- ====================================
-- This completely rebuilds your database with the proper structure

-- Step 1: Drop everything and start fresh
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.universities CASCADE;
DROP TABLE IF EXISTS public.countries CASCADE;
DROP VIEW IF EXISTS public.review_details CASCADE;
DROP VIEW IF EXISTS public.user_details CASCADE;

-- Step 2: Create the countries table
CREATE TABLE public.countries (
  code VARCHAR(2) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  flag TEXT
);

-- Step 3: Insert countries
INSERT INTO public.countries (code, name, flag) VALUES
('AU', 'Australia', 'https://flagcdn.com/au.svg'),
('AT', 'Austria', 'https://flagcdn.com/at.svg'),
('BE', 'Belgium', 'https://flagcdn.com/be.svg'),
('BR', 'Brazil', 'https://flagcdn.com/br.svg'),
('CA', 'Canada', 'https://flagcdn.com/ca.svg'),
('CN', 'China', 'https://flagcdn.com/cn.svg'),
('CZ', 'Czech Republic', 'https://flagcdn.com/cz.svg'),
('DK', 'Denmark', 'https://flagcdn.com/dk.svg'),
('FI', 'Finland', 'https://flagcdn.com/fi.svg'),
('FR', 'France', 'https://flagcdn.com/fr.svg'),
('DE', 'Germany', 'https://flagcdn.com/de.svg'),
('HK', 'Hong Kong', 'https://flagcdn.com/hk.svg'),
('HU', 'Hungary', 'https://flagcdn.com/hu.svg'),
('IS', 'Iceland', 'https://flagcdn.com/is.svg'),
('IE', 'Ireland', 'https://flagcdn.com/ie.svg'),
('IT', 'Italy', 'https://flagcdn.com/it.svg'),
('JP', 'Japan', 'https://flagcdn.com/jp.svg'),
('KZ', 'Kazakhstan', 'https://flagcdn.com/kz.svg'),
('LT', 'Lithuania', 'https://flagcdn.com/lt.svg'),
('NL', 'Netherlands', 'https://flagcdn.com/nl.svg'),
('NO', 'Norway', 'https://flagcdn.com/no.svg'),
('PH', 'Philippines', 'https://flagcdn.com/ph.svg'),
('PL', 'Poland', 'https://flagcdn.com/pl.svg'),
('PT', 'Portugal', 'https://flagcdn.com/pt.svg'),
('KR', 'South Korea', 'https://flagcdn.com/kr.svg'),
('SG', 'Singapore', 'https://flagcdn.com/sg.svg'),
('ES', 'Spain', 'https://flagcdn.com/es.svg'),
('SE', 'Sweden', 'https://flagcdn.com/se.svg'),
('CH', 'Switzerland', 'https://flagcdn.com/ch.svg'),
('TW', 'Taiwan', 'https://flagcdn.com/tw.svg'),
('TH', 'Thailand', 'https://flagcdn.com/th.svg'),
('TR', 'Turkey', 'https://flagcdn.com/tr.svg'),
('GB', 'United Kingdom', 'https://flagcdn.com/gb.svg'),
('US', 'United States', 'https://flagcdn.com/us.svg');

-- Step 4: Create universities table
CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo TEXT,
  country_code VARCHAR(2) NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT universities_country_fkey FOREIGN KEY (country_code) REFERENCES public.countries(code),
  CONSTRAINT universities_name_country_unique UNIQUE (name, country_code)
);

-- Step 5: Insert your universities with country codes (sample - you'll add the rest)
INSERT INTO public.universities (id, name, description, logo, country_code, rating) VALUES
('35e80a1b-8ddb-4797-a652-88fab15c5b74', 'ESADE', 'Leading business school in Barcelona.', '/images/esade-logo.png', 'ES', 4.6),
('44579d77-7b96-49df-8faf-d47929ea9204', 'IE University', 'Private university with innovative programs.', '/images/ie-logo.png', 'ES', 4.4),
('51d73538-117e-4149-bae3-9d1d9ca043c9', 'Ghent University', 'Major Belgian university with strong research programs.', '/images/ugent-logo.png', 'BE', 4.1),
('74e36105-3380-4d3d-962e-decbed1ff65f', 'HEC Paris', 'Leading European business school.', '/images/hec-paris-logo.png', 'FR', 4.6),
('a3316a0d-079b-4cfe-bcf9-9ebbba8c0e60', 'University of Zurich', 'Largest university in Switzerland.', '/images/uzh-logo.png', 'CH', 4.3),
('435783d3-63bb-46d4-905b-873bce7feaa0', 'Fudan University Law School', 'Top law school in China.', '/images/fudan-law-logo.png', 'CN', 4.5),
('7b44e947-338d-4a38-a0a3-bda4270c6158', 'Chinese University of Hong Kong', 'Leading research university in Hong Kong.', '/images/cuhk-logo.png', 'HK', 4.5),
('f0077fd2-b59d-4caf-813f-0b3d1b533027', 'McGill University', 'Public research university in Montreal.', '/images/mcgill-logo.png', 'CA', 4.2);

-- Step 6: Create users table
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nationality_code VARCHAR(2),
  "dateOfBirth" DATE,
  university_id UUID,
  "profileImage" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT users_nationality_fkey FOREIGN KEY (nationality_code) REFERENCES public.countries(code),
  CONSTRAINT users_university_fkey FOREIGN KEY (university_id) REFERENCES public.universities(id)
);

-- Step 7: Create reviews table
CREATE TABLE public.reviews (
  id BIGSERIAL PRIMARY KEY,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id BIGINT NOT NULL,
  university_id UUID NOT NULL,
  "courseStudied" TEXT NOT NULL,
  gpa NUMERIC(3, 2),
  "overallRating" INTEGER CHECK ("overallRating" >= 1 AND "overallRating" <= 5),
  "academicRating" INTEGER CHECK ("academicRating" >= 1 AND "academicRating" <= 5),
  "academicComment" TEXT,
  "cultureRating" INTEGER CHECK ("cultureRating" >= 1 AND "cultureRating" <= 5),
  "cultureComment" TEXT,
  "foodRating" INTEGER CHECK ("foodRating" >= 1 AND "foodRating" <= 5),
  "foodComment" TEXT,
  "accommodationRating" INTEGER CHECK ("accommodationRating" >= 1 AND "accommodationRating" <= 5),
  "accommodationComment" TEXT,
  "safetyRating" INTEGER CHECK ("safetyRating" >= 1 AND "safetyRating" <= 5),
  "safetyComment" TEXT,
  tags TEXT[],
  "reviewText" TEXT NOT NULL,
  "tipsText" TEXT,
  currency VARCHAR(3),
  "expenseFood" NUMERIC(10, 2) DEFAULT 0,
  "expenseShopping" NUMERIC(10, 2) DEFAULT 0,
  "expenseRental" NUMERIC(10, 2) DEFAULT 0,
  "expensePublicTransport" NUMERIC(10, 2) DEFAULT 0,
  "expenseTravel" NUMERIC(10, 2) DEFAULT 0,
  "expenseMiscellaneous" NUMERIC(10, 2) DEFAULT 0,
  "imageUrls" TEXT[],
  CONSTRAINT reviews_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_university_fkey FOREIGN KEY (university_id) REFERENCES public.universities(id) ON DELETE CASCADE
);

-- Step 8: Create indexes
CREATE INDEX idx_universities_country ON public.universities(country_code);
CREATE INDEX idx_users_university ON public.users(university_id);
CREATE INDEX idx_reviews_university ON public.reviews(university_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
-- Step 9: Create useful views
CREATE VIEW public.review_details AS
SELECT 
    r.id,
    r."created_at",
    u."firstName",
    u."lastName",
    un.name AS university_name,
    c.name AS country_name,
    r."courseStudied",
    r."overallRating",
    r."reviewText",
    r."imageUrls"
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN universities un ON r.university_id = un.id
JOIN countries c ON un.country_code = c.code;

-- Step 10: Sample data for testing
-- Create a test user
INSERT INTO public.users ("firstName", "lastName", email, password, nationality_code, university_id)
VALUES ('Test', 'User', 'test@example.com', 'password123', 'SG', 
        (SELECT id FROM universities WHERE name = 'IE University' LIMIT 1));

-- Create a sample review
INSERT INTO public.reviews (user_id, university_id, "courseStudied", "overallRating", "reviewText")
VALUES (
    (SELECT id FROM users WHERE email = 'test@example.com'),
    (SELECT id FROM universities WHERE name = 'IE University' LIMIT 1),
    'Business Administration',
    5,
    'Amazing experience! Would definitely recommend.'
);

-- Step 11: Enable RLS (optional)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Public read access" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.reviews IS 'Fresh schema setup completed successfully';