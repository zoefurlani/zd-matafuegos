# ZD Matafuegos · Sistema de gestión

Aplicación web para gestionar el servicio de recarga, venta y mantenimiento de matafuegos: un **sitio público informativo** y un **panel administrativo** con roles, inventario, recargas y comprobantes en PDF.

▶️ **Demo en video:** https://youtu.be/eprA3ROnAEA

> Todos los datos de la demo son ficticios.

## Funcionalidades

**Sitio público**
- Servicios, mantenimiento, manual de uso y ubicación
- Guía técnica con búsqueda, filtros y exportación (PDF, Excel, CSV, Word)
- Testimonios con calificación, modo claro/oscuro, diseño responsive

**Panel administrativo**
- Login con JWT y roles (`super_admin` / `admin`)
- Dashboard con métricas, tendencias y alertas de vencimientos y stock bajo
- Clientes, extintores, recargas y ventas
- Inventario con categorías dinámicas y compras que actualizan el stock
- Recargas con descuento automático de insumos y cálculo de totales
- Comprobantes en PDF con numeración correlativa
- Gestión de usuarios y registro de actividad (auditoría)

## Stack

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Lucide |
| Backend | NestJS 11, TypeScript, TypeORM, Passport, JWT, bcrypt |
| Base de datos | MySQL 8 (FKs, trigger, función y procedimiento almacenado) |
| Otros | PDFKit, Swagger, class-validator |

## Cómo correrlo

**Requisitos:** Node.js 20+ y MySQL 8.

1. **Base de datos** (con tu cliente MySQL):
   ```sql
   CREATE DATABASE matafuegos_demo CHARACTER SET utf8mb4;
   ```
   Ejecutá `database/schema.sql` y luego `database/seed.sql` sobre esa base.

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # completá tus datos y un JWT_SECRET largo
   npm run start:dev
   ```
   API en `http://localhost:3000/api` · Swagger en `http://localhost:3000/docs`

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Ingresá a `/login` con el usuario de ejemplo:
   - **Email:** `demo@ejemplo.com`
   - **Contraseña:** `Demo1234!`


## Notas técnicas

- Las recargas descuentan insumos por ID de producto (`PRODUCTO_IDS` en `recargas.service.ts`); el `seed.sql` respeta esos IDs.
- Documentación de la API disponible con Swagger.

## Autora

**Zoe Furlani** · Técnica Universitaria en Programación (UTN FRRq)
