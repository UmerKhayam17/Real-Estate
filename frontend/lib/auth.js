// lib/auth.js
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getUserRole = () => {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role) return payload.role;
    }
    
    const user = getUser();
    return user?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};