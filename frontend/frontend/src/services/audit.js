import auditApi from '../api';

const auditService = {
    getExpenses(filters={}){
        return auditApi.post('/expenses',filters);
    },
    submitAudit(payload){
        return auditApi.post('/process',payload);
    },
    getExpenseData(id){
        return auditApi.get('/expense/'+id);
    },
    approveExpense(id){
        return auditApi.delete('expense/approve/'+id);
    }
}
export default auditService;    