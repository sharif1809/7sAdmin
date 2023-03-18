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
import {
  deleteCampaign,
  getCampaignList,
  getCategoryList,
  updateAllCampaign,
  updateCampaignStatus,
  loginUserapi,
  getCmpListCategoryList,
} from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";

const CampaignList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);
  const [input, inputSearch] = useState([]);
  const [sortd, setSorted] = useState([]);

  const filterData = (sq) => {
    const result = data.filter((item, i) => item.campaign_name.toLowerCase().includes(sq));
    setSorted(result);
  };

  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [adtype, setAdtype] = useState("");
  const [usertype, setUsertype] = useState("");

  const getUType = () => {
    let udt = "";
    if (usertype == "Client") {
      udt = 0;
    } else if (usertype == "Inhouse") {
      udt = 1;
    }
    return udt;
  };

  // const [search, setSearch] = React.useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

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

  const [status, setStatus] = useState("");

  const getStatusType = () => {
    let std = "";
    if (status == "Incomplete") {
      std = 0;
    } else if (status == "Inreview") {
      std = 1;
    } else if (status == "Active") {
      std = 2;
    }
    // else if(status == 'InActive') {
    //   std = 3;
    // }
    else if (status == "Paused") {
      std = 4;
    } else if (status == "OnHold") {
      std = 5;
    } else if (status == "Suspended") {
      std = 6;
    }
    return std;
  };

  const [categlist, setCategory] = useState(null);

  const [cat, setCat] = useState(null);
  const [catName, setCatName] = useState(null);

  const getCategory = async () => {
    const res = await getCmpListCategoryList();
    // console.log(res);
    setCategory(res);
  };

  
  const getCampData = async (cat, type = "", status, pg = 1, lim = 0, src = "") => {
    setLoading(true);
    let tpe = type != 1 ? type : getAdType();
    let itemLim = lim > 0 ? lim : itemPerPage;
    //let sts = (status != 1) ? status : getStatusType();
    const res = await getCampaignList(cat, tpe, status, pg, itemLim, src);
    // console.log(res.data);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
      // console.log(res);
    }
    setLoading(false);
  };

  const updateCamp = async (cid, sts) => {
    setLoading(true);
    const res = await updateCampaignStatus(cid, sts);
    if (res.code === 200) {
      getCampData();
    }
    setLoading(false);
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onChange function for searching name
  const onFilterChange = (val) => {
    getCampData("", "", "", "", "", val);
  };

  // function to delete a campaign
  const deleteProduct = async (cid) => {
    setLoading(true);
    const res = await deleteCampaign(cid);
    if (res.code === 200) {
      toast.success("Campaign Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getCampData();
    } else {
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
    setLoading(false);
  };

  const [chk, setChk] = useState([]);
  const [chkAll, setChkAll] = useState(false);

  const setCheckBox = (val) => {
    let data = [];
    let cid = 0;
    chk.map((item) => {
      if (item === val) {
        cid = 1;
      }
      data.push(item);
    });

    if (cid === 0) {
      data.push(val);
    }

    setChk(data);
    // console.log(data);
  };

  const unsetCheckBox = (val) => {
    let data = chk.filter((item) => item !== val);
    setChk(data);
    setChkAll(!chkAll);
  };

  const updateAllRows = async (type) => {
    if (chk.length > 0) {
      let res = await updateAllCampaign({
        type: type,
        cid: chk,
      });
      let adt = getAdType();
      let udt = getUType();
      getCampData(adt, udt, currentPage, itemPerPage);
    } else {
      toast.error("Please select a campaign!", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
  };

  
  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
    });
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getAdType();
      let std = getStatusType();
      getCampData(cat, adt, std, pageNumber);
    }
  };
  useEffect(() => {
    getCampData();
    getCategory();
  }, []);

  useEffect(() => {
    filterData(input);
    //console.log("Type Value", input)
  }, [input]);

  return (
    <React.Fragment>
      <Head title="Campaigns List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Campaigns List</BlockTitle>

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
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right"></div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search Camp Name, Camp Name & ID"
                          onChange={(e) => {
                            onFilterChange(e.target.value);
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By Category {cat != null && <span> : {catName}</span>}</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr" style={{ height: "300px", "overflow-y": "scroll" }}>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setCat(null);
                                  setCatName("All");
                                  getCampData(0, 1);
                                }}
                              >
                                <span>All</span>
                              </DropdownItem>
                            </li>
                            {categlist !== null
                              ? categlist.map((item) => {
                                  return (
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setCat(item.value);
                                          setCatName(item.label);
                                          getCampData(item.value, 1);
                                        }}
                                        defaultValue={{ label: "test", value: cat }}
                                      >
                                        <span>{item.label}</span>
                                        {/* {item.label === item.label && <Icon name="check" style={{position:'absolute', right:'10px', fontSize:'14px'}} />} */}
                                      </DropdownItem>
                                    </li>
                                  );
                                })
                              : ""}
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
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
                                  getCampData(cat, "text");
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
                                  getCampData(cat, "banner");
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
                                  getCampData(cat, "video");
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
                                  getCampData(cat, "social");
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
                                  getCampData(cat, "native");
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
                                  getCampData(cat, "popup");
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
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By {status} Status</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr" style={{ height: "300px", "overflow-y": "scroll" }}>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData(cat, adtype, 0);
                                  setStatus("All");
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
                                  let adt = getStatusType();
                                  getCampData(cat, adtype, 1);
                                  setStatus("Inreview");
                                }}
                              >
                                <span>InReview</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  let adt = getStatusType();
                                  getCampData(cat, adtype, 2);
                                  setStatus("Active");
                                }}
                              >
                                <span>Active</span>
                              </DropdownItem>
                            </li>

                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData(cat, adtype, 4);
                                  setStatus("Paused");
                                }}
                              >
                                <span>Paused</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData(cat, adtype, 5);
                                  setStatus("OnHold");
                                }}
                              >
                                <span>OnHold</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getCampData(cat, adtype, 6);
                                  setStatus("Suspended");
                                }}
                              >
                                <span>Suspend</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    {/* <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By Operator {usertype}</span>
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
                                    setUsertype('');
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
                                  let udt = getUType()
                                  getCampData(cat,adtype,status,0);
                                  setUsertype('Client');
                              }}
                               
                              >
                                <span>Client</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  let udt = getUType()
                                  getCampData(cat,adtype,status,1);
                                  setUsertype('Inhouse');
                              }}
                              
                              >
                                <span>Inhouse</span>
                              </DropdownItem>
                            </li>
                            
                            
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li> */}
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
                    {/* <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-control-sm custom-checkbox notext">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="pid-all"
                          checked={chkAll} 
                          onChange={(e) => 
                            {
                              let cdt = [];
                              if(e.target.checked === true) {
                                data.map((item) => {
                                  // console.log(item.campaign_id);
                                  cdt.push(item.campaign_id);
                                });
                                setChk(cdt);
                                // setChkAll(true)
                              } else {
                                setChk([])
                                // setChkAll(false)
                              }
                              setChkAll(!chkAll)
                            }
                          }
                        />
                        <label className="custom-control-label" htmlFor="pid-all"></label>
                      </div>
                    </DataTableRow> */}

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
                    {/* <DataTableRow className="nk-tb-col-tools text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="btn btn-xs btn-trigger btn-icon dropdown-toggle mr-n1">
                          <Icon name="more-h"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li onClick={() => updateAllRows('active')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="play"></Icon>
                                <span>Active All</span>
                              </DropdownItem>
                            </li>
                            <li onClick={() => updateAllRows('pause')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="pause"></Icon>
                                <span>Pause All</span>
                              </DropdownItem>
                            </li>
                            <li onClick={() => updateAllRows('inreview')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="icon ni ni-icon ni ni-eye"></Icon>
                                <span>Inreview All</span>
                              </DropdownItem>
                            </li>

                            <li onClick={() => updateAllRows('inactive')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="icon ni ni-icon ni ni-cross-round"></Icon>
                                <span>Inactive All</span>
                              </DropdownItem>
                            </li>
                            <li onClick={() => updateAllRows('hold')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="icon ni ni-icon ni ni-alert-circle-fill"></Icon>
                                <span>Hold All</span>
                              </DropdownItem>
                            </li>
                            <li onClick={() => updateAllRows('suspend')}>
                              <DropdownItem
                                tag="a"
                                href="#markasdone"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="icon ni ni-icon ni ni-na"></Icon>
                                <span>Suspend All</span>
                              </DropdownItem>
                            </li>
                            <li onClick={() => updateAllRows('delete')}>
                              <DropdownItem
                                tag="a"
                                href="#remove"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                <Icon name="trash"></Icon>
                                <span>Delete All </span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </DataTableRow> */}
                  </DataTableHead>
                  {input.length
                    ? // sortd.map((item,i)=> <li>{item.campaign_name}</li>)
                      sortd.map((item) => {
                        let chkSts = chk.indexOf(item.campaign_id) >= 0 ? true : false;
                        return (
                          <DataTableItem key={item.campaign_id}>
                            {/* <DataTableRow className="nk-tb-col-check">
          <div className="custom-control custom-control-sm custom-checkbox notext">
            <input
              type="checkbox"
              className="custom-control-input form-control"
              defaultChecked={chkSts}
              id={item.campaign_id + "pid-all"}
              key={Math.random()}
              onChange={(e) => {
                if(e.target.checked === true) {
                  setCheckBox(item.campaign_id);
                } else {
                  unsetCheckBox(item.campaign_id);
                }
                  // onSelectChange(e, item.campaign_id)
                }
              }
            />
            <label className="custom-control-label" htmlFor={item.campaign_id + "pid-all"}></label>
          </div>
        </DataTableRow> */}

                            <DataTableRow>
                              <div className="user-info">
                                <Link
                                  to={`${process.env.PUBLIC_URL}/campaign-details/${btoa(item.campaign_id)}`}
                                  title="Campaign detail"
                                >
                                  <span className="tb-lead">{item.campaign_name} </span>
                                  <span>{item.campaign_id}</span>
                                </Link>
                              </div>
                            </DataTableRow>

                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.name} </span>
                                <span>{item.advertiser_code}</span>
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
                                <span>{item.campaign_type}</span>
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
                              <span>{item.created_at}</span>
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
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonText: "Yes, delete it!",
                                              }).then((result) => {
                                                if (result.isConfirmed) {
                                                  deleteProduct(item.campaign_id);
                                                }
                                              });
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Campaign</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          {item.status === 2 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 0);
                                                }}
                                              >
                                                <Icon name="icon ni ni-property-remove"></Icon>
                                                <span>Incomplete</span>
                                              </DropdownItem>

                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 1);
                                                }}
                                              >
                                                <Icon name="icon ni ni-eye"></Icon>
                                                <span>Inreview</span>
                                              </DropdownItem>

                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 4);
                                                }}
                                              >
                                                <Icon name="pause"></Icon>
                                                <span>Paused</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 5);
                                                }}
                                              >
                                                <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                                <span>Hold</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
                                              <Link
                                                to={`${process.env.PUBLIC_URL}/add-impression/${btoa(
                                                  item.campaign_id
                                                )}`}
                                              >
                                                <Icon name="icon ni ni-property-add"></Icon>
                                                <span> Add Impression </span>
                                              </Link>
                                            </li>
                                          ) : item.status === 1 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 5);
                                                }}
                                              >
                                                <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                                <span>Hold</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
                                            </li>
                                          ) : (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                            </li>
                                          )}
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
                    : data.length > 0
                    ? data.map((item) => {
                        let chkSts = chk.indexOf(item.campaign_id) >= 0 ? true : false;
                        return (
                          <DataTableItem key={item.campaign_id}>
                            {/* <DataTableRow className="nk-tb-col-check">
            <div className="custom-control custom-control-sm custom-checkbox notext">
              <input
                type="checkbox"
                className="custom-control-input form-control"
                defaultChecked={chkSts}
                id={item.campaign_id + "pid-all"}
                key={Math.random()}
                onChange={(e) => {
                  if(e.target.checked === true) {
                    setCheckBox(item.campaign_id);
                  } else {
                    unsetCheckBox(item.campaign_id);
                  }
                    // onSelectChange(e, item.campaign_id)
                  }
                }
              />
              <label className="custom-control-label" htmlFor={item.campaign_id + "pid-all"}></label>
            </div>
          </DataTableRow> */}

                            <DataTableRow>
                              <div className="user-info">
                                <Link
                                  to={`${process.env.PUBLIC_URL}/campaign-details/${btoa(item.campaign_id)}`}
                                  title="Campaign detail"
                                >
                                  <span className="tb-lead">{item.campaign_name} </span>
                                  <span>{item.campaign_id}</span>
                                </Link>
                              </div>
                            </DataTableRow>

                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.name} </span> <span>{item.advertiser_code}</span>
                                {/* <DropdownItem
                tag="a"
                href="#dropdownitem"
                onClick={(ev) => {
                  ev.preventDefault();
                  loginuser(item.advertiser_code)
                }}
                >
              <span>{item.advertiser_code}</span>
              </DropdownItem> */}
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
                                          {item.status === 2 ? (
                                            <li>
                                              {/* <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 0);
                                                }}
                                              >
                                                <Icon name="icon ni ni-property-remove"></Icon>
                                                <span>Incomplete</span>
                                              </DropdownItem> */}

                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 1);
                                                }}
                                              >
                                                <Icon name="icon ni ni-eye"></Icon>
                                                <span>Inreview</span>
                                              </DropdownItem>

                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 4);
                                                }}
                                              >
                                                <Icon name="pause"></Icon>
                                                <span>Paused</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 5);
                                                }}
                                              >
                                                <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                                <span>Hold</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
                                              <Link
                                                to={`${process.env.PUBLIC_URL}/add-impression/${btoa(
                                                  item.campaign_id
                                                )}`}
                                              >
                                                <Icon name="icon ni ni-property-add"></Icon>
                                                <span> Add Impression </span>
                                              </Link>
                                            </li>
                                          ) : item.status === 1 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 5);
                                                }}
                                              >
                                                <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                                <span>Hold</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
                                            </li>
                                          ) : item.status === 4 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                              <Link
                                                to={`${process.env.PUBLIC_URL}/add-impression/${btoa(
                                                  item.campaign_id
                                                )}`}
                                              >
                                                <Icon name="icon ni ni-property-add"></Icon>
                                                <span> Add Impression </span>
                                              </Link>
                                              
                                            </li>
                                          ) : item.status === 5 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
                                              
                                              
                                            </li>
                                          ) : (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateCamp(item.campaign_id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>
                                            </li>
                                          )}
                                        </li>
                                        {/* <li>
                                          <Link
                                            to={
                                              `${process.env.PUBLIC_URL}/update-campaign/` +
                                              item.ad_type +
                                              "/" +
                                              item.campaign_id
                                            }
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit</span>
                                          </Link>
                                        </li> */}
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonText: "Yes, delete it!",
                                              }).then((result) => {
                                                if (result.isConfirmed) {
                                                  deleteProduct(item.campaign_id);
                                                }
                                              });
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Campaign</span>
                                          </DropdownItem>
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
                                let std = getStatusType();
                                getCampData(cat, adt, std, 1, 10);
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
                                let std = getStatusType();
                                getCampData(cat, adt, std, 1, 20);
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
                                let std = getStatusType();
                                getCampData(cat, adt, std, 1, 50);
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
                                let std = getStatusType();
                                getCampData(cat, adt, std, 1, 100);
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
                                let std = getStatusType();
                                getCampData(cat, adt, std, 1, 500);
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

export default CampaignList;
