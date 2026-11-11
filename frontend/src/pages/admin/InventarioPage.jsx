import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  ShoppingCart,
  Tag
} from 'lucide-react';
import { inventarioAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function InventarioPage() {
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('productos');

  const [searchProductos, setSearchProductos] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterEstadoProducto, setFilterEstadoProducto] = useState('activo');
  const [searchCompras, setSearchCompras] = useState('');
  const [filterProductoCompras, setFilterProductoCompras] = useState('');

  const [showModalProducto, setShowModalProducto] = useState(false);
  const [showModalCompra, setShowModalCompra] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [editingCompra, setEditingCompra] = useState(null);
  const [editingCategoria, setEditingCategoria] = useState(null);

  const [formProducto, setFormProducto] = useState({
    nombre: '', categoria: '', unidadMedida: 'kg',
    stockActual: 0, stockMinimo: 10, precioUnitario: 0, descripcion: '', estado: 'activo'
  });

  const [formCompra, setFormCompra] = useState({
    productoId: '', cantidad: 0, precioUnitario: 0,
    fechaCompra: new Date().toISOString().split('T')[0],
    proveedor: '', numeroFactura: '', observaciones: ''
  });

  const [formCategoria, setFormCategoria] = useState({
    nombre: '', descripcion: '', estado: 'activo'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosData, comprasData, categoriasData] = await Promise.all([
        inventarioAPI.getAllProductos(),
        inventarioAPI.getAllCompras(),
        inventarioAPI.getAllCategorias()
      ]);
      setProductos(productosData);
      setCompras(comprasData);
      setCategorias(categoriasData);
      return productosData;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.info('Error al cargar los datos del inventario');
    } finally {
      setLoading(false);
    }
  };

  // ========== PRODUCTOS ==========

  const handleNuevoProducto = () => {
    setEditingProducto(null);
    setFormProducto({ nombre: '', categoria: categorias[0]?.nombre || '', unidadMedida: 'kg', stockActual: 0, stockMinimo: 10, precioUnitario: 0, descripcion: '', estado: 'activo' });
    setShowModalProducto(true);
  };

  const handleEditarProducto = (producto) => {
    setEditingProducto(producto);
    setFormProducto({
      nombre: producto.nombre, categoria: producto.categoria_rel?.nombre || '', categoriaId: producto.categoriaId || null, unidadMedida: producto.unidadMedida,
      stockActual: producto.stockActual, stockMinimo: producto.stockMinimo,
      precioUnitario: producto.precioUnitario || 0, descripcion: producto.descripcion || '', estado: producto.estado
    });
    setShowModalProducto(true);
  };
