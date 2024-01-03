CREATE DATABASE green_veggies;
USE green_veggies;

CREATE TABLE products (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INT,
  added TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, description, category, price, stock_quantity)
VALUES 
('Apples', 'Sweet and juicy red apples', 'Fruits', 5.0, 10),
('Bananas', 'Yellow and ripe bananas', 'Fruits', 2.5, 15),
('Spinach', 'Fresh and nutritious spinach leaves', 'Vegetables', 4.0, 5),
('Strawberries', 'Delicious and red strawberries', 'Fruits', 8.0, 8),
('Tomatoes', 'Ripe and flavorful tomatoes', 'Vegetables', 2.2, 12);
