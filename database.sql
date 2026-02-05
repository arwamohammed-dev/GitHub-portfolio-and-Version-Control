-- إنشاء قاعدة البيانات
CREATE DATABASE shopping_db;
USE shopping_db;

-- إنشاء جدول المستخدمين
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- إنشاء جدول المنتجات
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_image VARCHAR(255),
    item_price DECIMAL(10, 2) NOT NULL,
    item_category VARCHAR(50) NOT NULL
);
