// api.js
import axios from 'axios';

const apiUrl = 'http://localhost:8080'; // Backend URL

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchRepositories = async (query, language) => {
  try {
    const response = await api.get('/api/repositories', {
      params: { query, language },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const searchUsers = async (username) => {
  try {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// export const fetchTrendingRepositories = async (language) => {
//     try {
//       const response = await api.get('/api/trending/repositories', {
//         params: { language },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching trending repositories:', error);
//       throw error;
//     }
//   };
