import { useState, useCallback } from 'react';
import { useAdmin } from '@/context/admin/AdminContext';

interface DashboardStats {
  total_sellers: number;
  verified_sellers: number;
  pending_sellers: number;
  total_buyers: number;
  total_orders: number;
  total_crops: number;
  revenue_today: number;
  orders_today: number;
}

interface Business {
  id: string;
  business_name: string;
  business_description: string;
  verification_status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone_number: string;
    created_at: string;
  };
}

interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  created_at: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
  seller_profiles: {
    business_name: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useAdminDashboard = () => {
  const { sessionToken } = useAdmin();
  const [loading, setLoading] = useState(false);

  const makeRequest = useCallback(async (action: string, params: any = {}) => {
    if (!sessionToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('https://rimssqkcziuyflcergbv.supabase.co/functions/v1/admin-dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ action, ...params })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }, [sessionToken]);

  const getDashboardStats = useCallback(async (): Promise<DashboardStats> => {
    setLoading(true);
    try {
      const response = await makeRequest('getDashboardStats');
      return response.data;
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const getBusinesses = useCallback(async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ data: Business[]; pagination: Pagination }> => {
    setLoading(true);
    try {
      const response = await makeRequest('getBusinesses', params);
      return { data: response.data, pagination: response.pagination };
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const updateBusinessStatus = useCallback(async (
    sellerId: string, 
    status: string, 
    notes?: string
  ): Promise<void> => {
    setLoading(true);
    try {
      await makeRequest('updateBusinessStatus', { sellerId, status, notes });
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const getBusinessDetails = useCallback(async (sellerId: string) => {
    setLoading(true);
    try {
      const response = await makeRequest('getBusinessDetails', { sellerId });
      return response.data;
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const getUsers = useCallback(async (params: {
    page?: number;
    limit?: number;
    userType?: string;
    search?: string;
  } = {}): Promise<{ data: User[]; pagination: Pagination }> => {
    setLoading(true);
    try {
      const response = await makeRequest('getUsers', params);
      return { data: response.data, pagination: response.pagination };
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const getOrders = useCallback(async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ data: Order[]; pagination: Pagination }> => {
    setLoading(true);
    try {
      const response = await makeRequest('getOrders', params);
      return { data: response.data, pagination: response.pagination };
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const getSystemSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await makeRequest('getSystemSettings');
      return response.data;
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const updateSystemSettings = useCallback(async (settings: any[]) => {
    setLoading(true);
    try {
      await makeRequest('updateSystemSettings', { settings });
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  return {
    loading,
    getDashboardStats,
    getBusinesses,
    updateBusinessStatus,
    getBusinessDetails,
    getUsers,
    getOrders,
    getSystemSettings,
    updateSystemSettings,
  };
};