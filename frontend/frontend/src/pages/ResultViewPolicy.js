import React, { use, useCallback, useEffect, useState } from "react";
import { Card, Button, Form, Accordion } from "react-bootstrap";
import auditService from "../services/audit";
import {useNavigate, useParams} from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ResultViewPolicy() {
  const [groupedRules, setGroupedRules] = useState({});
  const location = useLocation();
  const {id} = useParams();
  const [file,setFile] = useState('');
  const [mode,setMode] = useState('view');
  const navigate = useNavigate();
  const readOnly = mode === 'view'

  const fetchData = useCallback(async ()=>{
   const results  =await auditService.getPolicies();
    if(results?.data?.length){
      setData(results.data);
    }
  },[]);
  const setData = (data) =>{
  const grouped = data.reduce((acc, rule) => {
        if (!acc[rule.category]) acc[rule.category] = [];
        acc[rule.category].push(rule);
        return acc;
      }, {});
      setGroupedRules(grouped);
  }
  useEffect(() => {
    if(location.state?.data){
      const incoming = location.state?.data;
        setMode(location.state.mode);
        setData(incoming);
        setFile(location.state.file_name)
    }else{
      fetchData();
    }
  }, [fetchData,location]);

  const handleChange = (category, index, field, value) => {
    const updated = { ...groupedRules };
    updated[category][index][field] = value;
    setGroupedRules(updated);
  };

  const getFlatData = () => Object.values(groupedRules).flat();

const handleApprove = async () => {
  const payload = {
    status: "APPROVED",
    data: getFlatData(),
    file_name: file
  };
  await auditService.savePolicies(payload)
  navigate(`/finance/dashboard`);

  alert("Approved & Saved to DB");
};

const handleReject = async () => {
  const payload = {
    status: "REJECTED",
    data: getFlatData(),
    file_name: file
  };
  await auditService.savePolicies(payload)
  alert("Rejected & Saved to DB");
};
  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "BLOCK":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Invoice Rules (Category Wise)</h2>

      <Accordion defaultActiveKey="0">
        {Object.keys(groupedRules).map((category, catIndex) => (
          <Accordion.Item eventKey={String(catIndex)} key={category}>
            <Accordion.Header>
              <strong>{category}</strong> ({groupedRules[category].length} rules)
            </Accordion.Header>

            <Accordion.Body>
              {groupedRules[category].map((rule, index) => (
                <Card key={rule.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="mb-2 text-muted">
                      {rule.section} | {rule.domain}
                    </div>

                    <Form.Group className="mb-2">
                      <Form.Label>Condition</Form.Label>
                      <Form.Control disabled= {readOnly}
                        value={rule.condition}
                        onChange={(e) =>
                          handleChange(category, index, "condition", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Action</Form.Label>
                      <Form.Control disabled= {readOnly}
                        value={rule.action}
                        onChange={(e) =>
                          handleChange(category, index, "action", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Severity</Form.Label>
                      <Form.Select disabled= {readOnly}
                        value={rule.severity}
                        className={`border-${getSeverityVariant(rule.severity)}`}
                        onChange={(e) =>
                          handleChange(category, index, "severity", e.target.value)
                        }
                      >
                        <option value="INFO">INFO</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="BLOCK">BLOCK</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className="d-flex gap-3 mt-4">
        { !readOnly && (
          <>
           <Button variant="success" onClick={handleApprove}>
                Approve
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Reject
              </Button>
          </>
       
        )

        }
      
      </div>
    </div>
  );
}