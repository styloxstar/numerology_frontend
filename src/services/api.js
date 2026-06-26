export const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const generateGuestChart = async (profileName, dateOfBirth) => {
  const response = await fetch(`${API_URL}/charts/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileName, dateOfBirth }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to generate chart');
  return data.chartData;
};

export const getCharts = async (token) => {
  const response = await fetch(`${API_URL}/charts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch charts');
  return data;
};

export const createChart = async (token, profileName, dateOfBirth) => {
  const response = await fetch(`${API_URL}/charts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profileName, dateOfBirth }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to save chart');
  return data;
};

export const deleteChart = async (token, id) => {
  const response = await fetch(`${API_URL}/charts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete chart');
  }
};
