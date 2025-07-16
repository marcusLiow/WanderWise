-- Database Schema for WanderWise

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
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  university VARCHAR(255),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  university_id INT NOT NULL,
  exchange_university_id INT NOT NULL,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Expenses table
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

-- Countries table
CREATE TABLE countries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Sample data
INSERT INTO universities (name, description, logo, country, flag, rating) VALUES
('ESSEC Business School', "ESSEC Business School, founded in 1907, is one of France\'s most prestigious and internationally recognized business schools. With campuses in Cergy (near Paris), Singapore, and Rabat, ESSEC offers a diverse and global learning environment. Known for its academic excellence, strong industry connections, and focus on innovation and leadership, ESSEC attracts students from around the world.", '/images/essec-logo.png', 'France', '/images/france-flag.png', 4.7);

INSERT INTO countries (name, flag) VALUES
('France', '/images/france-flag.png'),
('Germany', '/images/germany-flag.png'),
('Spain', '/images/spain-flag.png'),
('Italy', '/images/italy-flag.png'),
('United Kingdom', '/images/uk-flag.png');

-- Add indexes for better performance
CREATE INDEX idx_universities_name ON universities(name);
CREATE INDEX idx_reviews_university ON reviews(university_id);
CREATE INDEX idx_expenses_university ON expenses(university_id);
CREATE INDEX idx_photo_highlights_university ON photo_highlights(university_id);
CREATE INDEX idx_travels_user ON travels(user_id);
CREATE INDEX idx_travels_country ON travels(country_id);