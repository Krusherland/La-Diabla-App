import apiClient from './api';
import type { ContactFormData, Location, ApiResponse } from '../types';

export const contactService = {
  // Submit contact form
  submitContactForm: async (data: ContactFormData): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>('/contact', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send message');
    }
  },

  // Get all locations
  getLocations: async (): Promise<Location[]> => {
    const response = await apiClient.get<ApiResponse<Location[]>>('/locations');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  },
};
