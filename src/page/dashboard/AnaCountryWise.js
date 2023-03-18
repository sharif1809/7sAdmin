import React, { useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
//import { TCDoughnut } from "../page/dashboard/AnalyticsChartCountry";
import { TCDoughnut } from "../../../charts/analytics/AnalyticsCharts";


const AnaCountryWise = () => {
  const [traffic, setTraffic] = useState("30");
  return (
    <React.Fragment>
      {" "}
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title">Country Data </h6>
        </div>
    
      </div>
      <div className="traffic-channel">
        <div className="traffic-channel-doughnut-ck">
          <TCDoughnut state={traffic} className="analytics-doughnut"></TCDoughnut>
        </div>
        <div className="traffic-channel-group g-2">
 
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#ffa9ce" }}></span>
              <span> India  </span>
            </div>
            <div className="amount">
            <small> 1295 </small>
            </div>
          </div>
         
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#ffa9ce" }}></span>
              <span> USA  </span>
            </div>
            <div className="amount">
            <small> 1295 </small>
            </div>
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#ffa9ce" }}></span>
              <span> Saudi Arabia  </span>
            </div>
            <div className="amount">
            <small> 1295 </small>
            </div>
          </div>          
        </div>
      </div>
    </React.Fragment>
  );
};
export default AnaCountryWise;
