import React, { useState, useEffect } from "react";
import { SessionDoughnutOs  } from "../../charts/analytics/AnalyticsCharts";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { Icon } from "../../../Component";
import { getDashboardAmin} from "../../../../app/api";

const SessionOs = () => {
  const [sessionDevice, setSessionDevices] = useState("30");

  const [deskdata, setData] = useState([]);
  const [mobdata, mobdatasetData] = useState([]);
  const [androdata, tabsetData] = useState([]);
  const getCampData = async () => {
    const res = await getDashboardAmin();
    // console.log(res.device.desktop.click);
      if(res) {
      setData(res.os.windows),
      mobdatasetData(res.os.apple),
      tabsetData(res.os.android)
    }
  }
  useEffect( () => {
    getCampData();
  }, []);

  return (
    <React.Fragment>
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title">Traffic by OS (Clicks) </h6>
        </div>
        
      </div>
      <div className="device-status my-auto">
        <div className="device-status-ck">
          <SessionDoughnutOs className="analytics-doughnut" state={ deskdata.percent } state1={ mobdata.percent } state3={androdata.percent} />
        </div>        
        <div className="device-status-group">
          <div className="device-status-data">
            <Icon style={{ color: "#798bff" }} name="windows"></Icon>
            <div className="title">Windows</div>
            <div className="amount"> { deskdata.percent }%</div>
          </div>
          <div className="device-status-data">
            <Icon style={{ color: "#baaeff" }} name="apple"></Icon>
            <div className="title">Apple</div>
            <div className="amount"> { mobdata.percent }%</div>
          </div>
          <div className="device-status-data"> 
            <Icon style={{ color: "#7de1f8" }} name="android"></Icon>
            <div className="title">Android</div>
            <div className="amount">{ androdata.percent }%</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default SessionOs;
