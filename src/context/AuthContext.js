import { createContext, useContext } from 'react';

export const STORAGE_KEY = 'tera_auth_user';

export const AVATAR_OPTIONS = {
  male: {
    id: 'male',
    label: 'Male',
    url: '/avatar-male.svg',
  },
  female: {
    id: 'female',
    label: 'Female',
    url: '/avatar-female.svg',
  },
};

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
  avatar: '/avatar-male.svg',
  avatarGender: 'male',
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

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
