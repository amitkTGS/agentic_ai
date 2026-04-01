import auditApi from '../api';

const auditService = {
    getExpenses(filters={}){
        return auditApi.post('/expenses',filters);
    },
    submitAudit(payload){
        return auditApi.post('/process_new',payload);
    },
    submitHealthcareAudit(payload){
        return auditApi.post('/process_healthcare',payload);
    },
    getExpenseData(id){
        return auditApi.get('/expense/'+id);
    },
    approveExpense(id,status){
        return auditApi.get('expense/'+id+'/'+status);
    },
    deleteExpense(id){
        return auditApi.delete('expense/'+id);
    },
    getMetrics(){
        return auditApi.get('api/metrics/details');
    },
    saveTaxonomy(data){
        return auditApi.post('api/save_taxonomy',data);
    },
    getPolicies(data){
        return auditApi.get('api/get_policies',data);
    },
    PolicyUpload(data){
        return auditApi.get('api/get_policies',data);
    },
    savePolicies(payload){
        return auditApi.post('api/save_policies',payload)
    },
    getPoliciesList(){
        return auditApi.get('api/policies');
    },
    activatePolicy(id){
        return auditApi.post('api/policies/activate/'+id);
    },
    deletePolicy(id){
        return auditApi.post('api/policies/delete/'+id);
    }
}
export default auditService;    