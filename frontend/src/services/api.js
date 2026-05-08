import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending/receiving cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handler
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Log to console for debugging
    console.error('API Error:', message);

    // If it's a 500 server error or network error, alert the user
    if (!error.response || error.response.status >= 500) {
      alert(`Server Error: ${message}`);
    }

    // Pass the error down to the component
    return Promise.reject(error);
  }
);

export default api;
