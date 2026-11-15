import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'tera_auth_user';

// Realistic Indian Demo Customer Profile
export const DEMO_CUSTOMER = {
  id: 'usr_kavin_demo',
  name: 'Kavin',
  email: 'kavin@example.com',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu, India',
  city: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
  currency: 'INR (₹)',
  avatar: '/avatar-kavin.svg',
  role: 'customer',
  memberSince: 'August 2026',
  createdAt: '2026-08-15T10:30:00.000Z',
  ordersCount: 3,
  savedAddressesCount: 1,
  address: {
    fullName: 'Kavin',
    addressLine: 'Flat 4B, Kaveri Tech Enclave, 2nd Main Road',
    area: 'Anna Nagar West',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: true,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage or default to Kavin demo profile
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored user was previous placeholder data or included Raj, update to Kavin
        if (!parsed.name || parsed.name.includes('Alex') || parsed.name.includes('Raj') || parsed.email?.includes('alex') || parsed.email?.includes('kavin.raj')) {
          setUser(DEMO_CUSTOMER);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
        } else {
          setUser(parsed);
        }
      } else {
        // Pre-populate with Kavin demo profile
        setUser(DEMO_CUSTOMER);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
      }
    } catch (e) {
      console.warn('Failed to parse stored auth user', e);
      setUser(DEMO_CUSTOMER);
    } finally {
      setLoading(false);
    }
  }, []);

  // Frontend login placeholder (Backend team will connect Supabase auth here)
  const login = useCallback(async ({ email, password, rememberMe = true }) => {
    // Simulated frontend delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Match or create demo customer
    const isKavin = !email || email.toLowerCase().includes('kavin') || email.toLowerCase().includes('demo');
    const loggedUser = isKavin
      ? { ...DEMO_CUSTOMER, email: email || DEMO_CUSTOMER.email }
      : {
          id: 'usr_' + Date.now().toString(36),
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          phone: '+91 98765 43210',
          location: 'Chennai, Tamil Nadu, India',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          currency: 'INR (₹)',
          avatar: '/avatar-kavin.svg',
          role: 'customer',
          memberSince: 'November 2026',
          createdAt: new Date().toISOString(),
          ordersCount: 1,
          savedAddressesCount: 1,
          address: DEMO_CUSTOMER.address,
        };

    setUser(loggedUser);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    }
    return { success: true, user: loggedUser };
  }, []);

  // Frontend signup placeholder (Backend team will connect Supabase signUp here)
  const signup = useCallback(async ({ name, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      email: email.trim(),
      name: name.trim() || 'Kavin',
      phone: '+91 98765 43210',
      location: 'Chennai, Tamil Nadu, India',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      currency: 'INR (₹)',
      avatar: '/avatar-kavin.svg',
      role: 'customer',
      memberSince: 'November 2026',
      createdAt: new Date().toISOString(),
      ordersCount: 0,
      savedAddressesCount: 1,
      address: {
        fullName: name.trim() || 'Kavin',
        addressLine: 'Flat 4B, Kaveri Tech Enclave, 2nd Main Road',
        area: 'Anna Nagar West',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
        country: 'India',
        phone: '+91 98765 43210',
        isDefault: true,
      },
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }, []);

  // Frontend Google Sign-In placeholder (Backend team will connect Supabase signInWithOAuth here)
  const loginWithGoogle = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const googleUser = {
      ...DEMO_CUSTOMER,
      id: 'usr_g_kavin',
    };

    setUser(googleUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
    return { success: true, user: googleUser };
  }, []);

  // Frontend Forgot Password placeholder
  const resetPassword = useCallback(async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `Password reset instructions sent to ${email}` };
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Reset to default demo customer (for testing/demo purposes)
  const resetDemoUser = useCallback(() => {
    setUser(DEMO_CUSTOMER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    loginWithGoogle,
    resetPassword,
    logout,
    resetDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
