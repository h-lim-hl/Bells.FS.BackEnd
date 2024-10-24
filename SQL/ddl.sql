-- DROP DATABASE smithy;

CREATE DATABASE smithy;
USE smithy;

CREATE TABLE smiths (
  smith_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  date_joined DATE NOT NULL,
  name VARCHAR(800) NOT NULL,
  prior_experience TINYINT UNSIGNED NOT NULL
);

CREATE TABLE customers (
  customer_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(800) NOT NULL,
  contact VARCHAR(15) NOT NULL,
  address VARCHAR(300) NOT NULL,
  email VARCHAR(320) UNIQUE NOT NULL
);

CREATE TABLE templates (
  template_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(400) NOT NULL,
  base_cost DECIMAL(10, 2),
  description TEXT
);

CREATE TABLE materials (
  material_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(400) NOT NULL,
  cubic_cost DECIMAL(10, 2),
  description TEXT
);

CREATE TABLE orders(
  order_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  posted DATETIME NOT NULL,
  complete_by DATE NOT NULL,
  smith_id INT UNSIGNED NOT NULL,
  template_id INT UNSIGNED NOT NULL,
  material_id INT UNSIGNED NOT NULL,
  customer_id INT UNSIGNED NOT NULL,
  completed_at DATETIME,
  remarks TEXT
);

ALTER TABLE orders ADD CONSTRAINT fk_orders_smiths
  FOREIGN KEY (smith_id) REFERENCES smiths(smith_id);

ALTER TABLE orders ADD CONSTRAINT fk_orders_templates
  FOREIGN KEY (template_id) REFERENCES templates(template_id);

ALTER TABLE orders ADD CONSTRAINT fk_orders_materials
  FOREIGN KEY (material_id) REFERENCES materials(material_id);
  
ALTER TABLE orders
  ADD INDEX idx_smith_id (smith_id),
  ADD INDEX idx_template_id (template_id),
  ADD INDEX idx_material_id (material_id),
  ADD INDEX idx_customer_id (customer_id);
  
ALTER TABLE smiths
  ADD CONSTRAINT chk_prior_experience
  CHECK (prior_experience >= 0 AND prior_experience <= 100);
  
ALTER TABLE orders
  ADD CONSTRAINT chk_complete_by CHECK (complete_by >= DATE(posted));
  
