import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import SaleRevenue from "../components/partials/default/sale-revenue/SaleRevenue";
import ActiveSubscription from "../components/partials/default/active-subscription/ActiveSubscription";
import AvgSubscription from "../components/partials/default/avg-subscription/AvgSubscription";
import SalesOverview from "../components/partials/default/sales-overview/SalesOverview";
import TransactionTable from "../components/partials/default/transaction/Transaction";
import RecentActivity from "../components/partials/default/recent-activity/Activity";
import NewsUsers from "../components/partials/default/new-users/User";
import Support from "../components/partials/default/support-request/Support";
import Notifications from "../components/partials/default/notification/Notification";
import TrafficDougnut from "../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import AdsWise from "../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import { CardTitle, DropdownToggle, DropdownMenu, Card, UncontrolledDropdown, DropdownItem } from "reactstrap";
import SessionDevice from "../components/partials/analytics/session-devices/SessionDevice";
import SessionOs from "../components/partials/analytics/session-devices/SessionOs";

import TopWalletUserData from "../page/dashboard/TopWalletUserData";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  PreviewCard,
  PreviewAltCard,
  BlockBetween,
} from "../components/Component";
import { getDashboardAmin } from "../app/api";

const Homepage = () => {
  const [sm, updateSm] = useState(false);
  const [tdata, setData] = useState([]);
  const [ydata, setDataYes] = useState([]);
  const [mdata, setDatamonth] = useState([]);
  const [ldata, setDataLife] = useState([]);
  const [usercountdata, setDatausercont] = useState([]);
  const [usersaisu, setDatausersais] = useState([]);
  const [Datatopuser, setDatatopuser] = useState([]);

  // Changing state value when searching name
  const getCampData = async () => {
    const res = await getDashboardAmin();
    if (res) {
      setData(res.today),
        setDataYes(res.yesterday),
        setDatamonth(res.thismonth),
        setDataLife(res.lifetime),
        setDatausercont(res.usercont),
        setDatausersais(res.usersais),
        setDatatopuser(res.topuser);
    }
  };
  useEffect(() => {
    getCampData();
  }, []);
  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard Admin Advertiser
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v" />
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}></div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            <Col xxl="12">
              <Row className="g-gs">
                <Col lg="3" xxl="3">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Today's Report </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> ${tdata.amount} </span>
                            <span className="sub-title">
                              {" "}
                              Impressions: {tdata != null && <span> : {tdata.impression}</span>}{" "}
                            </span>
                            <span className="sub-title">
                              {" "}
                              Clicks: {tdata != null && <span> : {tdata.click}</span>}{" "}
                            </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>

                <Col lg="3" xxl="3">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Yesterday's Report </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> ${ydata.amount} </span>
                            <span className="sub-title">
                              {" "}
                              Impressions: {ydata != null && <span> : {ydata.impression}</span>}{" "}
                            </span>
                            <span className="sub-title">
                              {" "}
                              Clicks: {ydata != null && <span> : {ydata.click}</span>}{" "}
                            </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="3" xxl="3">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Current Month </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> ${mdata.amount} </span>
                            <span className="sub-title">
                              {" "}
                              Impressions: {mdata != null && <span> : {mdata.impression}</span>}{" "}
                            </span>
                            <span className="sub-title">
                              {" "}
                              Clicks: {mdata != null && <span> : {mdata.click}</span>}{" "}
                            </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="3" xxl="3">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Lifetime Report </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> ${ldata.amount} </span>
                            <span className="sub-title">
                              {" "}
                              Impressions: {ldata != null && <span> : {ldata.impression}</span>}{" "}
                            </span>
                            <span className="sub-title">
                              {" "}
                              Clicks: {ldata != null && <span> : {ldata.click}</span>}{" "}
                            </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xxl="12">
              <Row className="g-gs">
                <Col lg="4" xxl="4">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard className="card-full ">
                        <div className="card-title-group mb-0 c-card-title-group">
                          <div className="card-title">
                            <h6 className="subtitle"> Today's User </h6>
                          </div>
                        </div>
                        <div className="card-amount c-card-amount">
                          <span className="amount">{usercountdata.today}</span>
                        </div>

                        <div className="invest-data">
                          <div className="invest-data-amount g-2">
                            <div className="invest-data-history">
                              <div className="title"> Advertisers </div>
                              <div className="card-amount">
                                <span className="amount pd-left32"> {usercountdata.advertiserctoday} </span>
                              </div>
                            </div>

                            <div className="invest-data-history">
                              <div className="title"> Publishers</div>
                                <div className="card-amount">
                                  <span className="amount pd-left32"> {usercountdata.publisherctoday} </span>
                                </div>
                              </div>
                            <div className="invest-data-history">
                              <div className="title"> Both</div>
                              <div className="card-amount pd-left13">
                                <span className="amount"> {usercountdata.bothctoday} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PreviewAltCard>
                      {/* <PreviewAltCard className="card-full ">
                        <div className="card-inner">
                          <div className="card-title-group align-start mb-3">
                            <CardTitle className="card-title">
                              <h6 className="title">Today's User</h6>
                              <p>
                              Today total users {usercountdata.today}
                                
                              </p>
                            </CardTitle>
                          </div>
                          <div className="user-activity-group g-4">
                            <div className="user-activity">
                              <Icon name="users"></Icon>
                              <div className="info">
                                <span className="amount">{usercountdata.advertiserctoday}</span>
                                <span className="title">Advertisers</span>
                              </div>
                            </div>
                            <div className="user-activity">
                              <Icon name="users"></Icon>
                              <div className="info">
                                <span className="amount">{usercountdata.publisherctoday}</span>
                                <span className="title">Publishers</span>
                              </div>
                            </div>
                            <div className="user-activity">
                              <Icon name="users"></Icon>
                              <div className="info">
                                <span className="amount">{usercountdata.bothctoday}</span>
                                <span className="title">Both</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PreviewAltCard> */}
                    </Col>
                  </Row>
                </Col>

                <Col lg="4" xxl="4">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard className="card-full ">
                        <div className="card-title-group mb-0 c-card-title-group">
                          <div className="card-title">
                            <h6 className="subtitle"> Yesterday's User </h6>
                          </div>
                        </div>
                        <div className="card-amount c-card-amount">
                          <span className="amount">{usercountdata.yesterday}</span>
                        </div>

                        <div className="invest-data">
                          <div className="invest-data-amount g-2">
                            <div className="invest-data-history">
                              <div className="title"> Advertisers </div>
                              <div className="card-amount pd-left32">
                                <span className="amount"> {usercountdata.advertisercyesterday} </span>
                              </div>
                            </div>

                            <div className="invest-data-history">
                              <div className="title"> Publishers</div>
                              <div className="card-amount pd-left32">
                                <span className="amount"> {usercountdata.publishercyesterday} </span>
                              </div>
                            </div>
                            <div className="invest-data-history">
                              <div className="title"> Both</div>
                              <div className="card-amount pd-left13">
                                <span className="amount"> {usercountdata.bothcyesterday} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="4" xxl="4">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard className="card-full ">
                        <div className="card-title-group mb-0 c-card-title-group">
                          <div className="card-title">
                            <h6 className="subtitle"> Total Users </h6>
                          </div>
                        </div>
                        <div className="card-amount c-card-amount">
                          <span className="amount">{usercountdata.lifetime}</span>
                        </div>

                        <div className="invest-data">
                          <div className="invest-data-amount g-2">
                            <div className="invest-data-history">
                              <div className="title"> Advertisers </div>
                              <div className="card-amount pd-left32">
                                <span className="amount"> {usercountdata.advertiserc} </span>
                              </div>
                            </div>

                            <div className="invest-data-history">
                              <div className="title"> Publishers</div>
                              <div className="card-amount pd-left32">
                                <span className="amount"> {usercountdata.publisherc} </span>
                              </div>
                            </div>
                            <div className="invest-data-history">
                              <div className="title"> Both</div>
                              <div className="card-amount pd-left13">
                                <span className="amount"> {usercountdata.bothc} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xxl="12">
              <Row className="g-gs">
                <Col lg="4" xxl="4">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Active Users </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> {usersaisu.active_user} </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>

                <Col lg="2" xxl="2">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Inactive Users </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> {usersaisu.inactive_user} </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="2" xxl="2">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Pending Users </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> {usersaisu.pendinguser} </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="2" xxl="2">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Hold Users </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> {usersaisu.holduser} </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
                <Col lg="2" xxl="2">
                  <Row className="g-gs">
                    <Col sm="12" lg="12" xxl="12">
                      <PreviewAltCard>
                        <div className="card-title-group align-start mb-2">
                          <CardTitle>
                            <h6 className="title"> Suspended Users </h6>
                          </CardTitle>
                        </div>
                        <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
                          <div className="nk-sale-data">
                            <span className="amount"> {usersaisu.suspend_user} </span>
                          </div>
                        </div>
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xxl="4" md="6">
              <PreviewAltCard className="h-100">
                <AdsWise />
              </PreviewAltCard>
            </Col>
            <Col md="4" xxl="4">
              <PreviewAltCard className="h-100" bodyClass="h-100 stretch flex-column">
                <SessionDevice />
              </PreviewAltCard>
            </Col>
            <Col md="4" xxl="4">
              <PreviewAltCard className="h-100" bodyClass="h-100 stretch flex-column">
                <SessionOs />
              </PreviewAltCard>
            </Col>

            <Col md="4" xxl="4">
              <Card className="card-bordered h-100">
                {Datatopuser !== null && <TopWalletUserData TopWalletUserData={Datatopuser.topuser} />}
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Homepage;
