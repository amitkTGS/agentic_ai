import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MODULES } from "../services/constants";

const UnderProcess = ({ module = "Unknown" }) => {
  const navigate = useNavigate();
  const title = MODULES[module];

  return (
    <>
      <style>
        {`
          .construction-bg {
            background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #475569);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            width: 100%;
          }

          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .floating-graphic {
            animation: float 6s ease-in-out infinite;
            filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2));
            max-height: 250px;
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.3);
            max-width: 600px;
            width: 90%;
            position: relative;
            z-index: 10;
            padding: 3rem;
          }
        `}
      </style>

      <div className="construction-bg">
        <div className="glass-card text-center">
          <div className="mb-4">
            {/* <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/web-development-4552697-3775438.png"
              alt="Under Construction"
              className="img-fluid floating-graphic"
            /> */}
          </div>

          <span className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase">
            🚧 Work In Progress
          </span>

          <h2 className="fw-bold mb-3 display-6 text-dark">
            {title} Module
          </h2>

          <p className="text-muted fs-5 mb-5 px-lg-4">
            We are currently training the AI agents for this specific sector. 
            Expect automated {title}  capabilities soon.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <button
              onClick={() => navigate("/")}
              className="btn btn-dark btn-lg px-4 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Projects
            </button>

            <button
              onClick={() => navigate("/finance/dashboard")}
              className="btn btn-outline-primary btn-lg px-4 rounded-pill d-flex align-items-center justify-content-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              Try Finance Demo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnderProcess;