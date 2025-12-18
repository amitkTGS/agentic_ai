import { useEffect, useMemo, useState,useCallback,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Table, Card, Form, Row, Col } from "react-bootstrap";
import auditService from "../services/audit";
import { AUDIT_STATUS, EXPENSE_CATEGORIES } from "../services/constants";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    start_date: '',
    end_date: ''
  });

 
  const isFirstRender = useRef(true);
  const fetchFilteredData = useCallback(async () => {
    console.log(filters);
    // setLoading(true);
    // try {
    //   const result = await auditService.getExpenses(filters);
    //   setItems(result);
    // } catch (err) {
    //   console.error("API Error:", err);
    // } finally {
    //   setLoading(false);
    // }
  }, [filters]); 

  useEffect(() => {
    fetchFilteredData();  
    isFirstRender.current = false;
  }, [fetchFilteredData]); 
  

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Expense Dashboard</h3>
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
              {Object.values(EXPENSE_CATEGORIES).map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label className="small fw-bold">Start Date</Form.Label>
            <Form.Control
              type="date"
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            />
          </Col>

          <Col md={3}>
            <Form.Label className="small fw-bold">End Date</Form.Label>
            <Form.Control
              type="date"
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            />
          </Col>
        </Row>
      </Card>

      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items?.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.employee_id}</td>
                  <td>{item.vendor || 'Pending'}</td>
                  <td>{item.amount || '0.00'}</td>
                  <td><span className={`badge bg-${item.decision === 'APPROVED' ? 'success' : 'warning'}`}>{item.decision}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No records found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}
