import React, { useEffect, useState } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import auditService from "../services/audit";

export default function PolicyList() {
    const module = window.location.pathname.split("/")[1];
    const [policies, setPolicies] = useState([]);
    const navigate = useNavigate();
    const fetchData = async () => {
            const auditData = await auditService.getPoliciesList();
            setPolicies(auditData.data);
        }
    useEffect(() => {
        
        fetchData();
    }, []);

    const activatePolicy = async (id) => {
        await auditService.activatePolicy(id);
        fetchData();
    };

    const deletePolicy = async(id)=>{
        await auditService.deletePolicy(id);
        fetchData();
    }
    const viewPolicy = (id) => {
        navigate(`/${module}/result_view_policy/${id}`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Policy List</h2>
                <Button variant="primary" onClick={() => navigate(`/${module}/policy_upload`)}>
                    Upload New Policy
                </Button>
            </div>


            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {policies.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>
                                {p.status === "ACTIVE" ? (
                                    <Badge bg="success">ACTIVE</Badge>
                                ) : (
                                    <Badge bg="secondary">INACTIVE</Badge>
                                )}
                            </td>
                            <td>{p.created_at}</td>
                            <td className="d-flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => viewPolicy(p.id)}
                                >
                                    View
                                </Button>

                                {p.status !== "ACTIVE" && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => activatePolicy(p.id)}
                                    >
                                        Activate
                                    </Button>
                                )}
                                {/* <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={()=>deletePolicy(p.id)}>
                                        Delete
                                        </Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}