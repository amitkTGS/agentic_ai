import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    name: "Finance Audit for Enterprise",
    status: "Live",
    badge: "success",
    description:
      "Real-time receipt scanning and policy validation engine.",
    route: "/finance/dashboard",
    image:
      "https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
  },
  {
    name: "Health Care",
    status: "Live",
    badge: "success",
    description:
      "Automate auditing of medical bills and provider invoices for compliance.",
    route: "/health/dashboard",
    image:
      "https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
  },
  {
    name: "BFSI (Banking & Financial Services)",
    status: "Planned",
    badge: "primary",
    description:
      "Validation of corporate cards, reimbursements, and vendor invoices.",
    route: "/bfsi/define_taxonomy",
    image:
      "https://cdn-icons-png.flaticon.com/512/2830/2830284.png"
  },
  {
    name: "Insurance",
    status: "Planned",
    badge: "primary",
    description:
      "Automate insurance claims intake, validation, and fraud detection.",
    route: "/insurance/define_taxonomy",
    image:
      "https://cdn-icons-png.flaticon.com/512/942/942748.png"
  },
  
  {
    name: "Manufacturing / Supply Chain",
    status: "Planned",
    badge: "primary",
    description:
      "Automate validation of supplier invoices and procurement expenses.",
    route: "/supply_chain/define_taxonomy",
    image:
      "https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
  },
];
const Home = () => {
  const navigate = useNavigate();
  const projectsSectionRef = useRef(null);

  return (
    <>
      <style>
        {`
          .hero-gradient {
            background: linear-gradient(180deg, #31394a 0%, #293548 100%, #383f47 100%);
            position: relative;
            overflow: hidden;
            padding-bottom: 80px; 
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .floating-img {
            animation: float 6s ease-in-out infinite;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .btn-glow {
            background: linear-gradient(to right, #4f46e5, #9333ea);
            border: none;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px rgba(79, 70, 229, 0.4);
          }
          .btn-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 25px rgba(79, 70, 229, 0.6);
            color: white;
          }

          .btn-outline-glow {
            background: transparent;
            border: 1px solid rgba(249, 250, 245, 0.3);
            color: white;
            transition: all 0.3s ease;
          }
          .btn-outline-glow:hover {
            background: rgba(22, 75, 220, 0.1);
            border-color: white;
            color: white;
          }
            
          .module-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            height: 100%;
            position: relative;
            overflow: hidden;
          }
          
          .module-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px -15px rgba(88, 210, 219, 0.1);
            border-color: #cbd5e1;
          }

          .module-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, #9333ea);
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .module-card:hover::before {
            opacity: 1;
          }

          .icon-box {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
            border-radius: 12px;
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
          }

          .status-badge {
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .project-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
          }
        `}
      </style>

      <div>
        <section className="hero-gradient text-white d-flex align-items-center min-vh-75 pt-5">
          <div className="container position-relative z-1 mb-5">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="d-inline-flex align-items-center px-3 py-1 mb-4 rounded-pill border border-secondary bg-black bg-opacity-25">
                  <span className="badge bg-info me-2">V1.0</span>
                  <small className="text-light tracking-wide">Enterprise Audit Agent</small>
                </div>
                <h3 className="display-4 fw-bold mb-4 lh-sm">
                  AI - EAGA <div class="fw-normal">Enterprise Audit Governance Agent</div>
                </h3>

                <p className="lead text-light opacity-50 mb-5" style={{ maxWidth: '600px' }}>
                  Deploy intelligent <strong>AI Agents</strong> to audit expenses, detect fraud,
                  and enforce policy compliance in real-time with great accuracy.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button
                    className="btn premium-btn btn-glow btn-lg rounded-pill px-3 py-3 fw-bold text-white"
                    onClick={() => projectsSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Explore Modules
                  </button>

                  <button
                    className="btn glass-btn btn-outline-glow btn-lg rounded-pill px-3 py-3 fw-bold text-white"
                    onClick={() => navigate("/finance/dashboard")}
                  >
                    Launch Finance Demo
                  </button>
                </div>
              </div>

              <div className="col-lg-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1600&auto=format&fit=crop"
                  alt="AI Block Data"
                  className="img-fluid floating-img"
                  style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        <section ref={projectsSectionRef} className="py-5 bg-light">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h6 className="text-primary fw-bold text-uppercase ls-2">Ecosystem</h6>
              <h2 className="fw-bold display-6 mb-3">Active Agent Modules for Industry Sectors</h2>
              <div className="mx-auto bg-primary" style={{ height: "4px", width: "60px", borderRadius: "2px" }}></div>
            </div>

            <div className="row g-4 justify-content-center">
              {projects.map((project, index) => {
                const isLive = project.status === "Live";
                return (
                  <div className="col-md-6 col-lg-4 d-flex align-items-stretch" key={index} style={{ maxWidth: '400px' }}>
                    <div
                      className="module-card p-4 w-100"
                      role="button"
                      onClick={() => navigate(project.route)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="project-icon"
                        />
                        <span
                          className={`badge rounded-pill bg-${project.badge} bg-opacity-10 text-${project.badge} px-3 py-2 status-badge border border-${project.badge} border-opacity-25`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h4 className="fw-bold text-dark mb-3">{project.name}</h4>
                      <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
                        {project.description}
                      </p>

                      <div className="mt-auto pt-3 border-top border-light">
                        <div className={`d-flex align-items-center fw-bold small ${isLive ? "text-primary" : "text-secondary"}`}>
                          {isLive ? "Enter Dashboard" : "Development In Progress"}
                          {isLive && <i className="bi bi-arrow-right ms-2"></i>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;