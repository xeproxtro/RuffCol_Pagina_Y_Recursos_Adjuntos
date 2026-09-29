-- Data SQL para Ruffcol E-commerce
-- Este script inserta los datos iniciales

-- Insertar Super Administrador por defecto
-- Contraseña: admin123 (encriptada con BCrypt)
INSERT INTO usuario (nombre, email, password, rol, estado_cuenta, fecha_registro) VALUES
('Super Administrador', 'superadmin@mascotas.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPER_ADMIN', 'ACTIVO', NOW());

-- Insertar Categorías iniciales
INSERT INTO categoria (nombre, descripcion) VALUES
('Ropa y Vestidos', 'Vestidos elegantes y ropa cómoda para mascotas de todas las tallas'),
('Arneses y Correas', 'Arneses ajustables, correas y accesorios para paseos seguros'),
('Camas y Almohadas', 'Camas ortopédicas y almohadas suaves para el descanso de tu mascota'),
('Juguetes', 'Juguetes interactivos y mordedores para el entretenimiento'),
('Comederos y Bebederos', 'Recipientes para agua y comida en diferentes materiales y diseños');

-- Insertar Productos de prueba
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, id_categoria) VALUES
-- Ropa y Vestidos
('Vestido Floral para Perrita', 'Vestido elegante con diseño floral en tonos pastel. Talla M.', 45.99, 15, '/images/vestido-floral.jpg', 1),
('Suéter de Lana Invernal', 'Suéter abrigado de lana para mantener a tu mascota caliente en invierno.', 35.50, 20, '/images/sueter-lana.jpg', 1),
('Chaqueta Impermeable', 'Chaqueta resistente al agua para paseos en días lluviosos.', 42.00, 12, '/images/chaqueta-impermeable.jpg', 1),
('Camiseta Personalizada', 'Camiseta de algodón con opción de personalizar el nombre.', 25.00, 30, '/images/camiseta-personalizada.jpg', 1),
('Traje de Gala', 'Traje elegante para ocasiones especiales. Disponible en varios colores.', 55.00, 8, '/images/traje-gala.jpg', 1),

-- Arneses y Correas
('Arnés Ajustable Térmico', 'Arnés acolchado y ajustable con materiales transpirables.', 28.00, 25, '/images/arnes-termico.jpg', 2),
('Correa Retráctil 5m', 'Correa retráctil de 5 metros con freno de seguridad.', 18.50, 40, '/images/correa-retractil.jpg', 2),
('Arnés de Seguridad para Auto', 'Arnés especial para viajar seguro en el automóvil.', 32.00, 15, '/images/arnes-auto.jpg', 2),
('Correa de Cuero Premium', 'Correa de cuero genuino de alta calidad. Longitud 1.5m.', 45.00, 10, '/images/correa-cuero.jpg', 2),
('Pechecho Reflectante', 'Pechecho con material reflectante para paseos nocturnos seguros.', 15.00, 35, '/images/pechecho-reflectante.jpg', 2),

-- Camas y Almohadas
('Cama Ortopédica Grande', 'Cama con memory foam para perros grandes. Ideal para articulaciones.', 89.99, 5, '/images/cama-ortopedica.jpg', 3),
('Almohada Suave Gato', 'Almohada ultra suave y acogedora para gatos.', 22.00, 20, '/images/almohada-gato.jpg', 3),
('Casa Comedero Integrada', 'Cama cómoda con comederos integrados. Diseño moderno.', 65.00, 8, '/images/casa-comedero.jpg', 3),
('Cama Elevada', 'Cama elevada con estructura metálica resistente y tela transpirable.', 48.00, 12, '/images/cama-elevada.jpg', 3),
('Cojín Antideslizante', 'Cojín con base antideslizante para múltiples superficies.', 19.50, 30, '/images/cojin-antideslizante.jpg', 3),

-- Juguetes
('Peluche Squeaky', 'Peluche suave con sonido squeaky interno. Diferentes formas.', 12.00, 50, '/images/peluche-squeaky.jpg', 4),
('Mordedor de Goma Resistente', 'Mordedor de goma no tóxica para perros fuertes.', 14.50, 25, '/images/mordedor-goma.jpg', 4),
('Pelota Interactiva LED', 'Pelota que cambia de color al rodar. Ideal para juego nocturno.', 18.00, 20, '/images/pelota-led.jpg', 4),
('Túnel de Juego Plegable', 'Túnel resistente para gatos y perros pequeños. Fácil de guardar.', 35.00, 15, '/images/tunel-juego.jpg', 4),
('Rompecabezas de Tratamientos', 'Juego inteligente para estimular la mente de tu mascota.', 28.00, 18, '/images/rompecabezas.jpg', 4),

-- Comederos y Bebederos
('Comedero Cerámica Elevado', 'Comedero de cerámica de alta calidad con base elevada.', 24.00, 20, '/images/comedero-ceramica.jpg', 5),
('Bebedero Automático', 'Bebedero con recirculación de agua y filtro.', 55.00, 10, '/images/bebedero-automatico.jpg', 5),
('Set Comedero Bebedero Acero', 'Set de acero inoxidable con soporte ajustable.', 38.00, 15, '/images/set-acero.jpg', 5),
('Comedero Lento Antiahogo', 'Diseño especial para evitar que el perro coma demasiado rápido.', 16.00, 25, '/images/comedero-lento.jpg', 5),
('Dispensador Automático', 'Dispensador programable para comida seca. Capacidad 3kg.', 72.00, 8, '/images/dispensador-automatico.jpg', 5);
