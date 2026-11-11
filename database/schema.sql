-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: matafuegos_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_nombre_categoria` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `cuit` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productoId` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `precioTotal` decimal(10,2) NOT NULL,
  `fechaCompra` date NOT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `numeroFactura` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_fe776b37e33079c880756b95184` (`productoId`),
  CONSTRAINT `FK_fe776b37e33079c880756b95184` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comprobantes`
--

DROP TABLE IF EXISTS `comprobantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `clienteNombre` varchar(255) NOT NULL,
  `clienteDni` varchar(255) DEFAULT NULL,
  `clienteDireccion` varchar(255) DEFAULT NULL,
  `clienteTelefono` varchar(255) DEFAULT NULL,
  `items` json NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `observaciones` text,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clienteId` int DEFAULT NULL,
  `ventaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1dcd7f2ccd6aa63987a8eab6a0` (`numero`),
  KEY `FK_57150157e5a5d9a428ec3c9c7a4` (`clienteId`),
  KEY `FK_61027023b4ea3940aadee8392c7` (`ventaId`),
  CONSTRAINT `FK_57150157e5a5d9a428ec3c9c7a4` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`),
  CONSTRAINT `FK_61027023b4ea3940aadee8392c7` FOREIGN KEY (`ventaId`) REFERENCES `ventas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `extintores`
--

DROP TABLE IF EXISTS `extintores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extintores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numeroEquipo` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `capacidad` decimal(5,2) NOT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `fechaUltimaRecarga` date DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `clienteId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_7a4c692c7644dad0432bd1237ab` (`clienteId`),
  CONSTRAINT `FK_7a4c692c7644dad0432bd1237ab` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logs_actividad`
--

DROP TABLE IF EXISTS `logs_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_actividad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `modulo` varchar(50) NOT NULL,
  `descripcion` text,
  `ip` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_1de9669a8336c0cb5f618cedd04` (`usuarioId`),
  CONSTRAINT `FK_1de9669a8336c0cb5f618cedd04` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `unidadMedida` varchar(255) NOT NULL,
  `stockActual` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stockMinimo` decimal(10,2) NOT NULL DEFAULT '10.00',
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  `descripcion` text,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoriaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_829134a4f7cf07f2132c2e3607` (`nombre`),
  KEY `FK_productos_categorias` (`categoriaId`),
  CONSTRAINT `FK_productos_categorias` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recargas`
--

DROP TABLE IF EXISTS `recargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recargas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `extintorId` int NOT NULL,
  `clienteId` int NOT NULL,
  `fechaRecarga` date NOT NULL,
  `fechaProximaRecarga` date DEFAULT NULL,
  `polvoKg` decimal(10,2) NOT NULL DEFAULT '0.00',
  `manometros` int NOT NULL DEFAULT '0',
  `vastagos` int NOT NULL DEFAULT '0',
  `valvulas` int NOT NULL DEFAULT '0',
  `orings` int NOT NULL DEFAULT '0',
  `mangueras` int NOT NULL DEFAULT '0',
  `boquillas` int NOT NULL DEFAULT '0',
  `seguros` int NOT NULL DEFAULT '0',
  `etiquetas` int NOT NULL DEFAULT '0',
  `precioTotal` decimal(10,2) NOT NULL,
  `observaciones` text,
  `estado` varchar(255) NOT NULL DEFAULT 'completada',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `precioManoObra` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioPolvo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioManometros` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioVastagos` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioValvulas` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioOrings` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioMangueras` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioBoquillas` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioSeguros` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precioEtiquetas` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `FK_4d7ba6b214a68778351e94e86ed` (`extintorId`),
  KEY `FK_6deb6022a801e96fe4a66ec2c5a` (`clienteId`),
  CONSTRAINT `FK_4d7ba6b214a68778351e94e86ed` FOREIGN KEY (`extintorId`) REFERENCES `extintores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_6deb6022a801e96fe4a66ec2c5a` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recursos_educativos`
--

DROP TABLE IF EXISTS `recursos_educativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos_educativos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `tipoFuego` varchar(255) DEFAULT NULL,
  `tipoExtintor` varchar(255) DEFAULT NULL,
  `capacidad` varchar(255) DEFAULT NULL,
  `aplicacion` varchar(255) DEFAULT NULL,
  `contenidoDetallado` text NOT NULL,
  `imagenUrl` varchar(255) DEFAULT NULL,
  `archivoPdfUrl` varchar(255) DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '0',
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e8ac36bed970f75a0fd9c40aaf6` (`usuarioId`),
  CONSTRAINT `FK_e8ac36bed970f75a0fd9c40aaf6` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `testimonios`
--

DROP TABLE IF EXISTS `testimonios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `company` varchar(100) DEFAULT NULL,
  `text` text NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isVisible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimoLogin` timestamp NULL DEFAULT NULL,
  `rol` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9f78cfde576fc28f279e2b7a9c` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clienteId` int NOT NULL,
  `productoId` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `precioTotal` decimal(10,2) NOT NULL,
  `numeroEquipo` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `vendedorId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_771620ab33741414f8248217fc3` (`clienteId`),
  KEY `FK_4f3f1cad7a86addd550db04732c` (`productoId`),
  KEY `FK_5374eca53d7349dc60995ee9c10` (`vendedorId`),
  CONSTRAINT `FK_4f3f1cad7a86addd550db04732c` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`),
  CONSTRAINT `FK_5374eca53d7349dc60995ee9c10` FOREIGN KEY (`vendedorId`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FK_771620ab33741414f8248217fc3` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `after_venta_insert` AFTER INSERT ON `ventas` FOR EACH ROW INSERT INTO logs_actividad (usuarioId, accion, modulo, descripcion, createdAt)

VALUES (

    NEW.vendedorId,

    'VENTA_REGISTRADA',

    'ventas',

    JSON_OBJECT(

        'ventaId', NEW.id,

        'clienteId', NEW.clienteId,

        'productoId', NEW.productoId,

        'total', NEW.precioTotal

    ),

    NOW()

) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping routines for database 'matafuegos_db'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_calcular_proximo_vencimiento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE  FUNCTION `fn_calcular_proximo_vencimiento`(

    p_fecha_recarga DATE

) RETURNS date
    DETERMINISTIC
RETURN DATE_ADD(p_fecha_recarga, INTERVAL 1 YEAR) ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_actualizar_stock` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_actualizar_stock`(

    IN p_productoId INT,

    IN p_cantidad DECIMAL(10,2),

    IN p_tipo_movimiento VARCHAR(10)

)
BEGIN

    IF p_tipo_movimiento = 'entrada' THEN

        UPDATE productos

        SET stockActual = stockActual + p_cantidad

        WHERE id = p_productoId;

    ELSE

        UPDATE productos

        SET stockActual = stockActual - p_cantidad

        WHERE id = p_productoId;

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-06 10:11:06
