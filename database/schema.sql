-- MySQL schema for Amazon Optimizer
CREATE DATABASE IF NOT EXISTS amazon_optimizer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amazon_optimizer;

CREATE TABLE IF NOT EXISTS ProductOptimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(32) NOT NULL,
  original_title TEXT NULL,
  optimized_title TEXT NULL,
  original_bullets LONGTEXT NULL,
  optimized_bullets LONGTEXT NULL,
  original_description LONGTEXT NULL,
  optimized_description LONGTEXT NULL,
  keywords TEXT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_asin (asin)
);



