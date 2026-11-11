import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @ManyToOne(() => Categoria, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoriaId' })
  categoria_rel?: Categoria;

  @Column({ nullable: true })
  categoriaId?: number;

  @Column()
  unidadMedida!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  stockActual!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 10 })
  stockMinimo!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioUnitario?: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ default: 'activo' })
  estado!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}