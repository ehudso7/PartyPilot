import axios from 'axios';

import { config } from './config';

export const http = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000
});
