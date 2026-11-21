-- ============================================================
-- Ruffcol - Esquema equivalente para MySQL 8+
-- Para la implementación Java / Spring Boot (legado).
-- La app Node.js activa usa SQLite (ver 01_esquema_sqlite.sql).
--
-- Uso:
--   mysql -u root -p < 04_esquema_mysql.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ruffcol_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ruffcol_db;

-- ------------------------------------------------------------
-- USUARIO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    username       VARCHAR(50)  NOT NULL,
    email          VARCHAR(100),
    password       VARCHAR(255) NOT NULL,
    rol            VARCHAR(20)  NOT NULL COMMENT 'CLIENTE | ADMIN | SUPER_ADMIN',
    estado_cuenta  VARCHAR(20)  NOT NULL COMMENT 'PENDIENTE | ACTIVO | INACTIVO',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_username UNIQUE (username)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- CATEGORIA
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT uq_categoria_nombre UNIQUE (nombre)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- PRODUCTO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100)  NOT NULL,
    descripcion  TEXT,
    precio       DECIMAL(10,2) NOT NULL,
    stock        INT           NOT NULL,
    imagen       LONGBLOB,
    id_categoria INT           NOT NULL,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id)
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- PEDIDO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pedido DATETIME      NOT NULL,
    estado       VARCHAR(20)   NOT NULL COMMENT 'PENDIENTE | EN_CONFECCION | ENVIADO | ENTREGADO',
    total        DECIMAL(10,2) NOT NULL,
    id_usuario   INT           NOT NULL,
    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- DETALLE_PEDIDO
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    id_pedido       INT           NOT NULL,
    id_producto     INT           NOT NULL,
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido) REFERENCES pedido(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id)
        ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Índices recomendados
-- ------------------------------------------------------------
CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_pedido_usuario     ON pedido(id_usuario);
CREATE INDEX idx_detalle_pedido     ON detalle_pedido(id_pedido);
CREATE INDEX idx_detalle_producto   ON detalle_pedido(id_producto);

-- ------------------------------------------------------------
-- Datos iniciales
-- ------------------------------------------------------------
INSERT IGNORE INTO categoria (nombre, descripcion) VALUES
    ('Collares',   'Collares para perros y gatos'),
    ('Ropa',       'Ropa de temporada para mascotas'),
    ('Accesorios', 'Accesorios varios');

-- usuario: superadmin / contraseña: admin123 (bcrypt, 10 rondas)
INSERT IGNORE INTO usuario (nombre, username, email, password, rol, estado_cuenta)
VALUES ('Super Admin', 'superadmin', 'superadmin@ruffcol.com',
        '$2a$10$odIT4S.1jvi31V837wpbYeZNimIrddQiAW3ncDtOHWG66Bt/MwwNm',
        'SUPER_ADMIN', 'ACTIVO');
