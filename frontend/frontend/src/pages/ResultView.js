import React, { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Button, Badge, ListGroup, ProgressBar } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import auditService from '../services/audit';
import { AUDIT_STATUS, EXPENSE_CATEGORIES } from '../services/constants';
export default function ResultView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();


  const getRiskColor = (level) => {
    if (level?.toLowerCase() === 'high') return 'danger';
    if (level?.toLowerCase() === 'medium') return 'warning';
    return 'success';
  };
  const fetchData = async (id) => {
    const result = await auditService.getExpenseData(id);
    console.log(result);
    if (result.data) {
      const result_data = result.data;
      result_data['extracted'] = JSON.parse(result_data.extracted);
      result_data['violations'] = JSON.parse(result_data.violations);
      setData(result_data)
    }
  }
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id])

  const handleBack = () => {
    navigate("/dashboard"); // change to your listing route
  };

  const handleApprove = async (status) => {
    try {
      await auditService.approveExpense(data.expense_id, status);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3">
        <Button variant="outline-secondary" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </Button>
        <h2 className="mb-0">Audit Results</h2>
      </div>

      <Row className='mt-2'>
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">Risk Assessment</Card.Header>
            <Card.Body className="text-center">
              <div className="mb-3">
                <h6 className="text-muted">Risk Score</h6>
                <h2 className={`text-${getRiskColor(data?.risk_level)}`}>{data?.risk_score}/100</h2>
                <Badge bg={getRiskColor(data?.risk_level)} className="fs-6">
                  {data?.risk_level?.toUpperCase()} RISK
                </Badge>
              </div>
              <ProgressBar
                variant={getRiskColor(data?.risk_level)}
                now={data?.risk_score}
                className="mb-3"
              />
              <div className="text-start">
                <strong>Decision:</strong>
                <span className={`ms-2 px-2 py-1 rounded bg-${AUDIT_STATUS[data?.decision]?.variant} bg-opacity-10 text-${AUDIT_STATUS[data?.decision]?.variant}`}>
                  {AUDIT_STATUS[data?.decision]?.label}
                </span>
                {["flagged", "hold"].includes(data?.decision) && (
                  <div className="d-flex align-items-center gap-1 mt-3 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="d-flex align-items-center gap-1 px-3"
                      onClick={() => handleApprove("approved")}
                    >
                      <i className="bi bi-check-circle"></i>
                      <span className="fw-semibold">Approve</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="d-flex align-items-center gap-1 px-3"
                      onClick={() => handleApprove("rejected")}
                    >
                      <i className="bi bi-x-circle"></i>
                      <span className="fw-semibold">Reject</span>
                    </Button>

                    {data?.decision === "flagged" && (
                      <Button
                        size="sm"
                        variant="outline-warning"
                        className="d-flex align-items-center gap-1 px-3"
                        onClick={() => handleApprove("hold")}
                      >
                        <i className="bi bi-pause-circle"></i>
                        <span className="fw-semibold">On Hold</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Policy Violations</Card.Header>
            <ListGroup variant="flush">
              {data?.violations?.length > 0 ? (
                data?.violations.map((v, i) => (
                  <ListGroup.Item key={i} className="text-danger small">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{v.description}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-success small">No violations found</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">Extracted Details</Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(data?.extracted || {}).map(([key, value]) => (
                  <Col md={6} key={key} className="mb-3">
                    <label className="text-muted small text-uppercase fw-bold d-block">{key.replace('_', ' ')}</label>
                    <span className="fs-5">{value || 'N/A'}</span>
                  </Col>
                ))}
                <Col md={6}>
                  <label className="text-muted small text-uppercase fw-bold d-block">Duplicate Probability</label>
                  <span className="fs-5">{(data?.duplicate_probability * 100).toFixed(1)}%</span>
                </Col>
              </Row>
              <hr />
              <h6>Explanation</h6>
              <p className="text-muted">{data?.explanation}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