const handleGuardarProducto = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formProducto,
        stockActual: parseFloat(formProducto.stockActual),
        stockMinimo: parseFloat(formProducto.stockMinimo),
        precioUnitario: parseFloat(formProducto.precioUnitario)
      };
      if (editingProducto) {
        await inventarioAPI.updateProducto(editingProducto.id, dataToSend);
        toast.success('Producto actualizado correctamente');
        setShowModalProducto(false);
        setEditingProducto(null);
        await fetchData();
      } else {
        await inventarioAPI.createProducto(dataToSend);
        toast.success('Producto creado correctamente');
        setShowModalProducto(false);
        await fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleEliminarProducto = async (id, nombre) => {
    const confirmed = await toast.confirm(`¿Estás seguro de eliminar "${nombre}"?`);
    if (!confirmed) return;
    try {
      await inventarioAPI.deleteProducto(id);
      toast.success('Producto eliminado correctamente');
      setShowModalProducto(false);
      fetchData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  // ========== COMPRAS ==========

  const handleNuevaCompra = () => {
    setEditingCompra(null);
    setFormCompra({ productoId: '', cantidad: 0, precioUnitario: 0, fechaCompra: new Date().toISOString().split('T')[0], proveedor: '', numeroFactura: '', observaciones: '' });
    setShowModalCompra(true);
  };

  const handleEditarCompra = (compra) => {
    setEditingCompra(compra);
    setFormCompra({
      productoId: compra.productoId || compra.producto?.id || '',
      cantidad: compra.cantidad, precioUnitario: compra.precioUnitario,
      fechaCompra: compra.fechaCompra ? compra.fechaCompra.split('T')[0] : '',
      proveedor: compra.proveedor || '', numeroFactura: compra.numeroFactura || '', observaciones: compra.observaciones || ''
    });
    setShowModalCompra(true);
  };

 const handleGuardarCompra = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        productoId: parseInt(formCompra.productoId),
        cantidad: parseFloat(formCompra.cantidad),
        precioUnitario: parseFloat(formCompra.precioUnitario),
        fechaCompra: formCompra.fechaCompra,
        proveedor: formCompra.proveedor || undefined,
        numeroFactura: formCompra.numeroFactura || undefined,
        observaciones: formCompra.observaciones || undefined,
      };
      
      if (editingCompra) {
        await inventarioAPI.updateCompra(editingCompra.id, dataToSend);
        toast.success('Compra actualizada correctamente');
      } else {
        await inventarioAPI.createCompra(dataToSend);
        toast.success('Compra registrada y stock actualizado');
      }
      setShowModalCompra(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleEliminarCompra = async (id) => {
    const confirmed = await toast.confirm('¿Estás seguro de eliminar esta compra?');
    if (!confirmed) return;
    try {
      await inventarioAPI.deleteCompra(id);
      toast.success('Compra eliminada correctamente');
      setShowModalCompra(false);
      fetchData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  // ========== CATEGORIAS ==========

  const handleNuevaCategoria = () => {
    setEditingCategoria(null);
    setFormCategoria({ nombre: '', descripcion: '', estado: 'activo' });
    setShowModalCategoria(true);
  };

  const handleEditarCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setFormCategoria({ nombre: categoria.nombre, descripcion: categoria.descripcion || '', estado: categoria.estado });
    setShowModalCategoria(true);
  };

  const handleGuardarCategoria = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await inventarioAPI.updateCategoria(editingCategoria.id, formCategoria);
        toast.success('Categoría actualizada correctamente');
      } else {
        await inventarioAPI.createCategoria(formCategoria);
        toast.success('Categoría creada correctamente');
      }
      setShowModalCategoria(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleEliminarCategoria = async (id, nombre) => {
    const confirmed = await toast.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`);
    if (!confirmed) return;
    try {
      await inventarioAPI.deleteCategoria(id);
      toast.success('Categoría eliminada correctamente');
      setShowModalCategoria(false);
      fetchData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  // ========== HELPERS ==========

  const getProductoNombre = (compra) => {
    if (compra.producto) return compra.producto.nombre;
    const producto = productos.find(p => p.id === compra.productoId);
    return producto ? producto.nombre : 'N/A';
  };

  const getStockColor = (producto) => {
    if (Number(producto.stockActual) <= 0) return { color: '#ef4444', bg: '#fee2e2', text: 'Sin stock' };
    if (Number(producto.stockActual) <= Number(producto.stockMinimo)) return { color: '#f59e0b', bg: '#fef3c7', text: 'Bajo stock' };
    return { color: '#10b981', bg: '#d1fae5', text: 'OK' };
  };

  const getCategoriaColor = (nombre) => {
    const colores = [
      { color: '#8b5cf6', bg: '#ede9fe' },
      { color: '#3b82f6', bg: '#dbeafe' },
      { color: '#f59e0b', bg: '#fef3c7' },
      { color: '#10b981', bg: '#d1fae5' },
      { color: '#ef4444', bg: '#fee2e2' },
      { color: '#6366f1', bg: '#e0e7ff' },
    ];
    const idx = nombre ? nombre.charCodeAt(0) % colores.length : 0;
    return colores[idx];
  };

  const productosFiltrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchProductos.toLowerCase());
   const matchCategoria = !filterCategoria || p.categoriaId === parseInt(filterCategoria);
    const matchEstado = !filterEstadoProducto || p.estado === filterEstadoProducto;
    return matchSearch && matchCategoria && matchEstado;
  });

  const comprasFiltradas = compras.filter(c => {
    const nombre = getProductoNombre(c).toLowerCase();
    const matchSearch = nombre.includes(searchCompras.toLowerCase()) ||
      (c.proveedor && c.proveedor.toLowerCase().includes(searchCompras.toLowerCase()));
    const matchProducto = !filterProductoCompras || c.productoId === parseInt(filterProductoCompras) || c.producto?.id === parseInt(filterProductoCompras);
    return matchSearch && matchProducto;
  });

  const stats = {
    totalProductos: productos.filter(p => p.estado === 'activo').length,
    bajoStock: productos.filter(p => p.estado === 'activo' && Number(p.stockActual) <= Number(p.stockMinimo)).length,
    totalCategorias: categorias.length
  };

  const getBtnNuevo = () => {
    if (activeTab === 'productos') return { fn: handleNuevoProducto, label: 'Nuevo Producto' };
    if (activeTab === 'compras') return { fn: handleNuevaCompra, label: 'Nueva Compra' };
    return { fn: handleNuevaCategoria, label: 'Nueva Categoría' };
  };

  const btnNuevo = getBtnNuevo();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid #e5e7eb', borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Inventario</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Gestiona productos, compras y categorías</p>
        </div>
        <button onClick={btnNuevo.fn}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.4)', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <Plus size={20} />{btnNuevo.label}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: Package, iconColor: '#3b82f6', bg: '#dbeafe', label: 'Productos Activos', value: stats.totalProductos },
          { icon: AlertTriangle, iconColor: '#f59e0b', bg: '#fef3c7', label: 'Bajo Stock', value: stats.bajoStock },
          { icon: Tag, iconColor: '#8b5cf6', bg: '#ede9fe', label: 'Categorías', value: stats.totalCategorias }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} color={stat.iconColor} />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {[
          { key: 'productos', icon: <Package size={18} />, label: 'Productos' },
          { key: 'compras', icon: <ShoppingCart size={18} />, label: 'Compras' },
          { key: 'categorias', icon: <Tag size={18} />, label: 'Categorías' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ flex: 1, padding: '16px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', backgroundColor: activeTab === tab.key ? '#ef4444' : 'white', color: activeTab === tab.key ? 'white' : '#6b7280', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Productos */}
      {activeTab === 'productos' && (
        <>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 200px', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Buscar producto..." value={searchProductos} onChange={(e) => setSearchProductos(e.target.value)}
                  style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} />
              </div>
              <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} style={selectStyle}>
               <option value="">Todas las categorías</option>
                 {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <select value={filterEstadoProducto} onChange={(e) => setFilterEstadoProducto(e.target.value)} style={selectStyle}>
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {productosFiltrados.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                <Package size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay productos</p>
                <p style={{ fontSize: '14px' }}>{searchProductos || filterCategoria ? 'No se encontraron resultados' : 'Agrega tu primer producto'}</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={headerStyle}>Producto</th>
                    <th style={headerStyle}>Categoría</th>
                    <th style={headerStyle}>Stock Actual</th>
                    <th style={headerStyle}>Stock Mínimo</th>
                    <th style={headerStyle}>Precio Unit.</th>
                    <th style={headerStyle}>Estado Stock</th>
                    <th style={headerStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map(producto => {
                    const stockInfo = getStockColor(producto);
                    const catColor = getCategoriaColor(producto.categoria_rel?.nombre || '');
                    return (
                      <tr key={producto.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={cellStyle}>
                          <div>
                            <p style={{ fontWeight: 'bold', color: '#111827' }}>{producto.nombre}</p>
                            {producto.descripcion && <p style={{ fontSize: '12px', color: '#6b7280' }}>{producto.descripcion.substring(0, 40)}{producto.descripcion.length > 40 ? '...' : ''}</p>}
                          </div>
                        </td>
                        <td style={cellStyle}>
                        <span style={{ padding: '4px 12px', backgroundColor: catColor.bg, color: catColor.color, borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{producto.categoria_rel?.nombre || 'Sin categoría'}</span>
                        </td>
                        <td style={cellStyle}>
                          <span style={{ fontWeight: 'bold', color: '#111827' }}>{Number(producto.stockActual).toFixed(2)} <span style={{ fontWeight: 'normal', color: '#6b7280', fontSize: '13px' }}>{producto.unidadMedida}</span></span>
                        </td>
                        <td style={cellStyle}>
                          <span style={{ color: '#6b7280' }}>{Number(producto.stockMinimo).toFixed(2)} {producto.unidadMedida}</span>
                        </td>
                        <td style={cellStyle}>
                          <span style={{ fontWeight: 'bold', color: '#10b981' }}>${Number(producto.precioUnitario || 0).toFixed(2)}</span>
                        </td>
                        <td style={cellStyle}>
                          <span style={{ padding: '4px 12px', backgroundColor: stockInfo.bg, color: stockInfo.color, borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{stockInfo.text}</span>
                        </td>
                        <td style={cellStyle}>
                          <button onClick={() => handleEditarProducto(producto)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                            <Edit2 size={16} color="#3b82f6" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Tab Compras */}
      {activeTab === 'compras' && (
        <>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Buscar por producto o proveedor..." value={searchCompras} onChange={(e) => setSearchCompras(e.target.value)}
                  style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} />
              </div>
              <select value={filterProductoCompras} onChange={(e) => setFilterProductoCompras(e.target.value)} style={selectStyle}>
                <option value="">Todos los productos</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {comprasFiltradas.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                <ShoppingCart size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay compras</p>
                <p style={{ fontSize: '14px' }}>{searchCompras || filterProductoCompras ? 'No se encontraron resultados' : 'Registra tu primera compra'}</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={headerStyle}>Fecha</th>
                    <th style={headerStyle}>Producto</th>
                    <th style={headerStyle}>Cantidad</th>
                    <th style={headerStyle}>Precio Unit.</th>
                    <th style={headerStyle}>Precio Total</th>
                    <th style={headerStyle}>Proveedor</th>
                    <th style={headerStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasFiltradas.map(compra => {
                    const producto = productos.find(p => p.id === (compra.productoId || compra.producto?.id));
                    const unidad = producto ? producto.unidadMedida : '';
                    return (
                      <tr key={compra.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={cellStyle}><span style={{ color: '#374151', fontWeight: '500' }}>{new Date(compra.fechaCompra).toLocaleDateString('es-AR')}</span></td>
                        <td style={cellStyle}><span style={{ fontWeight: 'bold', color: '#111827' }}>{getProductoNombre(compra)}</span></td>
                        <td style={cellStyle}><span style={{ fontWeight: '500' }}>{Number(compra.cantidad).toFixed(2)} <span style={{ color: '#6b7280', fontSize: '13px' }}>{unidad}</span></span></td>
                        <td style={cellStyle}><span style={{ color: '#6b7280' }}>${Number(compra.precioUnitario).toFixed(2)}</span></td>
                        <td style={cellStyle}><span style={{ fontWeight: 'bold', color: '#10b981' }}>${Number(compra.precioTotal).toFixed(2)}</span></td>
                        <td style={cellStyle}><span style={{ color: '#6b7280' }}>{compra.proveedor || <span style={{ color: '#9ca3af' }}>Sin proveedor</span>}</span></td>
                        <td style={cellStyle}>
                          <button onClick={() => handleEditarCompra(compra)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                            <Edit2 size={16} color="#3b82f6" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Tab Categorías */}
      {activeTab === 'categorias' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {categorias.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
              <Tag size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay categorías</p>
              <p style={{ fontSize: '14px' }}>Crea tu primera categoría de productos</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={headerStyle}>Nombre</th>
                  <th style={headerStyle}>Descripción</th>
                  <th style={headerStyle}>Productos</th>
                  <th style={headerStyle}>Estado</th>
                  <th style={headerStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(categoria => {
                  const catColor = getCategoriaColor(categoria.nombre);
                  const cantProductos = productos.filter(p => p.categoriaId === categoria.id).length;
                  return (
                    <tr key={categoria.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                      <td style={cellStyle}>
                        <span style={{ padding: '4px 12px', backgroundColor: catColor.bg, color: catColor.color, borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
                          {categoria.nombre}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>{categoria.descripcion || <span style={{ color: '#9ca3af' }}>Sin descripción</span>}</span>
                      </td>
                      <td style={cellStyle}>
                        <span style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>
                          {cantProductos} producto{cantProductos !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        <span style={{ padding: '4px 12px', backgroundColor: categoria.estado === 'activo' ? '#d1fae5' : '#fee2e2', color: categoria.estado === 'activo' ? '#059669' : '#dc2626', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                          {categoria.estado === 'activo' ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        <button onClick={() => handleEditarCategoria(categoria)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                          <Edit2 size={16} color="#3b82f6" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Producto */}
      {showModalProducto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Datos del producto de inventario</p>
              </div>
              <button onClick={() => setShowModalProducto(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleGuardarProducto} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input type="text" required value={formProducto.nombre} onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })} style={inputStyle} placeholder="Ej: Polvo ABC" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Categoría *</label>
                   <select required value={formProducto.categoriaId || ''} onChange={(e) => {
                    const cat = categorias.find(c => c.id === parseInt(e.target.value));
                    setFormProducto({ ...formProducto, categoriaId: parseInt(e.target.value), categoria: cat?.nombre || '' });
                    }} style={inputStyle}>
                    <option value="">Seleccionar categoría...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Unidad de Medida *</label>
                    <select required value={formProducto.unidadMedida} onChange={(e) => setFormProducto({ ...formProducto, unidadMedida: e.target.value })} style={inputStyle}>
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="unidad">Unidades</option>
                      <option value="litro">Litros</option>
                      <option value="metro">Metros</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Stock Actual</label>
                    <input type="number" step="0.01" min="0" value={formProducto.stockActual} onChange={(e) => setFormProducto({ ...formProducto, stockActual: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Mínimo</label>
                    <input type="number" step="0.01" min="0" value={formProducto.stockMinimo} onChange={(e) => setFormProducto({ ...formProducto, stockMinimo: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio Unitario ($)</label>
                    <input type="number" step="0.01" min="0" value={formProducto.precioUnitario} onChange={(e) => setFormProducto({ ...formProducto, precioUnitario: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Descripción</label>
                  <textarea value={formProducto.descripcion} onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Descripción del producto" />
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <select value={formProducto.estado} onChange={(e) => setFormProducto({ ...formProducto, estado: e.target.value })} style={inputStyle}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                {editingProducto ? (
                  <button type="button" onClick={() => handleEliminarProducto(editingProducto.id, editingProducto.nombre)}
                    style={{ padding: '12px 24px', backgroundColor: '#fee2e2', border: '2px solid #ef4444', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={16} />Eliminar
                  </button>
                ) : <div />}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowModalProducto(false)} style={btnCancel}>Cancelar</button>
                  <button type="submit" style={btnSubmit}>{editingProducto ? 'Actualizar Producto' : 'Crear Producto'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Compra */}
      {showModalCompra && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{editingCompra ? 'Editar Compra' : 'Nueva Compra'}</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>{editingCompra ? 'Modifica los datos' : 'Se actualizará el stock automáticamente'}</p>
              </div>
              <button onClick={() => setShowModalCompra(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleGuardarCompra} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Producto *</label>
                  <select required value={formCompra.productoId} onChange={(e) => {
                    const producto = productos.find(p => p.id === parseInt(e.target.value));
                    setFormCompra({ ...formCompra, productoId: e.target.value, precioUnitario: producto?.precioUnitario || 0 });
                  }} style={inputStyle}>
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => (<option key={p.id} value={p.id}>{p.nombre} ({p.unidadMedida}) - Stock: {Number(p.stockActual).toFixed(2)}</option>))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Cantidad *</label>
                    <input type="number" step="0.01" min="0.01" required value={formCompra.cantidad} onChange={(e) => setFormCompra({ ...formCompra, cantidad: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio Unitario ($) *</label>
                    <input type="number" step="0.01" min="0" required value={formCompra.precioUnitario} onChange={(e) => setFormCompra({ ...formCompra, precioUnitario: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Precio Total ($)</label>
                    <input type="number" step="0.01" value={(parseFloat(formCompra.cantidad) * parseFloat(formCompra.precioUnitario) || 0).toFixed(2)} readOnly style={{ ...inputStyle, backgroundColor: '#f3f4f6' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Fecha de Compra *</label>
                    <input type="date" required value={formCompra.fechaCompra} onChange={(e) => setFormCompra({ ...formCompra, fechaCompra: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Proveedor</label>
                    <input type="text" value={formCompra.proveedor} onChange={(e) => setFormCompra({ ...formCompra, proveedor: e.target.value })} style={inputStyle} placeholder="Nombre del proveedor" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>N° Factura</label>
                  <input type="text" value={formCompra.numeroFactura} onChange={(e) => setFormCompra({ ...formCompra, numeroFactura: e.target.value })} style={inputStyle} placeholder="Número de factura" />
                </div>
                <div>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea value={formCompra.observaciones} onChange={(e) => setFormCompra({ ...formCompra, observaciones: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Notas adicionales" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                {editingCompra ? (
                  <button type="button" onClick={() => handleEliminarCompra(editingCompra.id)}
                    style={{ padding: '12px 24px', backgroundColor: '#fee2e2', border: '2px solid #ef4444', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={16} />Eliminar
                  </button>
                ) : <div />}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowModalCompra(false)} style={btnCancel}>Cancelar</button>
                  <button type="submit" style={btnSubmit}>{editingCompra ? 'Actualizar Compra' : 'Registrar Compra'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {showModalCategoria && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Datos de la categoría</p>
              </div>
              <button onClick={() => setShowModalCategoria(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleGuardarCategoria} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input type="text" required value={formCategoria.nombre} onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })} style={inputStyle} placeholder="Ej: Matafuegos, Repuestos" />
                </div>
                <div>
                  <label style={labelStyle}>Descripción</label>
                  <textarea value={formCategoria.descripcion} onChange={(e) => setFormCategoria({ ...formCategoria, descripcion: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Descripción de la categoría" />
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <select value={formCategoria.estado} onChange={(e) => setFormCategoria({ ...formCategoria, estado: e.target.value })} style={inputStyle}>
                    <option value="activo">Activa</option>
                    <option value="inactivo">Inactiva</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                {editingCategoria ? (
                  <button type="button" onClick={() => handleEliminarCategoria(editingCategoria.id, editingCategoria.nombre)}
                    style={{ padding: '12px 24px', backgroundColor: '#fee2e2', border: '2px solid #ef4444', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={16} />Eliminar
                  </button>
                ) : <div />}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowModalCategoria(false)} style={btnCancel}>Cancelar</button>
                  <button type="submit" style={btnSubmit}>{editingCategoria ? 'Actualizar' : 'Crear'} Categoría</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease' };
const selectStyle = { padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', width: '100%' };
const btnCancel = { padding: '12px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#6b7280' };
const btnSubmit = { padding: '12px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' };

export default InventarioPage;