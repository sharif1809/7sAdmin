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
} from "../../components/Component";
import { useHistory, useParams} from "react-router";
import Loader from "../../app/Loader";
import classnames from "classnames";
import { getCampaignDetail } from "../../app/api";
const CampaignDetail = () => {
  const {campaign_id} = useParams();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState({});
  const [campaigDetail, setCampaignInfo] = useState();
  const history = useHistory();
  const [activeTab , setActiveTab] = useState("1");
    const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const getCampginInfo = async (campaign_id) => {
    setLoading(true);
    const res = await getCampaignDetail(atob(campaign_id));
    if(res.data)
    {
      setCampaignInfo(res.data);
      if(res.images) {
        setImg(res.images);
      } else {
        setImg({})
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    getCampginInfo(campaign_id);
  }, []);
  return (
    <React.Fragment>
      <Head title="Campaign Details"></Head>
      <Loader visible={loading} />
      {campaigDetail && (
        <Content>
          <BlockHead size="sm" className = "mt-5">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle tag="h3" page>
                Campaign Name  / <strong className="text-primary small">{campaigDetail.campaign_name}</strong>
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Campaign ID: <span className="text-base">{campaigDetail.campaign_id}</span>
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
                        <Icon name="icon ni ni-tile-thumb"></Icon>
                        <span>Campaign Detail</span>
                        
                      </NavLink>
                    </NavItem>
                    { campaigDetail.ad_type != 'text' && campaigDetail.ad_type != 'popup' ? ( 
                      <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        to="#tab"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("2");
                        }}
                      >
                        Campaign Image
                      </NavLink>
                    </NavItem>
                    ) :
                      <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        to="#tab"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("3");
                        }}
                      >
                        Campaign Description
                      </NavLink>
                    </NavItem>
                  }  
                  </Nav>
                  {/* All  Campaign Details ! */}
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="card-inner">
                        <Block>
                          <BlockHead>
                            <BlockTitle tag="h5">Campaign Information</BlockTitle>
                            <p>campaign info, like id and type, that user use on 7SearchPPC Platform.</p>
                          </BlockHead>
                          <div className="profile-ud-list">
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Campaign Name</span>
                                <span className="profile-ud-value">{campaigDetail.campaign_name} </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Campaign Id</span>
                                <span className="profile-ud-value">{campaigDetail.campaign_id}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Conversion URL</span>
                                <span className="profile-ud-value">{campaigDetail.conversion_url}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Website Category</span>
                                <span className="profile-ud-value">{campaigDetail.cat_name}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Daily Budget</span>
                                <span className="profile-ud-value">${campaigDetail.daily_budget}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item" style={{height: '100px', 'overflow-y': 'scroll'}}>
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Countries</span>
                                <span className="profile-ud-value">{campaigDetail.country_name ?  
                                  campaigDetail.country_name.split(',').map((item) => {
                                      return(
                                        <Badge pill color="secondary sm-tag">{item}</Badge>
                                      )
                                  })
                                 : 'All'}
                                </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Device Type</span>
                                <span className="profile-ud-value">{(campaigDetail.device_type) ? 
                                  campaigDetail.device_type.split(',').map((item) => {
                                    return(
                                      <Badge pill color="outline-info sm-tag">{item.toUpperCase()}</Badge>
                                    )
                                  })
                                  : '--'}
                                </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Device OS</span>
                                <span className="profile-ud-value">
                                  {(campaigDetail.device_os) ? 
                                  campaigDetail.device_os.split(',').map((item) => {
                                    return(
                                      <Badge pill color="outline-info sm-tag">{item.toUpperCase()}</Badge>
                                    )
                                })
                                  : '--'}
                                </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Impressions</span>
                                <span className="profile-ud-value">{campaigDetail.imprs}</span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Clicks</span>
                                <span className="profile-ud-value">{campaigDetail.click}</span>
                              </div>
                            </div>

                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Pricing Model</span>
                                <span className="profile-ud-value">{campaigDetail.pricing_model}</span>
                              </div>
                            </div>
                          </div>
                        </Block>                      
                        <div className="nk-divider divider md"></div>                        
                      </div>
                    </TabPane>
                    {/* Banner Campaign Image */}
                    <TabPane tabId="2">
                      <div className="row">
                        <div className="col-md-3">
                          <img src={img.ad1}/>
                        </div>
                        <div className="col-md-4">
                          <img src={img.ad2}  />
                        </div>
                        <div className="col-md-5">
                          <img src={img.ad3}  />
                        </div>
                      </div>
                    </TabPane>
                    {/* Text Campaign Description Details */}
                    <TabPane tabId="3">
                      <div className="card-inner">
                        <Block>
                          <BlockHead>
                            <BlockTitle tag="h5">Text Campaign Description</BlockTitle>
                              <p></p>
                          </BlockHead>
                          <div className="profile-ud-list">
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label"> Ad Title</span>
                                <span className="profile">{campaigDetail.ad_title} </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label"> Destination URL </span>
                                <span className="profile-ud-value">{campaigDetail.target_url} </span>
                              </div>
                            </div>
                            <div className="profile-ud-item">
                              <div className="profile-ud wider">
                                <span className="profile-ud-label">Ad Description </span>
                                <span className="profile">{campaigDetail.ad_description} </span>
                              </div>
                            </div>
                          </div>
                        </Block>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </Card>
            
          </Block>

        
        </Content>
       
      )}
    </React.Fragment>
    
  );
};
export default CampaignDetail;
