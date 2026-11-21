-- ============================================================
-- Ruffcol - Esquema de base de datos (SQLite)
-- Generado a partir de ruffcol-nodejs-backend/server.js
-- Uso:
--   sqlite3 ruffcol.db < 01_esquema_sqlite.sql
--   sqlite3 ruffcol.db < 02_datos_iniciales.sql
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- USUARIO
-- Cuentas del sistema. El rol define los permisos.
-- rol: CLIENTE | ADMIN | SUPER_ADMIN
-- estado_cuenta: ACTIVO | PENDIENTE | INACTIVO
-- password: hash bcrypt (nunca texto plano)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre         TEXT NOT NULL,
    username       TEXT NOT NULL UNIQUE,
    email          TEXT,
    password       TEXT NOT NULL,
    rol            TEXT NOT NULL,
    estado_cuenta  TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- CATEGORIA
-- Clasificación del catálogo. El nombre es único.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- ------------------------------------------------------------
-- PRODUCTO
-- Cada producto pertenece a una categoría.
-- imagen: contenido binario (BLOB); la API lo devuelve en Base64.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre       TEXT NOT NULL,
    descripcion  TEXT,
    precio       REAL NOT NULL,
    stock        INTEGER NOT NULL,
    imagen       BLOB,
    id_categoria INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

-- ------------------------------------------------------------
-- PEDIDO
-- Cabecera del pedido. Nace en estado PENDIENTE.
-- estado: PENDIENTE | EN_CONFECCION | ENVIADO | ENTREGADO
-- total: calculado en el servidor como suma de los subtotales.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_pedido DATETIME NOT NULL,
    estado       TEXT NOT NULL,
    total        REAL NOT NULL,
    id_usuario   INTEGER NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- ------------------------------------------------------------
-- DETALLE_PEDIDO
-- Líneas del pedido. Guarda el precio al momento de la compra
-- para que cambios posteriores del producto no alteren el histórico.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    cantidad        INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    id_pedido       INTEGER NOT NULL,
    id_producto     INTEGER NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);

-- ------------------------------------------------------------
-- Índices opcionales recomendados (no los crea el servidor actual)
-- ------------------------------------------------------------
-- CREATE INDEX IF NOT EXISTS idx_producto_categoria ON producto(id_categoria);
-- CREATE INDEX IF NOT EXISTS idx_pedido_usuario     ON pedido(id_usuario);
-- CREATE INDEX IF NOT EXISTS idx_detalle_pedido     ON detalle_pedido(id_pedido);
-- CREATE INDEX IF NOT EXISTS idx_detalle_producto   ON detalle_pedido(id_producto);
