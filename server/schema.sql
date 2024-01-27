-- mysql --socket /tmp/mysql_3306.sock -uroot


CREATE DATABASE green_veggies;
USE green_veggies;

-- pusty string !!
CREATE TABLE products (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INT,
  farmer_id VARCHAR(40),
  FOREIGN KEY (farmer_id) REFERENCES users(UID),
  added TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE users (
  UID VARCHAR(40) PRIMARY KEY,
  role ENUM('USER', 'ADMIN', 'FARMER') DEFAULT 'USER'
);

CREATE TABLE notifications (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INT,
  farmer_id VARCHAR(40),
  FOREIGN KEY (farmer_id) REFERENCES users(UID),
  added TIMESTAMP NOT NULL DEFAULT NOW()
);


INSERT INTO users(UID, role) VALUES
('70powABQsAOf57JTUcObV8xRyg82', 'admin');
('ZGSygC8FkjWeQGEnj2BosFB4rIO2', 'admin'),


('ZGSygC8FkjWeQGEnj2BosFB4rIO2', 'admin'),

INSERT INTO products (name, description, category, price, stock_quantity)
VALUES 
('Apples', 'Sweet and juicy red apples', 'Fruits', 5.0, 10),
('Bananas', 'Yellow and ripe bananas', 'Fruits', 2.5, 15),
('Spinach', 'Fresh and nutritious spinach leaves', 'Vegetables', 4.0, 5),
('Strawberries', 'Delicious and red strawberries', 'Fruits', 8.0, 8),
('Tomatoes', 'Ripe and flavorful tomatoes', 'Vegetables', 2.2, 12);
