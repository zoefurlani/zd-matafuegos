import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@ApiTags('inventario')
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('productos')
  @HttpCode(HttpStatus.CREATED)
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.inventarioService.createProducto(createProductoDto);
  }

  @Get('productos')
  findAllProductos() {
    return this.inventarioService.findAllProductos();
  }

  @Get('productos/bajo-stock')
  findProductosBajoStock() {
    return this.inventarioService.findProductosBajoStock();
  }

  @Get('productos/categoria/:categoriaId')
findProductosByCategoria(@Param('categoriaId', ParseIntPipe) categoriaId: number) {
    return this.inventarioService.findProductosByCategoria(categoriaId);
  }

  @Get('productos/:id')
  findOneProducto(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOneProducto(id);
  }

  @Patch('productos/:id')
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.inventarioService.updateProducto(id, updateProductoDto);
  }

  @Delete('productos/:id')
  removeProducto(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.removeProducto(id);
  }

  @Post('compras')
  @HttpCode(HttpStatus.CREATED)
  createCompra(@Body() createCompraDto: CreateCompraDto) {
    return this.inventarioService.createCompra(createCompraDto);
  }

  @Get('compras')
  findAllCompras() {
    return this.inventarioService.findAllCompras();
  }

  @Get('compras/producto/:productoId')
  findComprasByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.inventarioService.findComprasByProducto(productoId);
  }

  @Get('compras/:id')
  findOneCompra(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOneCompra(id);
  }

  @Patch('compras/:id')
  updateCompra(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompraDto: UpdateCompraDto,
  ) {
    return this.inventarioService.updateCompra(id, updateCompraDto);
  }

  @Delete('compras/:id')
  removeCompra(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.removeCompra(id);
  }

  @Post('categorias')
  @HttpCode(HttpStatus.CREATED)
  createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.inventarioService.createCategoria(createCategoriaDto);
  }

  @Get('categorias')
  findAllCategorias() {
    return this.inventarioService.findAllCategorias();
  }

  @Get('categorias/:id')
  findOneCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOneCategoria(id);
  }

  @Patch('categorias/:id')
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.inventarioService.updateCategoria(id, updateCategoriaDto);
  }

  @Delete('categorias/:id')
  removeCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.removeCategoria(id);
  }

  @Get('stats')
  getStats() {
    return this.inventarioService.getStats();
  }
}
