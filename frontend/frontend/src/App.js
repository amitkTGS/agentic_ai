import React from "react";
import {BrowserRouter,Link, Route, Routes,Navigate} from "react-router-dom";
import {Navbar,Container,Nav} from "react-bootstrap";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import GlobalLoader from "./components/GlobalLoader";
import { useLoader } from "./context/LoaderContext";
import { useEffect } from "react";
import { LoaderProvider } from "./context/LoaderContext";
import { registerLoader } from "./services/loaderStore";
import ResultView from "./pages/ResultView";
function AppContent() {
  const { setLoading } = useLoader();

  useEffect(() => {
    registerLoader(setLoading);
  }, [setLoading]);

  return (
    <>
      <GlobalLoader />
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Intelligent Expense Audit</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Move links to the right side using ms-auto */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/'}>Dashboard</Nav.Link>
              <Nav.Link as={Link} to={'/add_audit'}>New Audit</Nav.Link>
              <Nav.Link as={Link} to={'/reports'}>Score Card</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path ="/add_audit" element={<Upload />}/>
          <Route path ="/result_view/:id" element={<ResultView />}/>
          <Route path="*" element={<Navigate to={'/'} replace />} />
        </Routes>
      </Container>
    </>
  );
}
function App() {

  return (
     <LoaderProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoaderProvider>
  );

}

export default App;