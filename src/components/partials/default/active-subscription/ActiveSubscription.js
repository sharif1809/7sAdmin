import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "../../../Component";
import { BarChart } from "../../charts/default/Charts";

const ActiveSubscription = () => {
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-2">
        <CardTitle>
          <h6 className="title">  Subscriptions</h6>
        </CardTitle>
      </div>
      <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
        <div className="nk-sale-data">
          <span className="amount"> 2250</span>
          <span className="sub-title"> Total Revniew - 5850 </span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ActiveSubscription;
