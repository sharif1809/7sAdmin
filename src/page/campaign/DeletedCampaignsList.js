import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";
import * as moment from "moment";

import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  BlockDes,
} from "../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Spinner, Badge } from "reactstrap";
import { getDeletdCampaignsList } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";

const DeletedCampaignsList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [adtype, setAdtype] = useState("");

  const getAdType = () => {
    let adt = "";
    if (adtype == "Text Ads") {
      adt = "text";
    } else if (adtype == "Banner Ads") {
      adt = "banner";
    } else if (adtype == "Video Ads") {
      adt = "video";
    } else if (adtype == "Social Ads") {
      adt = "social";
    } else if (adtype == "Native Ads") {
      adt = "native";
    } else if (adtype == "Popunder Ads") {
      adt = "popup";
    }
    return adt;
  };

  const getCampData = async (type = "", pg = 1, lim = 0) => {
    setLoading(true);
    let tpe = type != 1 ? type : getAdType();
    let itemLim = lim > 0 ? lim : itemPerPage;
    const res = await getDeletdCampaignsList(tpe, pg, itemLim);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };
  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getAdType();
      getCampData(adt, pageNumber);
    }
  };
  useEffect(() => {
    getCampData();
  }, []);

  return (
    <React.Fragment>
      <Head title="Deleted Campaigns List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Deleted Campaigns List</BlockTitle>

              <BlockDes className="text-soft">You have total {pgs} campaign</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By {adtype.charAt(0).toUpperCase() + adtype.slice(1)} Ads</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData();
                                  setAdtype("");
                                }}
                              >
                                <span>All</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("text");
                                  setAdtype("text");
                                }}
                              >
                                <span>Text Ads</span>
                                {adtype === "Text Ads" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("banner");
                                  setAdtype("banner");
                                }}
                              >
                                <span>Banner Ads</span>
                                {adtype === "Banner Ads" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("video");
                                  setAdtype("video");
                                }}
                              >
                                <span>Video Ads</span>
                                {adtype === "video" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("social");
                                  setAdtype("social");
                                }}
                              >
                                <span>Social Ads</span>
                                {adtype === "social" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("native");
                                  setAdtype("native");
                                }}
                              >
                                <span>Native Ads </span>
                                {adtype === "native" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData("popup");
                                  setAdtype("popup");
                                }}
                              >
                                <span>Popunder Ads</span>
                                {adtype === "popup" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow>
                      <span className="sub-text">Campaign Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Advertisers</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Operator</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Impressions</span>
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
                      <span className="sub-text">Campaign Type</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="sub-text">Status</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="sub-text">Daily Budget</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="sub-text">Created On</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1 my-n1 sm">
                        <li className="mr-n1">
                          <span>Action</span>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableHead>
                  {data.length > 0
                    ? data.map((item) => {
                        return (
                          <DataTableItem key={item.campaign_id}>
                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.campaign_name} </span>
                                <span>{item.campaign_id}</span>
                              </div>
                            </DataTableRow>

                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.name} </span> <span>{item.advertiser_code}</span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>
                                {item.account_type === 0 && (
                                  <Badge pill color="success">
                                    Client
                                  </Badge>
                                )}
                              </span>
                              <span>
                                {item.account_type === 1 && (
                                  <Badge pill color="info">
                                    Inhouse
                                  </Badge>
                                )}
                              </span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span>{item.imprs}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.click}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              {item.ad_type === "text" && (
                                <Badge pill color="primary">
                                  Text
                                </Badge>
                              )}
                              {item.ad_type === "banner" && (
                                <Badge pill color="warning">
                                  Banner
                                </Badge>
                              )}
                              {item.ad_type === "video" && (
                                <Badge pill color="danger">
                                  Video
                                </Badge>
                              )}
                              {item.ad_type === "native" && (
                                <Badge pill color="info">
                                  Native
                                </Badge>
                              )}
                              {item.ad_type === "social" && (
                                <Badge pill color="success">
                                  Social
                                </Badge>
                              )}
                              {item.ad_type === "popup" && (
                                <Badge pill color="dark">
                                  Popunder
                                </Badge>
                              )}
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>
                                <span>{item.cat_name}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>
                                <span>{item.campaign_type.charAt(0).toUpperCase() + item.campaign_type.slice(1)}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              {item.status === 0 && (
                                <span className={`badge badge-dim badge-info`}>
                                  <span>Incomplete</span>
                                </span>
                              )}
                              {item.status === 1 && (
                                <span className={`badge badge-dim badge-primary`}>
                                  <span>In Review</span>
                                </span>
                              )}
                              {item.status === 2 && (
                                <span className={`badge badge-dim badge-success`}>
                                  <span>Active</span>
                                </span>
                              )}
                              {item.status === 3 && (
                                <span className={`badge badge-dim badge-danger`}>
                                  <span>Inactive</span>
                                </span>
                              )}
                              {item.status === 4 && (
                                <span className={`badge badge-dim badge-warning`}>
                                  <span>Paused</span>
                                </span>
                              )}
                              {item.status === 5 && (
                                <span className={`badge badge-dim badge-dark`}>
                                  <span>On Hold</span>
                                </span>
                              )}
                              {item.status === 6 && (
                                <span className={`badge badge-dim badge-danger`}>
                                  <span>Suspended</span>
                                </span>
                              )}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-product">
                                <span className="title">${item.daily_budget}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                              {/* <Moment format="DD-MM-YYYY"><span>{item.created_at}</span></Moment> */}
                            </DataTableRow>

                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                <li className="mr-n1">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          {item.status === 4 ? (
                                            <li>
                                              
                                              <Link
                                                to={`${process.env.PUBLIC_URL}/add-impression/${btoa(
                                                  item.campaign_id
                                                )}`}
                                              >
                                                <Icon name="icon ni ni-property-add"></Icon>
                                                <span> Add Impression </span>
                                              </Link>
                                              
                                            </li>
                                          ) : item.status === 2 ? (
                                            <li>
                                              <Link
                                                to={`${process.env.PUBLIC_URL}/add-impression/${btoa(
                                                  item.campaign_id
                                                )}`}
                                              >
                                                <Icon name="icon ni ni-property-add"></Icon>
                                                <span> Add Impression </span>
                                              </Link>
                                              
                                              
                                            </li>
                                          ) : ''}
                                        </li>
                                         
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner" style={{ display: "flex" }}>
                  <div style={{ alignSelf: "self-start", width: "97%" }}>
                    {data.length > 0 ? (
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
                  <div style={{ alignSelf: "end" }}>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag="a"
                        className="dropdown-toggle bg-white btn btn-sm btn-outline-light btn-icon"
                      >
                        &nbsp; &nbsp; {itemPerPage} <Icon name="downward-ios"></Icon>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <ul className="link-list-opt no-bdr">
                          <li onClick={() => {}}>
                            <DropdownItem
                              tag="a"
                              href="#"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setItemPerPage(10);
                                let adt = getAdType();
                                getCampData(adt, 1, 10);
                              }}
                            >
                              <span>10</span>
                            </DropdownItem>
                          </li>
                          <li onClick={() => {}}>
                            <DropdownItem
                              tag="a"
                              href="#"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setItemPerPage(20);
                                let adt = getAdType();
                                getCampData(adt, 1, 20);
                              }}
                            >
                              <span>20</span>
                            </DropdownItem>
                          </li>
                          <li onClick={() => {}}>
                            <DropdownItem
                              tag="a"
                              href="#"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setItemPerPage(50);
                                let adt = getAdType();
                                getCampData(adt, 1, 50);
                              }}
                            >
                              <span>50</span>
                            </DropdownItem>
                          </li>
                          <li onClick={() => {}}>
                            <DropdownItem
                              tag="a"
                              href="#"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setItemPerPage(100);
                                let adt = getAdType();
                                getCampData(adt, 1, 100);
                              }}
                            >
                              <span>100</span>
                            </DropdownItem>
                          </li>
                          <li onClick={() => {}}>
                            <DropdownItem
                              tag="a"
                              href="#"
                              onClick={(ev) => {
                                ev.preventDefault();
                                setItemPerPage(500);
                                let adt = getAdType();
                                getCampData(adt, 1, 500);
                              }}
                            >
                              <span>500</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default DeletedCampaignsList;
