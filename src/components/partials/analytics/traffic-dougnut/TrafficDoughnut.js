import React, { useState, useEffect } from "react";

import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { TCDoughnutAds } from "../../charts/analytics/AnalyticsCharts";
import { getDashboardAmin} from "../../../../app/api";
const TrafficDougnut = () => {
  const [deskdata, setData] = useState([]);
  const [pertdata, setData1] = useState([]);
  const [androdata, tabsetData] = useState([]);
  const getCampData = async () => {
    const res = await getDashboardAmin();
     console.log(res.ads);
      if(res) {
      setData(res.ads),
      setData1(res.adsp)
    }
  }
  useEffect( () => {
    getCampData();
  }, []);
  return (
    <React.Fragment>
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title"> Traffic by Ads (Impressions)   </h6>
        </div>
    
      </div>
      <div className="traffic-channel">
        <div className="traffic-channel-doughnut-ck">
        <TCDoughnutAds className="analytics-doughnut" state={ pertdata }  />
        </div>
        <div className="traffic-channel-group g-2">
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#798bff" }}></span>
              <span>Text Ad</span>
            </div>
            <div className="amount">
             { deskdata.text } <span className="title" >{pertdata.textper}% </span>
            </div>
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#b8acff" }}></span>
              <span>Banner Ad</span>
            </div>
            
            <div className="amount">
            { deskdata.banner } <span className="title" >{pertdata.bannerper}% </span>
            </div>
            
            
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#ffa9ce" }}></span>
              <span>Socialbar Ad</span>
            </div>
            <div className="amount">
            { deskdata.social } <span className="title" >{pertdata.socialper}% </span>
            </div>
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#f9db7b" }}></span>
              <span>Native Ad</span>
            </div>
            <div className="amount">
            { deskdata.native } <span className="title" >{pertdata.nativeper}% </span>
            </div>
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#EA4335" }}></span>
              <span>Video Ad</span>
            </div>
            <div className="amount"> 
            { deskdata.video }  <span className="title" >{pertdata.videoper}% </span>
            </div>
          </div>
          <div className="traffic-channel-data">
            <div className="title">
              <span className="dot dot-lg sq" style={{ background: "#34A853" }}></span>
              <span>Popunder Ad</span>
            </div>
            <div className="amount">
            { deskdata.popup }  <span className="title" >{pertdata.popupper}% </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default TrafficDougnut;
