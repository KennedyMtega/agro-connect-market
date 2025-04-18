
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, BuyerProfile, SellerProfile, AuthState } from "@/types";
import { getMockUserByEmail, createMockUser, createMockBuyerProfile, createMockSellerProfile } from "@/utils/authUtils";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, otp: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, userType: "buyer" | "seller") => Promise<void>;
  registerWithPhone: (phoneNumber: string, fullName: string, userType: "buyer" | "seller") => Promise<void>;
  verifyPhone: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updateBuyerProfile: (buyerData: Partial<BuyerProfile>) => Promise<void>;
  updateSellerProfile: (sellerData: Partial<SellerProfile>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  buyerProfile: null,
  sellerProfile: null,
  isLoading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  loginWithPhone: async () => {},
  register: async () => {},
  registerWithPhone: async () => {},
  verifyPhone: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  updateBuyerProfile: async () => {},
  updateSellerProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const mockUser = localStorage.getItem("agrouser");
        
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          userData.createdAt = new Date(userData.createdAt);
          
          if (userData.userType === "buyer") {
            setState({
              ...state,
              user: userData,
              buyerProfile: createMockBuyerProfile(userData.id),
              isLoading: false,
            });
          } else if (userData.userType === "seller") {
            setState({
              ...state,
              user: userData,
              sellerProfile: createMockSellerProfile(userData.id),
              isLoading: false,
            });
          } else {
            setState({
              ...state,
              user: userData,
              isLoading: false,
            });
          }
        } else {
          setState({
            ...state,
            isLoading: false,
          });
        }
      } catch (error) {
        setState({
          ...state,
          error: "Authentication error",
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const mockUser = getMockUserByEmail(email, password) || 
        createMockUser(email, "Demo User", "buyer");

      localStorage.setItem("agrouser", JSON.stringify(mockUser));

      if (mockUser.userType === "buyer") {
        setState({
          ...state,
          user: mockUser,
          buyerProfile: createMockBuyerProfile(mockUser.id),
          isLoading: false,
        });
      } else if (mockUser.userType === "seller") {
        setState({
          ...state,
          user: mockUser,
          sellerProfile: createMockSellerProfile(mockUser.id),
          isLoading: false,
        });
      } else {
        setState({
          ...state,
          user: mockUser,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: "Login failed",
        isLoading: false,
      });
    }
  };

  const loginWithPhone = async (phoneNumber: string, otp: string) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const mockUser = createMockUser("", "Demo User", "buyer", "phone", phoneNumber);
      mockUser.isPhoneVerified = true;

      localStorage.setItem("agrouser", JSON.stringify(mockUser));

      setState({
        ...state,
        user: mockUser,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        error: "Phone login failed",
        isLoading: false,
      });
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    userType: "buyer" | "seller"
  ) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const mockUser = createMockUser(email, fullName, userType);
      localStorage.setItem("agrouser", JSON.stringify(mockUser));

      setState({
        ...state,
        user: mockUser,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        error: "Registration failed",
        isLoading: false,
      });
    }
  };

  const registerWithPhone = async (
    phoneNumber: string,
    fullName: string,
    userType: "buyer" | "seller"
  ) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      const mockUser = createMockUser("", fullName, userType, "phone", phoneNumber);
      localStorage.setItem("agrouser", JSON.stringify(mockUser));

      setState({
        ...state,
        user: mockUser,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        error: "Phone registration failed",
        isLoading: false,
      });
    }
  };

  const verifyPhone = async (phoneNumber: string, otp: string) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      if (state.user) {
        const updatedUser = {
          ...state.user,
          isPhoneVerified: true,
        };

        localStorage.setItem("agrouser", JSON.stringify(updatedUser));

        setState({
          ...state,
          user: updatedUser,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: "Phone verification failed",
        isLoading: false,
      });
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true, error: null });

    try {
      localStorage.removeItem("agrouser");
      setState({
        ...initialState,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        error: "Logout failed",
        isLoading: false,
      });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...userData,
        };

        localStorage.setItem("agrouser", JSON.stringify(updatedUser));

        setState({
          ...state,
          user: updatedUser,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: "Profile update failed",
        isLoading: false,
      });
    }
  };

  const updateBuyerProfile = async (buyerData: Partial<BuyerProfile>) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      if (state.buyerProfile) {
        const updatedBuyerProfile = {
          ...state.buyerProfile,
          ...buyerData,
        };

        setState({
          ...state,
          buyerProfile: updatedBuyerProfile,
          isLoading: false,
        });
      } else {
        const newBuyerProfile: BuyerProfile = {
          id: `buyer-${state.user?.id || 'new'}`,
          userId: state.user?.id || 'new',
          deliveryPreferences: {},
          paymentMethods: {},
          notificationPreferences: {},
          ...buyerData,
        };

        setState({
          ...state,
          buyerProfile: newBuyerProfile,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: "Buyer profile update failed",
        isLoading: false,
      });
    }
  };

  const updateSellerProfile = async (sellerData: Partial<SellerProfile>) => {
    setState({ ...state, isLoading: true, error: null });

    try {
      if (state.sellerProfile) {
        const updatedSellerProfile = {
          ...state.sellerProfile,
          ...sellerData,
        };

        setState({
          ...state,
          sellerProfile: updatedSellerProfile,
          isLoading: false,
        });
      } else {
        const newSellerProfile: SellerProfile = {
          id: `seller-${state.user?.id || 'new'}`,
          userId: state.user?.id || 'new',
          businessName: '',
          verificationStatus: 'pending',
          averageRating: 0,
          totalRatings: 0,
          ...sellerData,
        };

        setState({
          ...state,
          sellerProfile: newSellerProfile,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: "Seller profile update failed",
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithPhone,
        register,
        registerWithPhone,
        verifyPhone,
        logout,
        updateProfile,
        updateBuyerProfile,
        updateSellerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
