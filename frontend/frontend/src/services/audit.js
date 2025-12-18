import auditApi from '../api';

const auditService = {
    async getExpenses(filters={}) {
        const response = await auditApi.post('/expenses',filters);
        return response.data;
    },
    async submitAudit(payload) {
        const response = await auditApi.post('/process', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    }
}
export default auditService;