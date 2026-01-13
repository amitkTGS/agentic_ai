
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Table,
  Badge,
  Form,
  Alert,
} from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import auditService from "../services/audit";

const calculateCAS = (m) =>
  (
    m.ocr * 0.25 +
    m.extraction * 0.3 +
    m.policy * 0.2 +
    m.duplicate * 0.15 +
    m.decision * 0.1
  ).toFixed(2);
const COLORS = ["#0d6efd", "#00BF00", "#dc3545"];

/* =========================
   COMPONENT
========================= */
export default function ScoreCard() {
  const [metrics,setMetrics] = useState()
  const [cas,setCas] = useState(0)
  useEffect(()=>{
    const getData = async ()=>{
      const result = await auditService.getMetrics();
      if (result.data) {
          setMetrics(result.data);
          setCas(calculateCAS(result.data.metrics));
      }
    }
    getData();
  },[])

  return (
    <Container fluid className="p-4">
      {/* 1️⃣ CAS */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h6>Composite Accuracy Score (CAS)</h6>
          <h2 className="fw-bold text-primary">{cas}%</h2>
          <ProgressBar
            now={cas}
            variant={cas >= 80 ? "success" : "danger"}
          />
          <small className="text-muted">Target ≥ 80%</small>
        </Card.Body>
      </Card>

      {/* 2️⃣ Accuracy Metrics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>OCR Field-Level Accuracy</h6>
              <ResponsiveContainer height={250}>
                <BarChart
                  data={metrics?.ocr}
                  margin={{ top: 0, right: 0, left: 0, bottom: 10 }}
                >
                  <XAxis
                    dataKey="field"
                    interval={0}          
                    angle={-20}            
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="correct" stackId="a" fill="#00BF00" />
                  <Bar dataKey="incorrect" stackId="a" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
              <small className="text-muted">
                Clean PDFs ≥95%, Images ≥85%, Blurry ≥65%
              </small>
            </Card.Body>

          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>LLM Extraction Accuracy (Weighted)</h6>
              <ResponsiveContainer height={250}>
                <BarChart data={metrics?.extraction}  margin={{ top: 0, right: 0, left: 0, bottom: 30 }}>
                   <XAxis
                    dataKey="field"
                    interval={0}          
                    angle={-20}            
                    textAnchor="end"
                  />
                  <YAxis />
                  
                  <Tooltip />
                  <Bar dataKey="score" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
              <small className="text-muted">
                Target ≥90% (clean), ≥75% (noisy)
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Policy Validation Accuracy</h6>
              <ResponsiveContainer height={250}>
                <PieChart>
                  <Pie data={metrics?.policy} dataKey="count" label>
                    <Cell fill="#00BF00" />
                    <Cell fill="#ffc107" />
                    <Cell fill="#dc3545" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <small className="text-muted">
                Deterministic rules — Target ≥95%
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Taxonomy Accuracy</h6>
              <ResponsiveContainer height={250}>
                <PieChart>
                  {metrics?.taxonomy ?(
                  <Pie data={metrics?.taxonomy} dataKey="value" label>
                    {(metrics?.taxonomy).map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  ):(
                    <></>
                  )}
                 
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Duplicate Detection</h6>
              <ResponsiveContainer height={250}>
                <BarChart data={metrics?.duplicate}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    <Cell fill="#0d6efd" />
                    <Cell fill="#ffc107" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Anomaly Detection</h6>
              <ResponsiveContainer height={250}>
                <PieChart>
                  <Pie data={metrics?.anamoly} dataKey="value" label>
                    <Cell fill="#00BF00" />
                    <Cell fill="#dc3545" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>Risk Profiling (AI vs SME)</h6>
              <ResponsiveContainer height={280}>
                <BarChart data={metrics?.risk_band}>
                  <XAxis dataKey="band" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ai" fill="#0d6efd" />
                  <Bar dataKey="sme" fill="#00BF00" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h6>HITL Escalation Funnel</h6>
              <ResponsiveContainer height={280}>
                <BarChart data={metrics?.hitl} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Bar dataKey="count">
                    <Cell fill="#00BF00" />
                    <Cell fill="#ffc107" />
                    <Cell fill="#dc3545" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h6>Confidence Calibration</h6>
          <ResponsiveContainer height={250}>
            <BarChart data={metrics?.confidence}>
              <XAxis dataKey="confidence" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="corrected">
                <Cell fill="#00BF00" />
                <Cell fill="#ffc107" />
                <Cell fill="#dc3545" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h6>Per-File Explainability Scorecard</h6>
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>File</th>
                <th>OCR</th>
                <th>Extraction</th>
                <th>Rules</th>
                <th>Dup</th>
                <th>Risk</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.file_score_card.map((r) => (
                <tr key={r.file}>
                  <td>{r.file}</td>
                  <td>{r.ocr}%</td>
                  <td>{r.extraction}%</td>
                  <td>{r.rules}%</td>
                  <td>{r.dup}</td>
                  <td>{r.risk}%</td>
                  <td>
                    <Badge bg="success">{r.decision}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
