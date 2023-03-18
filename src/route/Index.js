import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";

import Homepage from "../pages/Homepage";
import AddNewUser from "../page/adduser/AddNewUser";
import CategoryList from "../page/category/CategoryList";
import CountryList from "../page/country/CountryList";
import InhouseUsersList from "../page/user/InhouseUserList";
import ClientsList from "../page/user/ClientsList";
import CampaignList from "../page/campaign/CampaignList";
import UserDetail  from "../page/user/UserDetail";
import NotificationList from "../page/notification/NotificationList";
import BlockIpList from "../page/blockip/BlockIpList";
import CouponList from "../page/coupon/CouponList";
import PaymentDetail from "../page/payment-report/PaymentDetail";
import RolePermission from "../page/rolepermission/RolePermission";
import RolePermissionList from "../page/rolepermission/RolePermissionList";
import AddImpression from "../page/impression/AddImpression";
import ChagePassword from "../page/changepassword/ChangePassword";
import SupportList from "../page/support/SupportList";
import SupportView from "../page/support/SupportView";
import CampaignReport from "../page/report/CampaignReport";
import UserReport from "../page/report/UserReport";
import TransactionView from "../page/payment-report/TransactionView";
import StaffList from "../page/staff/StaffList";
import ActivityLog from "../page/report/ActivityLog";
import CampaignDetail from "../page/campaign/CampaignDetail";
import NoticeList from "../page/notice/NoticeList";
import PaymentLogSection from "../page/payment-section/PaymentLogSection";
import UpdateCampaign from "../page/campaign/UpdateCampaign";
import CampaignReportDetail from "../page/report/CampaignReportDetail";
import CampaignImpressionReportDetail from "../page/report/CampaignImpressionReportDetail";
import CampaignClickReportDetail from "../page/report/CampaignClickReportDetail";
import DeletedCampaignsList from "../page/campaign/DeletedCampaignsList";

// Publisher Route Location
import PublisherUsersList from "../publisher/user/PublisherUsersList";
import PublisherClientsList from "../publisher/user/PublisherClientsList";
import AdRateList from "../publisher/ad-rates/AdRateList";
import WebsiteList from "../publisher/website/WebsiteList";


const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        
        <Route exact path={`${process.env.PUBLIC_URL}/change-password`} component={ChagePassword}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/add-new-user`} component={AddNewUser}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/inhouse-advertiser-list`} component={InhouseUsersList}></Route>
        
        <Route exact path={`${process.env.PUBLIC_URL}/clients-advertiser-list`} component={ClientsList}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/category-list`} component={CategoryList}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/country-list`} component={CountryList}/>

        <Route exact path={`${process.env.PUBLIC_URL}/campaign-list`} component={CampaignList}/>
        
        <Route exact path={`${process.env.PUBLIC_URL}/deleted-campaign-list`} component={DeletedCampaignsList}/>

        <Route exact path={`${process.env.PUBLIC_URL}/campaign-details/:campaign_id`} component={CampaignDetail}/>

        <Route exact path={`${process.env.PUBLIC_URL}/user-details/:uid`} component={UserDetail}/>

        <Route exact path={`${process.env.PUBLIC_URL}/notification-list`} component={NotificationList}/>

        <Route exact path={`${process.env.PUBLIC_URL}/blockip-list`} component={BlockIpList}/>

    
        <Route exact path={`${process.env.PUBLIC_URL}/coupon-list`} component={CouponList}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/payment-report`} component={PaymentDetail}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/role-permission`} component={RolePermission}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/role-permission-list`} component={RolePermissionList}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/support-list`} component={SupportList}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/add-impression/:campid`} component={AddImpression}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/support-view/:ticketid`} component={SupportView}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/campaign-report`} component={CampaignReport}/>

        <Route exact path={`${process.env.PUBLIC_URL}/cmp-imp-report/:campaign_id`} component={CampaignReportDetail}/>

        <Route exact path={`${process.env.PUBLIC_URL}/cmp-imp-detail/:campaign_id`} component={CampaignImpressionReportDetail}/>
        <Route exact path={`${process.env.PUBLIC_URL}/cmp-click-detail/:campaign_id`} component={CampaignClickReportDetail}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/user-report`} component={UserReport}/>

        <Route  exact path={`${process.env.PUBLIC_URL}/transactions-view/:transactionid`} component={TransactionView}/>

        <Route exact path={`${process.env.PUBLIC_URL}/staff-list`} component={StaffList}/>
        
        <Route exact path={`${process.env.PUBLIC_URL}/activity-log`} component={ActivityLog}/>

        <Route exact path={`${process.env.PUBLIC_URL}/notice-list`} component={NoticeList}/>

        <Route exact path={`${process.env.PUBLIC_URL}/payment-log-section`} component={PaymentLogSection}/>

        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Homepage}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/update-campaign/:type/:cid`} component={UpdateCampaign}></Route>

        {/* Publisher Routes */}

        <Route exact path={`${process.env.PUBLIC_URL}/inhouse-publisher-list`} component={PublisherUsersList}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/clients-publisher-list`} component={PublisherClientsList}></Route>

        <Route exact path={`${process.env.PUBLIC_URL}/ad-rates-list`} component={AdRateList}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/website-list`} component={WebsiteList}></Route>
        

        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
