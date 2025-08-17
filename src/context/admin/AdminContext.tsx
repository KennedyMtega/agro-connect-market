import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  sessionToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const storedToken = localStorage.getItem('admin_session_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (storedToken && storedUser) {
      setSessionToken(storedToken);
      setAdminUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://rimssqkcziuyflcergbv.supabase.co/functions/v1/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        setAdminUser(data.admin);
        setSessionToken(data.sessionToken);
        localStorage.setItem('admin_session_token', data.sessionToken);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    setSessionToken(null);
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_user');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!adminUser || !sessionToken) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch('https://rimssqkcziuyflcergbv.supabase.co/functions/v1/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'changePassword',
          adminId: adminUser.id,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed' };
    }
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      sessionToken,
      isLoading,
      login,
      logout,
      changePassword
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};