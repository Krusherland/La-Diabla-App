import apiClient from './api';
import type { Product, Category, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<any>('/products');
    // Backend returns { status: 'success', products: [...] }
    if (response.data.status === 'success' && response.data.products) {
      // Map backend products to frontend format with local images
      return response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category?.name || '',
        image: product.image ? `${API_BASE_URL}/storage/${product.image}` : '',
        available: product.is_active,
      }));
    }
    return [];
  },

  // Get paginated products
  getProducts: async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products?page=${page}&limit=${limit}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch products');
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<any>(`/products/${id}`);
    // Backend returns { status: 'success', product: {...} }
    if (response.data.status === 'success' && response.data.product) {
      const product = response.data.product;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category?.name || '',
        image: product.image ? `${API_BASE_URL}/storage/${product.image}` : '',
        available: product.is_active,
      };
    }
    throw new Error('Product not found');
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/category/${category}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  },

  // Create new product (admin)
  createProduct: async (productData: any): Promise<Product> => {
    const response = await apiClient.post<any>('/admin/products', productData);
    // Backend returns { status: 'success', product: {...} }
    if (response.data.status === 'success' && response.data.product) {
      const product = response.data.product;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category?.name || '',
        image: product.image ? `${API_BASE_URL}/storage/${product.image}` : '',
        available: product.is_active,
      };
    }
    throw new Error(response.data.message || 'Failed to create product');
  },

  // Update product (admin)
  updateProduct: async (id: number, productData: any): Promise<Product> => {
    console.log(`Updating product ${id} with data:`, JSON.stringify(productData, null, 2));
    
    try {
      const response = await apiClient.put<any>(
        `/admin/products/${id}`,
        productData
      );
      
      console.log('Update response:', JSON.stringify(response.data, null, 2));
      
      // Backend returns { status: 'success', product: {...} }
      if (response.data.status === 'success' && response.data.product) {
        const product = response.data.product;
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          category: product.category?.name || '',
          image: product.image ? `${API_BASE_URL}/storage/${product.image}` : '',
          available: product.is_active,
        };
      }
      throw new Error(response.data.message || 'Failed to update product');
    } catch (error: any) {
      console.error('Update product error details:', JSON.stringify(error.response?.data, null, 2));
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      throw error;
    }
  },

  // Delete product (admin)
  deleteProduct: async (id: number): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete product');
    }
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<any>('/categories');
    // Backend returns { status: 'success', categories: [...] }
    if (response.data.status === 'success' && response.data.categories) {
      return response.data.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
      }));
    }
    return [];
  },
};
