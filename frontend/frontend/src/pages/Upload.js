import { useState } from "react";
import { Container, Navbar, Card, Form, Alert, Row, Col, Button } from "react-bootstrap";
import auditService from '../services/audit';
import { useNavigate } from "react-router-dom";
import { FILE_SETTINGS, EXPENSE_CATEGORIES } from "../services/constants";


export default function Upload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    expenseDate: '',
    category: ''
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleProcess = (e) => {
    e.preventDefault();
    if (!file || !formData.employeeId || !formData.expenseDate) {
      setError('Please fill in all mandatory fields and upload a valid file.')
      return;
    }
    var formres = new FormData();
    formres.append('file', file);
    formres.append('form_data', formData);
    setLoading(true);
    setError(null);
    try {
      const submitAudit = async () => {
        const response = await auditService.submitAudit(formres);
        console.log(response);
        // navigate('/');
      }
      submitAudit();
      // setResult(response);
    } catch (err) {
      setError('System Error');
    } finally {
      setLoading(false);
    }

  }
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    if (selectedFile) {
      if (!((FILE_SETTINGS.ALLOWED_TYPES).includes(selectedFile.type))) {
        setError('Invalid file type. Only PDF, PNG, and JPEG are allowed.');
        setFile(null);
        setFileName('');
        return;
      }
      if (selectedFile.size > FILE_SETTINGS.MAX_SIZE_BYTES) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        setFileName('');
        return
      }
      setFile(selectedFile)
      setFileName(selectedFile.name);
    }
  }
  return (
    <div>
      {/* <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>New Audit</h3>
      </div> */}
      <Container className="d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm">
          <Card.Body>
            <Form onSubmit={handleProcess}>
              <Form.Group className="mb-4">
                <Form.Label className="">Upload Receipt <span className="text-danger">*</span></Form.Label>
                <div style={styles.dropZone}>
                  <Form.Control
                    type="file"
                    accept=".pdf, .png, .jpg, .jpeg"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                  />
                  <div className="text-primary mb-2">
                    <i className="bi bi-cloud-arrow-up fs-1"></i>
                  </div>
                  <p className="mb-1 fw-semibold">Please drag and drop the items</p>
                  <small className="text-muted">Allowable files: PDF, PNG, JPEG (Max 10MB)</small>
                </div>
                {fileName && (
                  <div className="mt-2 text-success fw-bold">
                    Selected File: <span className="text-dark fw-normal">{fileName}</span>
                  </div>
                )}
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter ID"
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expense Date <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      required
                      type="date"
                      onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label>Category (Optional)</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {Object.values(EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Process Expense'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}


const styles = {
  dropZone: {
    border: '2px dashed #0d6efd',
    borderRadius: '10px',
    height: '150px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    position: 'relative'
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  }
};