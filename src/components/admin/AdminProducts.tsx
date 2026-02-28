import { useState, useMemo } from 'react';
import { useProducts } from '../../hooks';
import { Loading, ErrorMessage } from '../common';
import { productService } from '../../services';
import type { Product } from '../../types';

const AdminProducts = () => {
  const { products, categories, loading, error, refetch } = useProducts();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, filterCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0]?.name || '',
      image: '',
      available: true,
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: '', // Leave empty so user can optionally update it
      available: product.available,
    });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find the category ID from the category name
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      if (!selectedCategory) {
        alert('Por favor selecciona una categoria valida');
        setIsSubmitting(false);
        return;
      }

      // Transform frontend data to backend format
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: selectedCategory.id, // Backend expects category_id
        is_active: formData.available, // Backend expects is_active
      };

      // Only include image if provided
      // For updates, skip the image field if empty (keeps existing image)
      if (formData.image && formData.image.trim() !== '') {
        // For new products or when changing the image path
        if (showAddModal || !formData.image.includes('products/')) {
          productData.image = formData.image;
        }
      }

      console.log('Sending product data:', productData);

      if (showEditModal && selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      await refetch();
      handleCloseModals();
    } catch (err: any) {
      console.error('Error saving product:', err);
      console.error('Error response details:', JSON.stringify(err.response?.data, null, 2));
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      const errors = err.response?.data?.errors;
      
      let fullErrorMessage = `Error al guardar el producto: ${errorMessage}`;
      
      // If there are validation errors, show them
      if (errors) {
        const errorDetails = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        fullErrorMessage += `\n\nDetalles:\n${errorDetails}`;
      }
      
      console.error('Full error message:', fullErrorMessage);
      alert(fullErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      await productService.deleteProduct(selectedProduct.id);
      await refetch();
      handleCloseModals();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto. Función de placeholder - implementar en producción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando productos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-diabla-darkGray pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-rye font-bold text-gray-100 uppercase tracking-wider">
            Gestión de Productos
          </h1>
          <p className="text-gray-400 font-rye text-sm mt-1">
            Administra el catálogo de productos
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-diabla-emberRed hover:bg-diabla-fireRed text-white border border-diabla-emberRed hover:border-diabla-fireRed rounded-lg font-rye text-sm uppercase tracking-wider transition-all hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray p-5 rounded-lg border border-diabla-darkGray">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 text-sm text-gray-500 font-rye">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray rounded-lg border border-diabla-darkGray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-diabla-black/50 border-b-2 border-diabla-darkGray">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Imagen
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Producto
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Categoría
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Precio
                </th>
                <th className="px-4 py-4 text-left text-xs font-rye uppercase tracking-wider text-gray-400">
                  Estado
                </th>
                <th className="px-4 py-4 text-right text-xs font-rye uppercase tracking-wider text-gray-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-diabla-darkGray/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 font-rye">No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-diabla-black/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-diabla-darkGray shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm max-w-xs">
                        <div className="font-rye text-white mb-1">{product.name}</div>
                        <div className="text-xs text-gray-500 font-rye line-clamp-2">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-md text-xs font-rye">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-rye text-white text-base">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-rye border ${
                          product.available
                            ? 'bg-green-500/10 text-green-500 border-green-500/30'
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/30'
                        }`}
                      >
                        {product.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                          title="Editar producto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(product)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Eliminar producto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray border border-diabla-darkGray rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="bg-diabla-black/50 p-6 border-b border-diabla-darkGray flex justify-between items-center">
              <h2 className="text-xl font-rye font-bold text-gray-100 uppercase tracking-wider">
                {showEditModal ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-rye text-gray-300 uppercase tracking-wider mb-2">
                    Nombre del Producto
                  </label>
                  <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
                  placeholder="Ej: Pizza Diabla Suprema"
                />
              </div>

              <div>
                <label className="block text-sm font-rye text-gray-300 uppercase tracking-wider mb-2">
                  Descripción
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 resize-none transition-colors"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-rye text-gray-300 uppercase tracking-wider mb-2">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-rye text-gray-300 uppercase tracking-wider mb-2">
                    Categoría
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-rye text-gray-300 uppercase tracking-wider mb-2">
                  URL de Imagen {showEditModal && <span className="text-gray-500 text-xs normal-case">(dejar vacío para mantener actual)</span>}
                </label>
                <input
                  type="text"
                  required={!showEditModal}
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-diabla-black border border-diabla-darkGray rounded-lg text-gray-300 font-rye text-sm focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/30 transition-colors"
                  placeholder="/images/producto.jpg"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-diabla-black/50 rounded-lg border border-diabla-darkGray">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 bg-diabla-black border-2 border-diabla-darkGray rounded focus:ring-2 focus:ring-diabla-emberRed/50 text-diabla-emberRed"
                />
                <label htmlFor="available" className="text-sm font-rye text-gray-300 cursor-pointer">
                  Producto disponible para la venta
                </label>
              </div>
              </div>

              <div className="bg-diabla-black/50 border-t border-diabla-darkGray p-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-2.5 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg font-rye text-sm uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-2.5 bg-diabla-emberRed hover:bg-diabla-fireRed text-white border border-diabla-emberRed hover:border-diabla-fireRed rounded-lg font-rye text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : showEditModal ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-diabla-charcoal to-diabla-darkGray border border-diabla-darkGray rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-rye font-bold text-gray-100 uppercase tracking-wider text-center mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-center text-gray-400 font-rye mb-6">
                ¿Estás seguro que deseas eliminar <span className="text-white font-rye">{selectedProduct.name}</span>? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-2.5 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg font-rye text-sm uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700 rounded-lg font-rye text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
