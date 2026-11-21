-- ============================================================
-- Ruffcol - Datos iniciales (SQLite)
-- Reproduce lo que el backend siembra automáticamente al arrancar:
--   1) Tres categorías de prueba.
--   2) Un super administrador.
--
-- Uso:
--   sqlite3 ruffcol.db < 02_datos_iniciales.sql
--
-- Credenciales del super admin:
--   usuario:    superadmin
--   contraseña: admin123
-- El hash corresponde a bcrypt (10 rondas) de "admin123".
-- ============================================================

-- Categorías de prueba
INSERT OR IGNORE INTO categoria (nombre, descripcion) VALUES
    ('Collares',   'Collares para perros y gatos'),
    ('Ropa',       'Ropa de temporada para mascotas'),
    ('Accesorios', 'Accesorios varios');

-- Super administrador
-- (Cambiar la contraseña en un entorno real)
INSERT OR IGNORE INTO usuario (nombre, username, email, password, rol, estado_cuenta)
VALUES (
    'Super Admin',
    'superadmin',
    'superadmin@ruffcol.com',
    '$2a$10$odIT4S.1jvi31V837wpbYeZNimIrddQiAW3ncDtOHWG66Bt/MwwNm',
    'SUPER_ADMIN',
    'ACTIVO'
);

-- ------------------------------------------------------------
-- Datos de ejemplo opcionales (descomentar si se desean)
-- ------------------------------------------------------------
-- Cliente de ejemplo (contraseña: cliente123)
-- INSERT OR IGNORE INTO usuario (nombre, username, email, password, rol, estado_cuenta)
-- VALUES ('Emmanuel', 'cliente', 'emmanuel@example.com',
--         '$2a$10$REEMPLAZAR_POR_HASH_DE_cliente123', 'CLIENTE', 'ACTIVO');
--
-- Producto de ejemplo
-- INSERT INTO producto (nombre, descripcion, precio, stock, imagen, id_categoria)
-- VALUES ('Vestido de flores amarillo', 'Vestido de temporada', 100000, 30, NULL, 2);
