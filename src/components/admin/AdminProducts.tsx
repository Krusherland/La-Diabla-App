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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-burned font-bold text-fire-glow uppercase tracking-widest">
            GESTIÓN DE PRODUCTOS
          </h1>
          <p className="text-diabla-flameOrange font-burned mt-1">
            Administra tu arsenal de pizzas 🔥
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="admin-button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Producto
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card-animated p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-burned focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card-animated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-diabla-black border-b border-diabla-darkGray">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Imagen
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Nombre
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Categoría
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Precio
                </th>
                <th className="px-4 py-4 text-left text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Estado
                </th>
                <th className="px-4 py-4 text-right text-xs font-burned uppercase tracking-wider text-diabla-hotRed">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-diabla-darkGray">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-diabla-smokeGray font-rye">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className=""
                  >
                    <td className="px-4 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-diabla-darkGray"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-burned text-diabla-pepperYellow">{product.name}</div>
                        <div className="text-xs text-diabla-darkGray font-rye line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-diabla-black text-diabla-flameOrange rounded-full text-xs font-burned uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-burned text-diabla-pepperYellow text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-burned uppercase tracking-wider ${
                          product.available
                            ? 'bg-green-600 text-white'
                            : 'bg-diabla-smokeGray text-white'
                        }`}
                      >
                        {product.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-diabla-pepperYellow p-2"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(product)}
                          className="text-diabla-fireRed p-2"
                          title="Eliminar"
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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="admin-card-animated max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-diabla-charcoal p-6 border-b border-diabla-darkGray flex justify-between items-center">
              <h2 className="text-2xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider">
                {showEditModal ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <button
                onClick={handleCloseModals}
                className="text-diabla-smokeGray"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-burned text-diabla-hotRed uppercase tracking-wider mb-2">
                    Nombre
                  </label>
                  <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
                  placeholder="Pizza Diabla Infernal"
                />
              </div>

              <div>
                <label className="block text-sm font-burned text-diabla-hotRed uppercase tracking-wider mb-2">
                  Descripción
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50 resize-none"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-burned text-diabla-hotRed uppercase tracking-wider mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-burned text-diabla-hotRed uppercase tracking-wider mb-2">
                    Categoría
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-burned focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
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
                <label className="block text-sm font-burned text-diabla-hotRed uppercase tracking-wider mb-2">
                  URL de Imagen {showEditModal && <span className="text-diabla-smokeGray text-xs">(opcional)</span>}
                </label>
                <input
                  type="text"
                  required={!showEditModal}
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 bg-diabla-black border border-diabla-darkGray rounded-lg text-diabla-smokeGray font-rye focus:border-diabla-emberRed focus:outline-none focus:ring-2 focus:ring-diabla-emberRed/50"
                  placeholder={showEditModal ? "Dejar vacio para mantener imagen actual" : "/images/producto.jpg"}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 bg-diabla-black border-2 border-diabla-darkGray rounded focus:ring-2 focus:ring-diabla-emberRed/50"
                />
                <label htmlFor="available" className="text-sm font-burned text-diabla-hotRed uppercase tracking-wider cursor-pointer">
                  Producto disponible
                </label>
              </div>
              </div>

              <div className="bg-diabla-charcoal border-t border-diabla-darkGray p-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="flex-1 admin-button-outline justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 admin-button justify-center"
                >
                  {isSubmitting ? 'Guardando...' : showEditModal ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="admin-card-animated max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-diabla-fireRed rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-burned font-bold text-diabla-hotRed uppercase tracking-wider text-center mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-center text-diabla-smokeGray font-rye mb-6">
                ¿Estás seguro que deseas eliminar <span className="text-diabla-pepperYellow font-burned">{selectedProduct.name}</span>? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="flex-1 admin-button-outline justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 bg-diabla-fireRed text-white font-burned font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
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
