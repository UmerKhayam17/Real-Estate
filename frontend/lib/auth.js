// lib/auth.js
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
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

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Decode the token to get user role
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("the payload is ", payload)
    return payload.role || 'user';
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};