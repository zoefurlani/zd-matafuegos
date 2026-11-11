SET NAMES utf8mb4;

INSERT INTO usuarios (id, username, password, email, rol, estado) VALUES
(1, 'demo', '$2b$10$gwQsdcXPb7QBYzhEy13L3OwZNqq6qgpI5M56DWY4kTCDK4Aniv9D6', 'demo@ejemplo.com', 'super_admin', 'activo');

INSERT INTO categorias (id, nombre, descripcion, estado) VALUES
(1, 'matafuegos', 'Extintores nuevos', 'activo'),
(2, 'repuesto', 'Repuestos para recargas', 'activo'),
(3, 'polvo', 'Polvo químico', 'activo');

INSERT INTO productos (id, nombre, unidadMedida, stockActual, stockMinimo, precioUnitario, descripcion, estado, categoriaId) VALUES
(1, 'Polvo Químico ABC', 'kg', 100.00, 10.00, 3000.00, 'Polvo químico seco ABC', 'activo', 3),
(2, 'Manómetro 14x35', 'unidad', 25.00, 10.00, 2400.00, 'Manómetro para extintores ABC', 'activo', 2),
(4, 'Oring', 'unidad', 40.00, 10.00, 1000.00, 'Junta de goma', 'activo', 2),
(6, 'Vástago', 'unidad', 30.00, 10.00, 150.00, 'Vástago para válvula', 'activo', 2),
(7, 'Válvula', 'unidad', 27.00, 10.00, 5000.00, 'Válvula de seguridad', 'activo', 2),
(8, 'Manguera', 'unidad', 14.00, 5.00, 450.00, 'Manguera para extintor', 'activo', 2),
(9, 'Boquilla', 'unidad', 26.00, 10.00, 2000.00, 'Boquilla difusora', 'activo', 2),
(10, 'Seguro', 'unidad', 49.00, 15.00, 50.00, 'Seguro de activación', 'activo', 2),
(11, 'Etiqueta', 'unidad', 84.00, 20.00, 100.00, 'Etiqueta de recarga', 'activo', 2),
(12, 'Extintor ABC 5kg', 'unidad', 6.00, 5.00, 85000.00, 'Extintor portátil ABC de 5kg', 'activo', 1),
(13, 'Extintor ABC 10kg', 'unidad', 3.00, 5.00, 98000.00, 'Extintor portátil ABC de 10kg', 'activo', 1);

INSERT INTO clientes (id, nombre, cuit, telefono, email, direccion, observaciones) VALUES
(1, 'Panadería La Espiga', '30-00000001-1', '0000-000001', 'laespiga@ejemplo.com', 'Calle Ejemplo 100', 'Cliente de ejemplo'),
(2, 'Taller Mecánico Norte', '30-00000002-2', '0000-000002', 'tallernorte@ejemplo.com', 'Calle Ejemplo 200', 'Cliente de ejemplo'),
(3, 'María Gómez', '27-00000003-3', '0000-000003', 'maria@ejemplo.com', 'Calle Ejemplo 300', NULL);

INSERT INTO extintores (id, numeroEquipo, tipo, capacidad, marca, fechaUltimaRecarga, fechaVencimiento, estado, clienteId) VALUES
(1, 'DEMO-001', 'ABC', 5.00, 'Marca Demo', '2026-09-01', '2027-09-01', 'activo', 1),
(2, 'DEMO-002', 'ABC', 10.00, 'Marca Demo', '2025-10-15', '2026-10-15', 'activo', 2),
(3, 'DEMO-003', 'CO2', 5.00, 'Marca Demo', '2026-10-20', '2027-10-20', 'activo', 3);

INSERT INTO recargas (id, extintorId, clienteId, fechaRecarga, fechaProximaRecarga, polvoKg, manometros, orings, etiquetas, precioTotal, observaciones, estado, precioManoObra, precioPolvo, precioManometros, precioOrings) VALUES
(1, 1, 1, '2026-09-01', '2027-09-01', 5.00, 1, 1, 1, 22400.00, 'Recarga completa (ejemplo)', 'completada', 4000.00, 15000.00, 2400.00, 1000.00),
(2, 3, 3, '2026-10-20', '2027-10-20', 5.00, 0, 1, 1, 20000.00, 'Recarga (ejemplo)', 'completada', 4000.00, 15000.00, 0.00, 1000.00);

INSERT INTO ventas (id, clienteId, productoId, cantidad, precioUnitario, precioTotal, numeroEquipo, observaciones, vendedorId) VALUES
(1, 2, 12, 1, 85000.00, 85000.00, 'DEMO-004', 'Venta de ejemplo', 1);

INSERT INTO comprobantes (id, numero, fecha, clienteNombre, clienteDni, clienteDireccion, clienteTelefono, items, total, observaciones, estado, clienteId, ventaId) VALUES
(1, 'COMP-00001', '2026-09-01', 'Panadería La Espiga', '30-00000001-1', 'Calle Ejemplo 100', '0000-000001',
 '[{"tipo":"recarga","descripcion":"Recarga extintor ABC 5kg","cantidad":1,"precioUnitario":22400}]',
 22400.00, 'Comprobante de ejemplo', 'activo', 1, NULL);

INSERT INTO testimonios (id, name, userEmail, company, text, rating, isVisible) VALUES
(1, 'Cliente Ejemplo', 'cliente1@ejemplo.com', 'Panadería La Espiga', 'Excelente atención y muy puntuales.', 5, 1),
(2, 'Otro Cliente', 'cliente2@ejemplo.com', 'Taller Norte', 'Servicio rápido y confiable.', 4, 1);

INSERT INTO recursos_educativos (id, titulo, descripcion, categoria, tipoFuego, tipoExtintor, capacidad, aplicacion, contenidoDetallado, orden, estado, usuarioId) VALUES
(1, 'Fuego clase A', 'Combustibles sólidos comunes', 'tipo_fuego', 'A', 'ABC', NULL, 'Hogar', 'Contenido de ejemplo sobre fuegos clase A: madera, papel, telas.', 1, 'activo', 1),
(2, 'Extintor ABC', 'Polvo químico multipropósito', 'tipo_extintor', NULL, 'ABC', '5 kg', 'Comercio', 'Contenido de ejemplo sobre extintores ABC.', 2, 'activo', 1);