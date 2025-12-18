import React from "react";
import {BrowserRouter,Link, Route, Routes,Navigate} from "react-router-dom";
import {Navbar,Container,Nav} from "react-bootstrap";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
function App() {

  return (
    <BrowserRouter>
     <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Intelligent Expense Audit</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Move links to the right side using ms-auto */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/'}>Dashboard</Nav.Link>
              <Nav.Link as={Link} to={'/add_audit'}>New Audit</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path ="/add_audit" element={<Upload />}/>
          <Route path="*" element={<Navigate to={'/'} replace />} />
        </Routes>
      </Container>
    </BrowserRouter>

  );

}

export default App;