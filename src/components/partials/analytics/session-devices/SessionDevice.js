import React, { useState, useEffect } from "react";
import { SessionDoughnut } from "../../charts/analytics/AnalyticsCharts";
import { Icon } from "../../../Component";
import { getDashboardAmin} from "../../../../app/api";


const SessionDevice = () => {
  
  const [deskdata, setData] = useState([]);
  const [mobdata, mobdatasetData] = useState([]);
  const [tablatedata, tabsetData] = useState([]);
  const [tablatedata2, tabsetData2] = useState([]);

  const getCampData = async () => {
    const res = await getDashboardAmin();
    // console.log(res.device.desktop.click);
      if(res) {
      setData(res.device.desktop),
      mobdatasetData(res.device.mobile),
      tabsetData(res.device.tablet),
      tabsetData2(res.device)
    }
  }
  useEffect( () => {
    getCampData();
  }, []);

  return (
    <React.Fragment>
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title">Traffic by Devices (Clicks) </h6>
        </div>
      </div>
      <div className="device-status my-auto">
        <div className="device-status-ck">
        <SessionDoughnut className="analytics-doughnut" state={ deskdata.percent } state1={ mobdata.percent } state3={tablatedata.percent} />
        </div>
        <div className="device-status-group">
          <div className="device-status-data">
            <Icon style={{ color: "#798bff" }} name="monitor"></Icon>
            <div className="title">Desktop</div>
            <div className="amount"> { deskdata.percent }%</div>
          </div>
          <div className="device-status-data">
            <Icon style={{ color: "#baaeff" }} name="mobile"></Icon>
            <div className="title">Mobile</div>
            <div className="amount">{ mobdata.percent }%</div>
          </div>
          <div className="device-status-data">
            <Icon style={{ color: "#7de1f8" }} name="tablet"></Icon>
            <div className="title">Tablet</div>
            <div className="amount"> { tablatedata.percent }% </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default SessionDevice;
