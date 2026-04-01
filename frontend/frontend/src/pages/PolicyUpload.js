import { useState } from "react";
import { Container, Navbar, Card, Form, Alert, Row, Col, Button } from "react-bootstrap";
import auditService from '../services/audit';
import { useNavigate } from "react-router-dom";
import { FILE_SETTINGS,TAXONOMY_DATA,MODULES } from "../services/constants";
import { useParams } from "react-router-dom";


export default function PolicyUpload() {
  const navigate = useNavigate();
  const {module} = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async(e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a valid file.')
      return;
    }
    var formres = new FormData();
    formres.append('file', file);
    setLoading(true);
    console.log(loading)
    setError(null);
    try {
      var response  ='';
      formres.append('module', module);
      response = await auditService.PolicyUpload(formres);
      if(response?.data){
        setLoading(false);
        navigate(`/${module}/result_view_policy`,{
          state:{
            mode:"edit",
            data:response.data,
            file_name:fileName
          }
        })
      }
    } catch (err) {
      setError('System Error');
    } finally {
      setLoading(false);
      console.log(loading)
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
      <Container className="d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm">
          <Card.Body>
            
            <div className="">
              <h3 className="text-center">{MODULES?.[module] || 'Expense'}</h3>
            </div>
            <Form onSubmit={handleProcess}>
              <Form.Group className="mb-4">
                <Form.Label className="">Upload Policy Document <span className="text-danger">*</span></Form.Label>
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
              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Process Policy'}
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