import React from "react";
import { BrowserRouter, Link, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { MODULES } from "./services/constants";
import GlobalLoader from "./components/GlobalLoader";
import { useLoader } from "./context/LoaderContext";
import { useEffect } from "react";
import { LoaderProvider } from "./context/LoaderContext";
import { registerLoader } from "./services/loaderStore";
import ResultView from "./pages/ResultView";
import Home from "./pages/Home";
import ModuleGuard from "./components/ModuleGuard";
import {useLocation} from "react-router-dom";
function AppContent() {
  const location = useLocation();
  const module = location.pathname.split("/")[1];
  const module_name = MODULES?.[module]|| "";
  const isAllowModule = (module === "finance" || module === 'health');
  
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Intelligent {isAllowModule?module_name : ''} Audit</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
              {isAllowModule && (
                <>
                  <Nav.Link as={Link} to={`/${module}/dashboard`}>Dashboard</Nav.Link>
                  <Nav.Link as={Link} to={`/${module}/add_audit`}>New Audit</Nav.Link>
                  <Nav.Link as={Link} to={`/${module}/score_card`}>Metrics</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>

    </>
  );
}

function PublicLayout() {
  return <Outlet />;
}
function CommonContent() {
  const { setLoading } = useLoader();

  useEffect(() => {
    registerLoader(setLoading);
  }, [setLoading]);
  return (
    <>
      <GlobalLoader />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AppContent />}>
          <Route path="/result_view/:id" element={<ResultView />} />
          <Route path="/:module/dashboard" element={<ModuleGuard page="dashboard" />} />
          <Route path="/:module/add_audit" element={<ModuleGuard page="add_audit" />} />
          <Route path="/:module/score_card" element={<ModuleGuard page="score_card" />} />
          <Route path="/:module/define_taxonomy" element={<ModuleGuard page="define_taxonomy" />} />
          <Route path="/:module/under_process" element={<ModuleGuard page="under_process" />} />

        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )

}
function App() {

  return (
    <LoaderProvider>
      <BrowserRouter>
        <CommonContent />
      </BrowserRouter>
    </LoaderProvider>
  );

}

export default App;