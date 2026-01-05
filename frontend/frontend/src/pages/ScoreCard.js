
import React, { useState } from "react";
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

const calculateCAS = (m) =>
  (
    m.ocr * 0.25 +
    m.extraction * 0.3 +
    m.policy * 0.2 +
    m.duplicate * 0.15 +
    m.decision * 0.1
  ).toFixed(2);

const DEMO_METRICS = {
  ocr: 92,
  extraction: 88,
  policy: 97,
  duplicate: 85,
  decision: 90,
};
const LIVE_METRICS = DEMO_METRICS;


const ocrFieldAccuracyData = [
  { field: "Vendor", correct: 92, incorrect: 8 },
  { field: "Date", correct: 90, incorrect: 10 },
  { field: "Amount", correct: 95, incorrect: 5 },
  { field: "Currency", correct: 98, incorrect: 2 },
];
const extractionAccuracyData = [
  { field: "Amount", score: 27 },
  { field: "Date", score: 18 },
  { field: "Vendor", score: 17 },
  { field: "Category", score: 16 },
  { field: "Currency", score: 10 },
];
const policyRuleData = [
  { result: "Correct Detection", count: 190 },
  { result: "Missed Violation", count: 6 },
  { result: "False Positive", count: 4 },
];
const taxonomyData = [
  { name: "Correct L1 & L2", value: 70 },
  { name: "Correct L1 Only", value: 20 },
  { name: "Incorrect", value: 10 },
];

const duplicateMetrics = [
  { name: "Precision", value: 85 },
  { name: "Recall", value: 80 },
];

const anomalyData = [
  { name: "Detected", value: 75 },
  { name: "Missed", value: 25 },
];

const riskBandData = [
  { band: "Low", ai: 40, sme: 42 },
  { band: "Medium", ai: 35, sme: 33 },
  { band: "High", ai: 25, sme: 25 },
];

const hitlData = [
  { stage: "Auto Approved", count: 420 },
  { stage: "Flagged", count: 120 },
  { stage: "Escalated", count: 60 },
];

const confidenceData = [
  { confidence: "High", corrected: 5 },
  { confidence: "Medium", corrected: 20 },
  { confidence: "Low", corrected: 75 },
];

const fileScorecard = [
  {
    file: "Taxi Normal",
    ocr: 98,
    extraction: 95,
    rules: 100,
    dup: "N/A",
    risk: 90,
    decision: "✔",
  },
  {
    file: "Taxi Duplicate",
    ocr: 96,
    extraction: 94,
    rules: 100,
    dup: "✔",
    risk: 88,
    decision: "✔",
  },
  {
    file: "Foreign Currency",
    ocr: 92,
    extraction: 90,
    rules: 95,
    dup: "N/A",
    risk: 85,
    decision: "✔",
  },
  {
    file: "Blurry Receipt",
    ocr: 65,
    extraction: 70,
    rules: 90,
    dup: "N/A",
    risk: 75,
    decision: "✔",
  },
];

const COLORS = ["#0d6efd", "#00BF00", "#dc3545"];

/* =========================
   COMPONENT
========================= */
export default function ScoreCard() {
  const [demoMode, setDemoMode] = useState(true);
  const metrics = demoMode ? DEMO_METRICS : LIVE_METRICS;
  const CAS = calculateCAS(metrics);

  return (
    <Container fluid className="p-4">
      {/* 1️⃣ CAS */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h6>Composite Accuracy Score (CAS)</h6>
          <h2 className="fw-bold text-primary">{CAS}%</h2>
          <ProgressBar
            now={CAS}
            variant={CAS >= 80 ? "success" : "danger"}
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
                  data={ocrFieldAccuracyData}
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
                <BarChart data={extractionAccuracyData}  margin={{ top: 0, right: 0, left: 0, bottom: 30 }}>
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
                  <Pie data={policyRuleData} dataKey="count" label>
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
                  <Pie data={taxonomyData} dataKey="value" label>
                    {taxonomyData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
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
                <BarChart data={duplicateMetrics}>
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
                  <Pie data={anomalyData} dataKey="value" label>
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
                <BarChart data={riskBandData}>
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
                <BarChart data={hitlData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
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
            <BarChart data={confidenceData}>
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
              {fileScorecard.map((r) => (
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
