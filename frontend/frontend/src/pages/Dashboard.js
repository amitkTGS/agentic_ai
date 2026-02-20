import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Table, Card, Form, Row, Col } from "react-bootstrap";
import auditService from "../services/audit";
import { AUDIT_STATUS, EXPENSE_CATEGORIES,TAXONOMY_DATA,MODULES, HEADER_COLUMNS} from "../services/constants";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { module } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    start_date: '',
    end_date: '',
    module: module
  });
  const navigate = useNavigate();

  const isFirstRender = useRef(true);
  const fetchFilteredData = useCallback(async () => {
    console.log(filters);
    try {
      const result = await auditService.getExpenses(filters);
      setItems(result.data);
    } catch (err) {
      console.error("API Error:", err);
    }
  }, [filters]);

  useEffect(() => {
    fetchFilteredData();
    isFirstRender.current = false;
  }, [fetchFilteredData]);

  const handleView = (item) => {
    navigate('/'+module+'/result_view/' + item.id)
  }
  const handleDelete  = async (id)=>{
    try{
      const result =  await auditService.deleteExpense(id);
      if(result){
          fetchFilteredData();
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{MODULES?.[module] || 'Expense'} Dashboard</h3>
      </div>
      <Card className="mb-4 shadow-sm border-0 bg-light p-3">
        <Row className="g-3">
          <Col md={3}>
            <Form.Label className="small fw-bold">Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {Object.values(AUDIT_STATUS).map((status) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label className="small fw-bold">Category</Form.Label>
            <Form.Select
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {Object.entries(TAXONOMY_DATA[module] || {}).map(
                ([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                )
              )}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Label className="small fw-bold">Start Date</Form.Label>
            <Form.Control
              type="date"
              onChange={e => setFilters({ ...filters, start_date: e.target.value })}
            />
          </Col>

          <Col md={2}>
            <Form.Label className="small fw-bold">End Date</Form.Label>
            <Form.Control
              type="date"
              onChange={e => setFilters({ ...filters, end_date: e.target.value })}
            />
          </Col>
        </Row>
      </Card>

      {
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              {HEADER_COLUMNS?.[module]?.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items?.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.employee_id}</td>
                  <td>{item.vendor}</td>
                  <td>{item.total_amount || '0.00'}</td>
                  <td>{item.date}</td>
                  <td>
                    {TAXONOMY_DATA[module]?.[item.category]?.['label'] || item.category}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`badge bg-${AUDIT_STATUS?.[item.status]?.variant}`}
                      >
                        {AUDIT_STATUS?.[item.status]?.label}
                      </span>

                      <i
                        className="bi bi-eye"
                        title="View details"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleView(item)}
                      ></i>

                      {/* <i
                        className="bi bi-trash text-danger"
                        title="Delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(item.id)}
                      ></i> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">No records found</td>
              </tr>
            )}
          </tbody>
        </Table>
      }
    </div>
  );
}
