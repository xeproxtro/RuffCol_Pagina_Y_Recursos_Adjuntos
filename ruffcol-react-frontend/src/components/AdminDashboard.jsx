import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3000'

function AdminDashboard() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuth()

  // Formularios
  const [showProductoForm, setShowProductoForm] = useState(false)
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [editingProducto, setEditingProducto] = useState(null)
  const [editingCategoria, setEditingCategoria] = useState(null)

  const [productoForm, setProductoForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: ''
  })

  const [categoriaForm, setCategoriaForm] = useState({
    nombre: '',
    descripcion: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const [prodRes, catRes, pedRes] = await Promise.all([
        axios.get(`${API_URL}/api/productos`),
        axios.get(`${API_URL}/api/categorias`),
        axios.get(`${API_URL}/api/pedidos`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProductos(prodRes.data)
      setCategorias(catRes.data)
      setPedidos(pedRes.data)
      setError('')
    } catch (err) {
      setError('Error al cargar datos')
    }
    setLoading(false)
  }

  const mostrarMensaje = (msg, tipo = 'success') => {
    if (tipo === 'success') {
      setSuccess(msg)
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(msg)
      setTimeout(() => setError(''), 5000)
    }
  }

  // CRUD Categorías
  const guardarCategoria = async () => {
    try {
      const token = localStorage.getItem('token')
      if (editingCategoria) {
        await axios.put(`${API_URL}/api/categorias/${editingCategoria.id}`, categoriaForm, {
          headers: { Authorization: `Bearer ${token}` }
        })
        mostrarMensaje('Categoría actualizada')
      } else {
        await axios.post(`${API_URL}/api/categorias`, categoriaForm, {
          headers: { Authorization: `Bearer ${token}` }
        })
        mostrarMensaje('Categoría creada')
      }
      setShowCategoriaForm(false)
      setEditingCategoria(null)
      setCategoriaForm({ nombre: '', descripcion: '' })
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al guardar categoría', 'error')
    }
  }

  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mostrarMensaje('Categoría eliminada')
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al eliminar categoría', 'error')
    }
  }

  // CRUD Productos
  const guardarProducto = async () => {
    try {
      const token = localStorage.getItem('token')
      const data = {
        ...productoForm,
        precio: parseFloat(productoForm.precio),
        stock: parseInt(productoForm.stock),
        categoriaId: parseInt(productoForm.categoriaId)
      }
      if (editingProducto) {
        await axios.put(`${API_URL}/api/productos/${editingProducto.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
        mostrarMensaje('Producto actualizado')
      } else {
        await axios.post(`${API_URL}/api/productos`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
        mostrarMensaje('Producto creado')
      }
      setShowProductoForm(false)
      setEditingProducto(null)
      setProductoForm({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' })
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al guardar producto', 'error')
    }
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mostrarMensaje('Producto eliminado')
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al eliminar producto', 'error')
    }
  }

  // CRUD Pedidos
  const cambiarEstadoPedido = async (id, estado) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/api/pedidos/${id}/estado?estado=${estado}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mostrarMensaje('Estado actualizado')
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al actualizar estado', 'error')
    }
  }

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mostrarMensaje('Pedido eliminado')
      cargarDatos()
    } catch (err) {
      mostrarMensaje('Error al eliminar pedido', 'error')
    }
  }

  const estadoClase = (estado) => {
    const mapa = {
      'PENDIENTE': 'bg-warning text-dark',
      'EN_CONFECCION': 'bg-info text-dark',
      'ENVIADO': 'bg-primary',
      'ENTREGADO': 'bg-success'
    }
    return mapa[estado] || 'bg-secondary'
  }

  const estadoTexto = (estado) => {
    const mapa = {
      'PENDIENTE': 'Pendiente',
      'EN_CONFECCION': 'En Confección',
      'ENVIADO': 'Enviado',
      'ENTREGADO': 'Entregado'
    }
    return mapa[estado] || estado
  }

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h3 className="mb-0"><i className="bi bi-speedometer2"></i> Panel de Administrador</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Tabs defaultActiveKey="productos" className="mb-4">
            {/* Productos */}
            <Tab eventKey="productos" title="Productos">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Gestión de Productos</h4>
                <Button variant="success" onClick={() => {
                  setEditingProducto(null)
                  setProductoForm({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' })
                  setShowProductoForm(true)
                }}>
                  <i className="bi bi-plus-lg"></i> Nuevo Producto
                </Button>
              </div>

              {showProductoForm && (
                <Card className="bg-light mb-4">
                  <Card.Body>
                    <h5>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          value={productoForm.nombre}
                          onChange={(e) => setProductoForm({...productoForm, nombre: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Categoría *</Form.Label>
                        <Form.Select
                          value={productoForm.categoriaId}
                          onChange={(e) => setProductoForm({...productoForm, categoriaId: e.target.value})}
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={productoForm.descripcion}
                          onChange={(e) => setProductoForm({...productoForm, descripcion: e.target.value})}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio *</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={productoForm.precio}
                          onChange={(e) => setProductoForm({...productoForm, precio: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Stock *</Form.Label>
                        <Form.Control
                          type="number"
                          value={productoForm.stock}
                          onChange={(e) => setProductoForm({...productoForm, stock: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" onClick={guardarProducto}>Guardar</Button>
                      <Button variant="outline-secondary" className="ms-2" onClick={() => setShowProductoForm(false)}>Cancelar</Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>${Number(p.precio).toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>{p.categoria_nombre || ''}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => {
                          setEditingProducto(p)
                          setProductoForm({
                            nombre: p.nombre,
                            descripcion: p.descripcion || '',
                            precio: p.precio,
                            stock: p.stock,
                            categoriaId: p.id_categoria
                          })
                          setShowProductoForm(true)
                        }}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => eliminarProducto(p.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* Categorías */}
            <Tab eventKey="categorias" title="Categorías">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Gestión de Categorías</h4>
                <Button variant="success" onClick={() => {
                  setEditingCategoria(null)
                  setCategoriaForm({ nombre: '', descripcion: '' })
                  setShowCategoriaForm(true)
                }}>
                  <i className="bi bi-plus-lg"></i> Nueva Categoría
                </Button>
              </div>

              {showCategoriaForm && (
                <Card className="bg-light mb-4">
                  <Card.Body>
                    <h5>{editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          value={categoriaForm.nombre}
                          onChange={(e) => setCategoriaForm({...categoriaForm, nombre: e.target.value})}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={categoriaForm.descripcion}
                          onChange={(e) => setCategoriaForm({...categoriaForm, descripcion: e.target.value})}
                        />
                      </Form.Group>
                      <Button variant="primary" onClick={guardarCategoria}>Guardar</Button>
                      <Button variant="outline-secondary" className="ms-2" onClick={() => setShowCategoriaForm(false)}>Cancelar</Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td>{c.descripcion || ''}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => {
                          setEditingCategoria(c)
                          setCategoriaForm({ nombre: c.nombre, descripcion: c.descripcion || '' })
                          setShowCategoriaForm(true)
                        }}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => eliminarCategoria(c.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* Pedidos */}
            <Tab eventKey="pedidos" title="Pedidos">
              <h4 className="mb-3">Gestión de Pedidos</h4>
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleString('es-CO') : 'Sin fecha'}</td>
                      <td>{p.usuario_nombre || ''}</td>
                      <td>${Number(p.total).toFixed(2)}</td>
                      <td><span className={`badge ${estadoClase(p.estado)}`}>{estadoTexto(p.estado)}</span></td>
                      <td>
                        <Form.Select
                          size="sm"
                          style={{ width: 'auto', display: 'inline-block' }}
                          onChange={(e) => cambiarEstadoPedido(p.id, e.target.value)}
                          value={p.estado}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="EN_CONFECCION">En Confección</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="ENTREGADO">Entregado</option>
                        </Form.Select>
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => eliminarPedido(p.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AdminDashboard
