import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import UnderProcess from "../pages/UnderProcess";
import ScoreCard from "../pages/ScoreCard";
import DefineTaxonomy from "../pages/DefineTaxonomy";
import ResultView from "../pages/ResultView";
import PolicyUpload from "../pages/PolicyUpload";
import ResultViewPolicy from "../pages/ResultViewPolicy";
import PolicyList from "../pages/PolicyList";
const ModuleGuard = ({ page }) => {

    const { module } = useParams();

    if (module === "finance") {
        if (page === "dashboard") {
            return <Dashboard />;
        } else if (page === "add_audit") {
            return <Upload />;
        } else if (page === "score_card") {
            return <ScoreCard />
        }else if(page === "result_view"){
            return <ResultView />
        } else if (page === 'policy_upload'){
            return <PolicyUpload />
        }else if (page === 'result_view_policy'){
            return <ResultViewPolicy /> 
        }else if (page === 'policies_list'){
            return <PolicyList />
        }
    }else if(page === 'define_taxonomy'){
        return <DefineTaxonomy module={module} />
    }

    // All other modules
    return <UnderProcess module={module} />;

}
export default ModuleGuard;