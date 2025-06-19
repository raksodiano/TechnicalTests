-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS myappdb;
USE myappdb;

-- Crear la tabla "users"
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()) COMMENT 'ID único del usuario',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email del usuario',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña del usuario',
    status ENUM('DISABLED', 'ENABLED', 'SUSPENDED') NOT NULL DEFAULT 'DISABLED' COMMENT 'Estado de la cuenta del usuario',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    deletedAt DATETIME NULL DEFAULT NULL COMMENT 'Fecha de su eliminación'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador
INSERT INTO users (id, email, password, status)
VALUES (UUID(), 'admin@correo.com', '$2a$12$D8gBeAtQKYe.OOIxgposReqb4wbCuMZMx17TmMHso6XQMfQ9HN.xm', 'ENABLED');
