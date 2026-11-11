import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/database/entities/producto.entity';
import { Compra } from 'src/database/entities/compra.entity';
import { Categoria } from 'src/database/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Compra)
    private comprasRepository: Repository<Compra>,
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  // ========== PRODUCTOS ==========

  async createProducto(createProductoDto: CreateProductoDto) {
    const productoExistente = await this.productosRepository.findOne({
      where: { nombre: createProductoDto.nombre },
    });

    if (productoExistente) {
      throw new ConflictException('Ya existe un producto con ese nombre');
    }

    const nuevoProducto = this.productosRepository.create(createProductoDto);
    const productoGuardado = await this.productosRepository.save(nuevoProducto);

    return {
      mensaje: 'Producto creado exitosamente',
      producto: productoGuardado,
    };
  }

 async findAllProductos() {
    const productos = await this.productosRepository.find({
      relations: ['categoria_rel'],
      order: { nombre: 'ASC' },
    });

    return {
      total: productos.length,
      productos,
    };
  }

  async findProductosBajoStock() {
    const productos = await this.productosRepository
      .createQueryBuilder('producto')
      .where('producto.stockActual <= producto.stockMinimo')
      .andWhere('producto.estado = :estado', { estado: 'activo' })
      .orderBy('producto.stockActual', 'ASC')
      .getMany();

    return {
      total: productos.length,
      productos,
    };
  }

  async findProductosByCategoria(categoriaId: number) {
    const productos = await this.productosRepository.find({
      where: { categoriaId },
      relations: ['categoria_rel'],
      order: { nombre: 'ASC' },
    });

    return {
      categoriaId,
      total: productos.length,
      productos,
    };
  }

  async findOneProducto(id: number) {
    const producto = await this.productosRepository.findOne({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async updateProducto(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productosRepository.findOne({ 
      where: { id },
      relations: ['categoria_rel']
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (updateProductoDto.nombre && updateProductoDto.nombre !== producto.nombre) {
      const productoConNombre = await this.productosRepository.findOne({
        where: { nombre: updateProductoDto.nombre },
      });
      if (productoConNombre) {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }
    }

    await this.productosRepository.update(id, {
      nombre: updateProductoDto.nombre ?? producto.nombre,
      categoriaId: updateProductoDto.categoriaId ?? producto.categoriaId,
      unidadMedida: updateProductoDto.unidadMedida ?? producto.unidadMedida,
      stockActual: updateProductoDto.stockActual ?? producto.stockActual,
      stockMinimo: updateProductoDto.stockMinimo ?? producto.stockMinimo,
      precioUnitario: updateProductoDto.precioUnitario ?? producto.precioUnitario,
      descripcion: updateProductoDto.descripcion ?? producto.descripcion,
      estado: updateProductoDto.estado ?? producto.estado,
    });

    const productoActualizado = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria_rel'],
    });

    return {
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado,
    };
  }

   async removeProducto(id: number) {
    const producto = await this.findOneProducto(id);
    await this.productosRepository.remove(producto);

    return {
      mensaje: 'Producto eliminado exitosamente',
      id,
    };
  }
  // ========== COMPRAS ==========

  async createCompra(createCompraDto: CreateCompraDto) {
    const producto = await this.findOneProducto(createCompraDto.productoId);

    const fechaInicio = new Date(createCompraDto.fechaCompra);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(createCompraDto.fechaCompra);
    fechaFin.setHours(23, 59, 59, 999);

    const compraExistente = await this.comprasRepository
      .createQueryBuilder('compra')
      .where('compra.productoId = :productoId', { productoId: createCompraDto.productoId })
      .andWhere('compra.fechaCompra >= :fechaInicio', { fechaInicio })
      .andWhere('compra.fechaCompra <= :fechaFin', { fechaFin })
      .getOne();

    if (compraExistente) {
      const nuevaCantidad = Number(compraExistente.cantidad) + Number(createCompraDto.cantidad);
      const nuevoPrecioTotal = Number(compraExistente.precioTotal) + (Number(createCompraDto.cantidad) * Number(createCompraDto.precioUnitario));

      compraExistente.cantidad = nuevaCantidad;
      compraExistente.precioTotal = nuevoPrecioTotal;

      const compraActualizada = await this.comprasRepository.save(compraExistente);

      producto.stockActual = Number(producto.stockActual) + Number(createCompraDto.cantidad);
      producto.precioUnitario = createCompraDto.precioUnitario;
      await this.productosRepository.save(producto);

      return {
        mensaje: 'Compra acumulada exitosamente. Stock actualizado.',
        compra: compraActualizada,
        nuevoStock: producto.stockActual,
        acumulada: true
      };
    }

    const precioTotal = createCompraDto.cantidad * createCompraDto.precioUnitario;
    const nuevaCompra = this.comprasRepository.create({ ...createCompraDto, precioTotal });
    const compraGuardada = await this.comprasRepository.save(nuevaCompra);

    producto.stockActual = Number(producto.stockActual) + Number(createCompraDto.cantidad);
    producto.precioUnitario = createCompraDto.precioUnitario;
    await this.productosRepository.save(producto);

    return {
      mensaje: 'Compra registrada exitosamente. Stock actualizado.',
      compra: compraGuardada,
      nuevoStock: producto.stockActual,
      acumulada: false
    };
  }

  async findAllCompras() {
    const compras = await this.comprasRepository.find({
      relations: ['producto'],
      order: { fechaCompra: 'DESC' },
    });

    return {
      total: compras.length,
      compras,
    };
  }

  async findComprasByProducto(productoId: number) {
    const producto = await this.findOneProducto(productoId);

    const compras = await this.comprasRepository.find({
      where: { productoId },
      order: { fechaCompra: 'DESC' },
    });

    return {
      producto: { id: producto.id, nombre: producto.nombre },
      total: compras.length,
      compras,
    };
  }

  async findOneCompra(id: number) {
    const compra = await this.comprasRepository.findOne({
      where: { id },
      relations: ['producto'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return compra;
  }

  async updateCompra(id: number, updateCompraDto: UpdateCompraDto) {
    const compra = await this.findOneCompra(id);

    if (updateCompraDto.productoId) {
      await this.findOneProducto(updateCompraDto.productoId);
    }

    if (updateCompraDto.cantidad || updateCompraDto.precioUnitario) {
      const cantidad = updateCompraDto.cantidad || compra.cantidad;
      const precioUnitario = updateCompraDto.precioUnitario || compra.precioUnitario;
      updateCompraDto['precioTotal'] = Number(cantidad) * Number(precioUnitario);
    }

    Object.assign(compra, updateCompraDto);
    const compraActualizada = await this.comprasRepository.save(compra);

    return {
      mensaje: 'Compra actualizada exitosamente',
      compra: compraActualizada,
    };
  }

  async removeCompra(id: number) {
    const compra = await this.findOneCompra(id);
    await this.comprasRepository.remove(compra);

    return {
      mensaje: 'Compra eliminada exitosamente',
      id,
    };
  }

  // ========== CATEGORIAS ==========

  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    const existe = await this.categoriasRepository.findOne({
      where: { nombre: createCategoriaDto.nombre },
    });

    if (existe) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    const nueva = this.categoriasRepository.create(createCategoriaDto);
    const guardada = await this.categoriasRepository.save(nueva);

    return {
      mensaje: 'Categoría creada exitosamente',
      categoria: guardada,
    };
  }

  async findAllCategorias() {
    const categorias = await this.categoriasRepository.find({
      where: { estado: 'activo' },
      order: { nombre: 'ASC' },
    });

    return {
      total: categorias.length,
      categorias,
    };
  }

  async findOneCategoria(id: number) {
    const categoria = await this.categoriasRepository.findOne({ where: { id } });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOneCategoria(id);

   if (updateCategoriaDto.nombre && 
    updateCategoriaDto.nombre.toLowerCase() !== categoria.nombre.toLowerCase()) {
  const existe = await this.categoriasRepository.findOne({
    where: { nombre: updateCategoriaDto.nombre },
  });

  if (existe) {
    throw new ConflictException('Ya existe una categoría con ese nombre');
  }
}

    Object.assign(categoria, updateCategoriaDto);
    const actualizada = await this.categoriasRepository.save(categoria);

    return {
      mensaje: 'Categoría actualizada exitosamente',
      categoria: actualizada,
    };
  }

  async removeCategoria(id: number) {
    const categoria = await this.findOneCategoria(id);
    await this.categoriasRepository.remove(categoria);

    return {
      mensaje: 'Categoría eliminada exitosamente',
      id,
    };
  }

  // ========== ESTADÍSTICAS ==========

  async getStats() {
    const totalProductos = await this.productosRepository.count({ where: { estado: 'activo' } });

    const productosStockBajo = await this.productosRepository
      .createQueryBuilder('producto')
      .where('producto.stockActual <= producto.stockMinimo')
      .andWhere('producto.estado = :estado', { estado: 'activo' })
      .getCount();

    const totalCompras = await this.comprasRepository.count();

    const compras = await this.comprasRepository.find();
    const valorTotalInventario = compras.reduce(
      (sum, compra) => sum + Number(compra.precioTotal), 0,
    );

    return {
      totalProductos,
      productosStockBajo,
      totalCompras,
      valorTotalInventario: valorTotalInventario.toFixed(2),
    };
  }
}