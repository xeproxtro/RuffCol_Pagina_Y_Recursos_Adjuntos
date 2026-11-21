-- ============================================================
-- Ruffcol - Consultas útiles (SQLite)
-- Ejemplos para verificación, reportes y evidencias del proyecto.
-- Uso:
--   sqlite3 ruffcol.db < 03_consultas_utiles.sql
-- o ejecutar cada bloque por separado.
-- ============================================================

-- 1) Productos con el nombre de su categoría
SELECT p.id,
       p.nombre        AS producto,
       p.precio,
       p.stock,
       c.nombre        AS categoria
FROM producto p
LEFT JOIN categoria c ON p.id_categoria = c.id
ORDER BY c.nombre, p.nombre;

-- 2) Cantidad de productos por categoría
SELECT c.id,
       c.nombre AS categoria,
       COUNT(p.id) AS total_productos
FROM categoria c
LEFT JOIN producto p ON p.id_categoria = c.id
GROUP BY c.id, c.nombre
ORDER BY total_productos DESC;

-- 3) Pedidos con el nombre del cliente
SELECT p.id,
       p.fecha_pedido,
       u.nombre   AS cliente,
       u.username,
       p.estado,
       p.total
FROM pedido p
LEFT JOIN usuario u ON p.id_usuario = u.id
ORDER BY p.fecha_pedido DESC;

-- 4) Detalle completo de cada pedido (cabecera + líneas)
SELECT p.id                        AS pedido,
       u.nombre                    AS cliente,
       p.estado,
       p.fecha_pedido,
       pr.nombre                   AS producto,
       d.cantidad,
       d.precio_unitario,
       (d.cantidad * d.precio_unitario) AS subtotal
FROM pedido p
JOIN usuario u         ON u.id = p.id_usuario
JOIN detalle_pedido d  ON d.id_pedido = p.id
JOIN producto pr       ON pr.id = d.id_producto
ORDER BY p.id, d.id;

-- 5) Pedidos de un usuario específico (por username)
SELECT p.id, p.fecha_pedido, p.estado, p.total
FROM pedido p
JOIN usuario u ON u.id = p.id_usuario
WHERE u.username = 'cliente'
ORDER BY p.fecha_pedido DESC;

-- 6) Total vendido y número de pedidos por estado
SELECT estado,
       COUNT(*)   AS pedidos,
       SUM(total) AS monto_total
FROM pedido
GROUP BY estado;

-- 7) Productos más vendidos (por unidades y por monto)
SELECT pr.id,
       pr.nombre                         AS producto,
       SUM(d.cantidad)                   AS unidades_vendidas,
       SUM(d.cantidad * d.precio_unitario) AS monto
FROM detalle_pedido d
JOIN producto pr ON pr.id = d.id_producto
GROUP BY pr.id, pr.nombre
ORDER BY unidades_vendidas DESC;

-- 8) Usuarios por rol y estado de cuenta
SELECT rol,
       estado_cuenta,
       COUNT(*) AS total
FROM usuario
GROUP BY rol, estado_cuenta
ORDER BY rol;

-- 9) Administradores y super administradores
SELECT id, nombre, username, email, rol, estado_cuenta
FROM usuario
WHERE rol IN ('ADMIN', 'SUPER_ADMIN')
ORDER BY rol, username;

-- 10) Conteo general de registros (verificación rápida)
SELECT 'usuario'        AS tabla, COUNT(*) AS registros FROM usuario
UNION ALL
SELECT 'categoria',       COUNT(*) FROM categoria
UNION ALL
SELECT 'producto',        COUNT(*) FROM producto
UNION ALL
SELECT 'pedido',          COUNT(*) FROM pedido
UNION ALL
SELECT 'detalle_pedido',  COUNT(*) FROM detalle_pedido;
