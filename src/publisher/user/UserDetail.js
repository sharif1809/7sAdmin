import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";

import { Nav, NavItem, NavLink,Card,TabContent, TabPane, Badge, Form, Col, FormGroup, Row } from "reactstrap";
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
import { useHistory, useParams} from "react-router";
import { addFundToUser, userDetailList } from "../../app/api";
import Loader from "../../app/Loader";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import Transactions from "../component/Transaction";

const UserDetails = () => {
  const {uid} = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const history = useHistory();
  const [pgs, setPgs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [activeTab , setActiveTab] = useState("1");

  
  const [formData, setFormData] = useState({
    advertiser_code: atob(uid),
    amount: "",
    payment_mode: "",
    remark: "",
    pay_type: "credit",
    mailuser: "",
    
  });

  // const resetForm = () => {
  //   setFormData({
  //     amount: "",
  //     payment_mode: "",
  //     remark: "",
  //     pay_type: "",
  //   });
  // };

  
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  
  const getUserInfo = async (adv_id, pg=1) => {
    setLoading(true);
    const res = await userDetailList (atob(adv_id), pg, itemPerPage);
    if(res.data)
    {
      setUser(res.data);
      setPgs(res.row)
    }
    setLoading(false);
  }
  // console.log(user);

  const paymentMethod = [
    { value: "bitcoin", label: "Bitcoin" },
    { value: "coinpay", label: "Coinpay" },
    { value: "payu", label: "Payu" },
    { value: "stripe", label: "Stripe" },
    { value: "bonus", label: "Bonus" },
    
  ];

  const onFormSubmit = async (sData) => {
    
    setLoading(true);
    const res = await addFundToUser(formData);
    if(res.code === 200)
    {
      toast.success("Fund Added Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getUserInfo(uid);
      setLoading(false);
      
    }
    
    else
    {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
    // resetForm()
  }

  
  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if(currentPage !== pageNumber) {
      getUserInfo(uid,pageNumber)
      
    }
  }

  useEffect(() => {
    getUserInfo(uid);
    
  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User Details"></Head>
      <Loader visible={loading} />
      
      {user && (
        
        <Content>
          <BlockHead size="sm" className = "mt-5">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle tag="h3" page>
                  Users  / <strong className="text-primary small">{user.name}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      User ID: <span className="text-base">{user.uid}</span>
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
                        <span>Personal</span>
                      </NavLink>
                    </NavItem>
                    { user.user_type != '2' ? ( 
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("2");
                        }}
                      >
                        <Icon name="icon ni ni-tile-thumb"></Icon>
                        { user.user_type == 2 ? (
                        <span>Ad Units {user.name} </span>
                        ) : (
                          <span>Campaigns</span>
                        ) }
                      </NavLink>
                    </NavItem>
                      ) : <p></p>
                    } 
                    { user.user_type != '2' ? ( 
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "5" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("5");
                        }}
                      >
                        <Icon name="money"></Icon>
                        <span>Add Fund</span>
                      </NavLink>
                    </NavItem>
                      ) : <p></p>
                    } 
                    { user.user_type != '2' ? ( 
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("3");
                        }}
                      >
                        <Icon name="repeat"></Icon>
                        <span>Transactions</span>
                      </NavLink>
                    </NavItem>
                    ) : <p></p>
                    } 
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="card-inner">
                        <Block>
                          <BlockHead>
                            <BlockTitle tag="h5">Personal Information</BlockTitle>
                            <p>Basic user info, like name and address, that user use on 7SearchPPC Platform.</p>
                          </BlockHead>
                          <div className="profile-ud-list">
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Full Name</span>
                                <span className="profile-ud-value">{user.name} </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Email</span>
                                <span className="profile-ud-value">{user.email}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Wallet</span>
                                <span className="profile-ud-value">${user.wallet}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Website Category</span>
                                <span className="profile-ud-value">{user.cat_name}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Status</span>
                                <span className="profile-ud-value">
                                  {user.status === 0 && <span className={`badge badge-success`}><span>Active</span></span>}
                                  {user.status === 1 && <span className={`badge badge-primary`}><span>Inactive</span></span>}
                                  {user.status === 2 && <span className={`badge badge-warning`}><span>Pending</span></span>}
                                  {user.status === 3 && <span className={`badge badge-danger`}><span>Suspended</span></span>}
                                  {user.status === 4 && <span className={`badge badge-info`}><span>Hold</span></span>}
                                </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">User Type</span>
                                <span className="profile-ud-value">
                                  {user.user_type === 1 && <span className={`badge badge-dot badge-success`}><span>Advertiser</span></span>}
                                  {user.user_type === 2 && <span className={`badge badge-dot badge-primary`}><span>Publisher</span></span>}
                                  {user.user_type === 3 && <span className={`badge badge-dot badge-info`}><span>Both</span></span>}
                                  
                                </span>
                              </div>
                            </div>
                          </div>
                        </Block>

                        <Block>
                          <BlockHead className="nk-block-head-line">
                            <BlockTitle tag="h6" className="overline-title text-base">
                              Address Information
                            </BlockTitle>
                          </BlockHead>
                          <div className="profile-ud-list">
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Address</span>
                                <span className="profile-ud-value">{user.address_line1}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">City</span>
                                <span className="profile-ud-value">{user.city}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">State</span>
                                <span className="profile-ud-value">{user.state}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Country</span>
                                <span className="profile-ud-value">{user.country}</span>
                              </div>
                            </div>
                          </div>
                        </Block>
                        { user.user_type == 2 ? (
                        <Block>
                          <BlockHead className="nk-block-head-line">
                            <BlockTitle tag="h6" className="overline-title text-base">
                              Bank Detail
                            </BlockTitle>
                          </BlockHead>
                          <div className="profile-ud-list">
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Account Number</span>
                                <span className="profile-ud-value">1231654654654</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Bank Name</span>
                                <span className="profile-ud-value">Union Bank of India</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Branch</span>
                                <span className="profile-ud-value">Swaroop Nagar</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">City</span>
                                <span className="profile-ud-value">Lucknow</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Country</span>
                                <span className="profile-ud-value">India</span>
                              </div>
                            </div>
                          </div>
                        </Block>
                        ) : ''}

                        <div className="nk-divider divider md"></div>

                        
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="card-inner">
                        <Block>
                          <BlockHead>
                            <p>Total {pgs} campaigns.</p>
                          </BlockHead>
                          <Card className="card-bordered">
                            <div className="card-inner-group">
                              <div className="card-inner p-0">
                                <DataTableBody>
                                  <DataTableHead>
                                    
                                    <DataTableRow>
                                      <span className="sub-text">Campaign Name</span>
                                    </DataTableRow>
                                    <DataTableRow size="lg">
                                      <span className="sub-text">Impression</span>
                                    </DataTableRow>
                                    <DataTableRow size="lg">
                                      <span className="sub-text">Clicks</span>
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                      <span className="sub-text">Ad Type</span>
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                      <span className="sub-text">Campaign Category</span>
                                    </DataTableRow>
                                    <DataTableRow size="md">
                                      <span className="sub-text">Daily Budget</span>
                                    </DataTableRow>
                                    <DataTableRow size="md">
                                      <span className="sub-text">Country</span>
                                    </DataTableRow>
                                    <DataTableRow size="md">
                                      <span className="sub-text">Status</span>
                                    </DataTableRow>
                                    
                                  </DataTableHead>
                                  {user.campaigns.length > 0
                                    ? user.campaigns.map((item) => {
                                        return (
                                          <DataTableItem key={item.campaign_id}>
                                            
                                            <DataTableRow>
                                              <div className="user-info">
                                                <span className="tb-lead">
                                                  {item.campaign_name}{" "}
                                                </span>
                                                <span>{item.campaign_id}</span>
                                              </div>
                                            </DataTableRow>
                                            
                                            <DataTableRow size="lg">
                                              <span>{item.imprs}</span>
                                            </DataTableRow>
                                            <DataTableRow size="lg">
                                              <span>{item.click}</span>
                                            </DataTableRow>

                                            <DataTableRow size="md">
                                              {item.ad_type === 'text' && <Badge pill color="primary">Text</Badge>}
                                              {item.ad_type === 'banner' && <Badge pill color="warning">Banner</Badge>}
                                              {item.ad_type === 'video' && <Badge pill color="danger">Video</Badge>}
                                              {item.ad_type === 'native' && <Badge pill color="info">Native</Badge>}
                                              {item.ad_type === 'social' && <Badge pill color="success">Social</Badge>}
                                              {item.ad_type === 'popup' && <Badge pill color="dark">Popunder</Badge>}
                                            </DataTableRow>

                                            <DataTableRow size="lg">
                                              <span className={`badge badge-dim badge-dark`}><span>{item.cat_name}</span></span>
                                            </DataTableRow>

                                            <DataTableRow size="md">
                                              <span className="tb-product">
                                                <span className="title">${item.daily_budget}</span>
                                              </span>
                                            </DataTableRow>

                                            <DataTableRow size="lg">
                                              <span>{(item.country_name) ? item.country_name.split(',').map(item => {
                                                return (
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>{item}</small></Badge>
                                                )
                                              }) : 'ALL'}</span>
                                              {/* <span>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge><Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>

                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                                  <Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge><Badge pill color="outline-secondary mr-1 mb-1"><small>United State</small></Badge>
                                               </span> */}
                                            </DataTableRow>

                                            <DataTableRow size="md">
                                              {item.status === 0 && <span className={`badge badge-dim badge-info`}><span>Incomplete</span></span>}
                                              {item.status === 1 && <span className={`badge badge-dim badge-primary`}><span>In Review</span></span>}
                                              {item.status === 2 && <span className={`badge badge-dim badge-success`}><span>Active</span></span>}
                                              {item.status === 3 && <span className={`badge badge-dim badge-danger`}><span>Inactive</span></span>}
                                              {item.status === 4 && <span className={`badge badge-dim badge-warning`}><span>Paused</span></span>}
                                              {item.status === 5 && <span className={`badge badge-dim badge-dark`}><span>On Hold</span></span>}
                                              {item.status === 6 && <span className={`badge badge-dim badge-danger`}><span>Suspended</span></span>}
                                                
                                            </DataTableRow>

                                          </DataTableItem>
                                        );
                                      })
                                    : null}
                                </DataTableBody>
                                <div className="card-inner">
                                  {user.campaigns.length > 0 ? (
                                    <PaginationComponent
                                    itemPerPage={itemPerPage}
                                    totalItems={pgs}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                  />
                                  ) : (
                                    <div className="text-center">
                                      <span className="text-silent">No Campaign found</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Block>
                        <div className="nk-divider divider md"></div>
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      <Transactions/>
                      
                    </TabPane>
                    <TabPane tabId="5">
                      <div className="card-inner">
                        
                        <Block size="lg">
                          <BlockHead>
                            <BlockHeadContent>
                              <BlockTitle tag="h5">Add Fund</BlockTitle>
                              <p>You can add fund to the advertiser for run their campaign.</p>
                            </BlockHeadContent>
                          </BlockHead>
          
                          <PreviewCard>
                            <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                              <Row className="g-4">

                                <Col md="12">
                                  <FormGroup>
                                    <label className="form-label">Amount</label>
                                    <input
                                      type="number"
                                      name="amount"
                                      min={10}
                                      defaultValue={formData.amount}
                                      placeholder="Enter amount"
                                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                      className="form-control"
                                      ref={register({
                                        required: "Amount is required",
                                      })}
                                    />
                                    
                                    {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                                  </FormGroup>
                                </Col>
                                <Col md="12">
                                  <FormGroup>
                                    <label className="form-label">Payment Method</label>
                                    <div className="form-control-wrap">
                                      
                                      <RSelect
                                        options={paymentMethod}
                                        onChange={(e) =>
                                          // console.log(e.value)
                                          setFormData({ ...formData, payment_mode: e.value })}
                                          ref={register({
                                            required: "Payment method is required",
                                          })
                                        }
                                      />
                                    </div>
                                    
                                  </FormGroup>
                                </Col>

                                
                                
                                <Col size="12">
                                  <FormGroup>
                                    <label className="form-label">Remark</label>
                                    <textarea
                                      name="remark"
                                      defaultValue={formData.remark}
                                      placeholder="Enter remark"
                                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                      className="form-control-xl form-control no-resize"
                                      ref={register({
                                        required: "Remark field is required",
                                      })}
                                    />
                                    {errors.remark && <span className="invalid">{errors.remark.message}</span>}
                                  </FormGroup>
                                </Col>

                                <Col md="12">
                                  <FormGroup>
                                    
                                    <ul className="custom-control-group custom-control-vertical w-100">
                                      <li>
                                          <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                                          <input type="checkbox" className="custom-control-input"
                                          Value={'yes'}
                                          onChange={(e) => setFormData({ ...formData, mailuser: e.target.value })}
                                          name="mailuser" id="mailuser"
                                          
                                          />
                                          <label className="custom-control-label" htmlFor="mailuser">
                                              <span>Do you want to send mail to user</span>
                                              
                                          </label>
                                          </div>
                                      </li>
                                    </ul>
                                    
                                    
                                  </FormGroup>
                                </Col>
                                
                                
                                <Col xl="12">
                                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                    <li>
                                      <Button color="primary" size="md" type="submit">
                                        Add Fund
                                      </Button>
                                    </li>
                                    
                                  </ul>
                                </Col>
                              </Row>
                            </Form>
                          </PreviewCard>
                        </Block>
                        <div className="nk-divider divider md"></div>
                      </div>
                    </TabPane>
                  </TabContent>
                  
                </div>
               
              </div>
            </Card>
            
          </Block>

        <ToastContainer/>
        </Content>
       
      )}
    </React.Fragment>
    
  );
};
export default UserDetails;
