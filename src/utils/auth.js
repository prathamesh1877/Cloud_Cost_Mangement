// Authentication utilities

import { storage, STORAGE_KEYS } from './storage';

// Simulate JWT token generation
export const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// Decode JWT token
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return false;
  
  const decoded = decodeToken(token);
  return decoded !== null;
};

// Get current user from storage
export const getCurrentUser = () => {
  return storage.get(STORAGE_KEYS.USER_DATA);
};

// Login user
export const login = (email, password, users) => {
  // Find user in users array
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Generate token
  const token = generateToken(user);
  
  // Store token and user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  storage.set(STORAGE_KEYS.USER_DATA, userWithoutPassword);
  
  return { success: true, user: userWithoutPassword, token };
};

// Register new user
export const register = (userData, users) => {
  // Check if email already exists
  const existingUser = users.find(u => u.email === userData.email);
  
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    ...userData,
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
    avatar: null
  };

  // Generate token
  const token = generateToken(newUser);
  
  // Store token and user data (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  storage.set(STORAGE_KEYS.USER_DATA, userWithoutPassword);
  
  return { success: true, user: userWithoutPassword, token, newUser };
};

// Logout user
export const logout = () => {
  storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  storage.remove(STORAGE_KEYS.USER_DATA);
};

// Check user role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const roleHierarchy = { admin: 3, manager: 2, user: 1 };
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Update user profile
export const updateUserProfile = (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'Not authenticated' };
  
  const updatedUser = { ...currentUser, ...updates };
  storage.set(STORAGE_KEYS.USER_DATA, updatedUser);
  
  return { success: true, user: updatedUser };
};
