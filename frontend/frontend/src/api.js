import axios from 'axios';
import { setLoader } from './services/loaderStore';
const auditApi = axios.create({
  baseURL : process.env.REACT_APP_API_URL,
});

auditApi.interceptors.request.use(
  (config) => {
    setLoader(true);
    return config;
  },
  (error) => {
    setLoader(false);
    return Promise.reject(error);
  }
);

auditApi.interceptors.response.use(
  (response) => {
    setLoader(false);
    return response;
  },
  (error) => {
    setLoader(false);
    return Promise.reject(error);
  }
);
export default auditApi;
