// Configuration for environment variables
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  production: import.meta.env.PROD || false,
};

export default config; 