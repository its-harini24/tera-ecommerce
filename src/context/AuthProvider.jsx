import { useState, useCallback } from 'react';
import { AuthContext, DEMO_CUSTOMER, STORAGE_KEY } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.name || parsed.name.includes('Alex') || parsed.name.includes('Raj') || parsed.email?.includes('alex') || parsed.email?.includes('kavin.raj')) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
          return DEMO_CUSTOMER;
        }
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
      return DEMO_CUSTOMER;
    } catch {
      return DEMO_CUSTOMER;
    }
  });
  const [loading] = useState(false);

  const login = useCallback(async ({ email, password: _password, rememberMe = true }) => {
    void _password;
    await new Promise((resolve) => setTimeout(resolve, 500));

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

  const signup = useCallback(async ({ name, email, password: _password }) => {
    void _password;
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

  const resetPassword = useCallback(async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `Password reset instructions sent to ${email}` };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetDemoUser = useCallback(() => {
    setUser(DEMO_CUSTOMER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
  }, []);

  const updateAvatar = useCallback((genderOrUrl) => {
    const isFemale =
      genderOrUrl === 'female' ||
      (typeof genderOrUrl === 'string' && genderOrUrl.toLowerCase().includes('female'));
    const newAvatar = isFemale ? '/avatar-female.svg' : '/avatar-male.svg';
    const newGender = isFemale ? 'female' : 'male';

    setUser((prev) => {
      const base = prev || DEMO_CUSTOMER;
      const updated = {
        ...base,
        avatar: newAvatar,
        avatarGender: newGender,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save avatar to localStorage', err);
      }
      return updated;
    });

    return { success: true, avatar: newAvatar, gender: newGender };
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
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
