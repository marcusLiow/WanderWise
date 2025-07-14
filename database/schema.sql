-- Database Schema for WanderWise
CREATE DATABASE Wanderwise;
use wanderwise;

CREATE TABLE universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo VARCHAR(255),
  country VARCHAR(100),
  flag VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  country VARCHAR(100),
  country_flag VARCHAR(255),
  university_id INT,
  university VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Countries table
CREATE TABLE countries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Overall Reviews table (Card 1)
CREATE TABLE overall_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id VARCHAR(50) NOT NULL UNIQUE, -- Generated review ID
  user_id INT NOT NULL,
  exchange_country_id INT NOT NULL, -- Country of exchange (dropdown)
  exchange_university_id INT NOT NULL, -- Name of uni where exchanging to (dropdown)
  course VARCHAR(255) NOT NULL, -- Course (typed)
  gpa_required DECIMAL(3,2), -- GPA attained to enter exchange uni (typed)
  overall_educational_experience TEXT, -- Overall educational experience (shown on canva pg1)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exchange_country_id) REFERENCES countries(id),
  FOREIGN KEY (exchange_university_id) REFERENCES universities(id)
);

-- Specific Reviews table (Card 2)
CREATE TABLE specific_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  overall_review_id INT NOT NULL, -- Links to overall review
  category ENUM('food', 'accommodation', 'rental', 'social_cultural_integration', 'safety') NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5), -- Overall Rating (stars)
  liked_aspects TEXT, -- What do you like about this uni?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (overall_review_id) REFERENCES overall_reviews(id) ON DELETE CASCADE
);

-- Expenses table (Card 3)
CREATE TABLE review_expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  overall_review_id INT NOT NULL, -- Links to overall review
  currency VARCHAR(10) NOT NULL, -- Currency chosen by user (dropdown)
  food_cost DECIMAL(10,2) DEFAULT 0,
  shopping_cost DECIMAL(10,2) DEFAULT 0,
  travel_cost DECIMAL(10,2) DEFAULT 0,
  rental_cost DECIMAL(10,2) DEFAULT 0,
  miscellaneous_cost DECIMAL(10,2) DEFAULT 0,
  -- Store converted SGD amounts for quick access
  food_cost_sgd DECIMAL(10,2) DEFAULT 0,
  shopping_cost_sgd DECIMAL(10,2) DEFAULT 0,
  travel_cost_sgd DECIMAL(10,2) DEFAULT 0,
  rental_cost_sgd DECIMAL(10,2) DEFAULT 0,
  miscellaneous_cost_sgd DECIMAL(10,2) DEFAULT 0,
  exchange_rate DECIMAL(10,6), -- Store the exchange rate used for conversion
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (overall_review_id) REFERENCES overall_reviews(id) ON DELETE CASCADE
);

-- Legacy expenses table (keeping for backward compatibility if needed)
CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  university_id INT NOT NULL,
  rent INT DEFAULT 0,
  food INT DEFAULT 0,
  transport INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Photo highlights table
CREATE TABLE photo_highlights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Travels table
CREATE TABLE travels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  country_id INT NOT NULL,
  visit_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Currency reference table for dropdown
CREATE TABLE currencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) NOT NULL UNIQUE, -- USD, EUR, GBP, etc.
  name VARCHAR(100) NOT NULL, -- US Dollar, Euro, British Pound, etc.
  symbol VARCHAR(10), -- $, €, £, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO universities (name, description, logo, country, flag, rating) VALUES
('ESSEC Business School', "ESSEC Business School, founded in 1907, is one of France\'s most prestigious and internationally recognized business schools. With campuses in Cergy (near Paris), Singapore, and Rabat, ESSEC offers a diverse and global learning environment. Known for its academic excellence, strong industry connections, and focus on innovation and leadership, ESSEC attracts students from around the world.", '/images/essec-logo.png', 'France', '/images/france-flag.png', 4.7);

INSERT INTO countries (name, flag) VALUES
('France', '/images/france-flag.png'),
('Germany', '/images/germany-flag.png'),
('Spain', '/images/spain-flag.png'),
('Italy', '/images/italy-flag.png'),
('United Kingdom', '/images/uk-flag.png'),
('Singapore', '/images/singapore-flag.png');

-- Sample currency data
INSERT INTO currencies (code, name, symbol) VALUES
('SGD', 'Singapore Dollar', 'S$'),
('USD', 'US Dollar', '$'),
('EUR', 'Euro', '€'),
('GBP', 'British Pound', '£'),
('JPY', 'Japanese Yen', '¥'),
('AUD', 'Australian Dollar', 'A$'),
('CAD', 'Canadian Dollar', 'C$'),
('CHF', 'Swiss Franc', 'CHF'),
('CNY', 'Chinese Yuan', '¥'),
('HKD', 'Hong Kong Dollar', 'HK$');

-- Add indexes for better performance
CREATE INDEX idx_universities_name ON universities(name);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_overall_reviews_review_id ON overall_reviews(review_id);
CREATE INDEX idx_overall_reviews_user ON overall_reviews(user_id);
CREATE INDEX idx_overall_reviews_exchange_uni ON overall_reviews(exchange_university_id);
CREATE INDEX idx_specific_reviews_overall_review ON specific_reviews(overall_review_id);
CREATE INDEX idx_specific_reviews_category ON specific_reviews(category);
CREATE INDEX idx_review_expenses_overall_review ON review_expenses(overall_review_id);
CREATE INDEX idx_expenses_university ON expenses(university_id);
CREATE INDEX idx_photo_highlights_university ON photo_highlights(university_id);
CREATE INDEX idx_travels_user ON travels(user_id);
CREATE INDEX idx_travels_country ON travels(country_id);
CREATE INDEX idx_currencies_code ON currencies(code);