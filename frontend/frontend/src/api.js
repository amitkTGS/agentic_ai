import axios from 'axios';

const auditApi = axios.create({
  baseUrl : process.env.API_URL,
  timeout:30000,
});
export default auditApi;