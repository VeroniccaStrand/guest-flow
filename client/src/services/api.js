// src/services/api.js

import axios from 'axios';

const api = axios.create({
 
  baseURL: '/api',
  withCredentials: true,
});

export { api };
