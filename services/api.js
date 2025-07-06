import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://simple-api-ngvw.onrender.com',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const PostFetchMultiform = async (url, params) => {
  try {
    const response = await api.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log({
      msg: "Error in PostFetchMultiform --> " + url,
      error,
      params
    });
    throw error;
  }
}

export const registerUser = (data) => api.post('/users', data);
export const loginUser = (data) => api.post('/login', data);
export const getUsers = (params) => api.get('/users', { params });
export const getPosts = (params) => api.get('/posts', { params });
export const createPost = async (postData) => {
  return await PostFetchMultiform("/posts", postData);
}
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const getMyPosts = () => api.get('/my-posts');

export default api;