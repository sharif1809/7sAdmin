import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";

import { Nav, NavItem, NavLink, Card, TabContent, TabPane, Badge, Form, Col, FormGroup, Row } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  PreviewCard,
  RSelect,


} from "../../components/Component";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { addFundToUser, userDetailList } from "../../app/api";
import Loader from "../../app/Loader";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";

const WebsiteUnitDetail = () => {
  const { webcode } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const history = useHistory();
  const [pgs, setPgs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("1");


  

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getUserInfo = async (webcode, pg = 1) => {
    setLoading(true);
    const res = await userDetailList(webcode, pg, itemPerPage);
    if (res.data) {
      setUser(res.data);
      setPgs(res.row)
    }
    setLoading(false);
  }
  
    // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getUserInfo(webcode, pageNumber)

    }
  }

  useEffect(() => {
    getUserInfo(webcode);

  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User Details"></Head>
      <Loader visible={loading} />

      {user && (

        <Content>
          <BlockHead size="sm" className="mt-5">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle tag="h3" page>
                  Website  / <strong className="text-primary small">{user.site_url}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                    Website ID: <span className="text-base">{user.web_code}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <Button
                  color="light"
                  outline
                  className="bg-white d-none d-sm-inline-flex"
                  onClick={() => history.goBack()}
                >
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <a
                  href="#back"
                  onClick={(ev) => {
                    ev.preventDefault();
                    history.goBack();
                  }}
                  className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                >
                  <Icon name="arrow-left"></Icon>
                </a>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <Card className="card-bordered">
              <div className="card-aside-wrap" id="user-detail-block">
                <div className="card-content">

                  <Nav tabs className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("1");
                        }}
                      >
                        <Icon name="user-circle"></Icon>
                        <span>Ad Unit List</span>
                      </NavLink>
                    </NavItem>

                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Card className="card-bordered">
                        <div className="card-inner-group">
                          <div className="card-inner p-0">
                            <DataTableBody>
                              <DataTableHead>
                                <DataTableRow>
                                  <span className="sub-text">Advertiser</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                  <span className="sub-text">Amount</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                  <span className="sub-text">Remark</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                  <span className="sub-text">Payment Mode</span>
                                </DataTableRow>
                                <DataTableRow size="mb">
                                  <span className="sub-text">Payment Id</span>
                                </DataTableRow>
                                <DataTableRow size="mb">
                                  <span className="sub-text">Payment Type</span>
                                </DataTableRow>
                                <DataTableRow size="md">
                                  <span className="sub-text">Created</span>
                                </DataTableRow>
                                {/* <DataTableRow size="md">
                    <span className="sub-text">Action</span>
                  </DataTableRow> */}
                              </DataTableHead>
                              {trasac != null
                                ? trasac.map((item) => {
                                  return (
                                    <DataTableItem key={item.id}>
                                      <DataTableRow>
                                        <div className="user-info">
                                          <span className="tb-lead">{item.advertiser_code} </span>
                                          <span>{item.transaction_id}</span>
                                        </div>
                                      </DataTableRow>

                                      <DataTableRow size="lg">
                                        <span className="tb-product">
                                          <span className="title">${item.amount}</span>
                                        </span>
                                      </DataTableRow>
                                      <DataTableRow size="lg">
                                        <span className="title">{item.remark}</span>
                                      </DataTableRow>
                                      <DataTableRow size="lg">
                                        <span className={`badge badge-dim badge-dark`}>
                                          <span>{item.payment_mode}</span>
                                        </span>
                                      </DataTableRow>

                                      <DataTableRow size="md">
                                        <span>{item.payment_id}</span>
                                      </DataTableRow>

                                      <DataTableRow size="lg">
                                        {item.pay_type == "credit" && (
                                          <span
                                            className={`badge badge-sm badge-dim badge-outline-success d-none d-md-inline-flex`}
                                          >
                                            <span>
                                              <em class="icon ni ni-arrow-down-left"></em> Credit
                                            </span>
                                          </span>
                                        )}
                                        {item.pay_type == "debit" && (
                                          <span className={`badge badge-sm badge-dim badge-outline-danger d-none d-md-inline-flex`}>
                                            <span>
                                              <em class="icon ni ni-arrow-up-right"></em> Debit
                                            </span>
                                          </span>
                                        )}
                                      </DataTableRow>

                                      <DataTableRow size="md">
                                        <span className="tb-product">
                                          <span className="title">
                                            <Moment format="DD-MM-YYYY HH:mm:ss A">{item.created_at}</Moment>
                                          </span>
                                        </span>
                                      </DataTableRow>
                                      {/* <DataTableRow className="nk-tb-col-tools text-right">
                            <ul className="nk-tb-actions gx-1">
                              <li>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="a"
                                    className="text-soft dropdown-toggle btn btn-icon btn-trigger"
                                  >
                                    <Icon name="more-h"></Icon>
                                  </DropdownToggle>
                                  <DropdownMenu right>
                                    <ul className="link-list-opt no-bdr">
                                      <li>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/transactions-view/${btoa(
                                            item.transaction_id
                                          )}`}
                                        >
                                          <Icon name="file-text"></Icon>
                                          <span> Generate Invoice </span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </li>
                            </ul>
                          </DataTableRow> */}
                                    </DataTableItem>
                                  );
                                })
                                : null}
                            </DataTableBody>
                            <div className="card-inner">
                              {trasac != null ? (
                                <PaginationComponent
                                  itemPerPage={itemPerPage}
                                  totalItems={pgtn}
                                  paginate={paginate}
                                  currentPage={currentPage}
                                />
                              ) : (
                                <div className="text-center">
                                  <span className="text-silent">No Transactions found</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </TabPane>


                  </TabContent>

                </div>

              </div>
            </Card>

          </Block>

          <ToastContainer />
        </Content>

      )}
    </React.Fragment>

  );
};
export default WebsiteUnitDetail;
