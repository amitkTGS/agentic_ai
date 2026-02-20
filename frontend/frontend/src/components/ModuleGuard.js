import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import UnderProcess from "../pages/UnderProcess";
import ScoreCard from "../pages/ScoreCard";
import DefineTaxonomy from "../pages/DefineTaxonomy";
import ResultView from "../pages/ResultView";
const ModuleGuard = ({ page }) => {

    const { module } = useParams();

    if (module === "finance" || module === "health") {
        if (page === "dashboard") {
            return <Dashboard />;
        } else if (page === "add_audit") {
            return <Upload />;
        } else if (page === "score_card") {
            return <ScoreCard />
        }else if(page === "result_view"){
            return <ResultView />
        }
    }else if(page === 'define_taxonomy'){
        return <DefineTaxonomy module={module} />
    }

    // All other modules
    return <UnderProcess module={module} />;

}
export default ModuleGuard;