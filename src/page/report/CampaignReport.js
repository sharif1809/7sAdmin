import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  FormGroup,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Badge,
  Input,
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Col,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import {
  campaignImportExcelReportGet,
  campaignReportGet,
  getCmpListCategoryList,
  impCmpReportExcel,
} from "../../app/api";
import Moment from "react-moment";
import * as moment from "moment";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import exportFromJSON from "export-from-json";
import DatePicker from "react-datepicker";

const CampList = () => {
  const [loading, setLoading] = useState(false);
  const [notichk, setNotiChk] = useState(false);
  const [sm, updateSm] = useState(false);
  const [data, setData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(20);
  const [statustype, setStatustype] = useState("");
  const [campType, setCampType] = useState("");
  const [stats, setStatus] = useState("");
  const [pgs, setPgs] = useState(0);

  const getCampType = () => {
    let adt = "";
    if (campType == "text") {
      adt = "text";
    } else if (campType == "banner") {
      adt = "banner";
    } else if (campType == "video") {
      adt = "video";
    } else if (campType == "native") {
      adt = "native";
    } else if (campType == "social") {
      adt = "social";
    } else if (campType == "popup") {
      adt = "popup";
    }

    return adt;
  };

  const getStatusType = () => {
    let std = "";
    if (stats == "1") {
      std = 1;
    } else if (stats == "2") {
      std = 2;
    } else if (stats == "3") {
      std = 3;
    } else if (stats == "4") {
      std = 4;
    } else if (stats == "5") {
      std = 5;
    } else if (stats == "6") {
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

  // Get Campaign List
  const getAdminCampList = async (cat, camptype = "", stats, pg = 1, src = "") => {
    // console.log(getDate(rangeDate.start))
    // console.log(getDate(rangeDate.end))
    setLoading(true);
    let cpe = camptype != 1 ? camptype : getCampType();
    const res = await campaignReportGet(
      cat,
      cpe,
      stats,
      pg,
      itemPerPage,
      src,
      getDate(rangeDate.start),
      getDate(rangeDate.end)
    );
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };

  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 60)),
    end: new Date(),
  });
  const getDate = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const d = newDate.getDate();

    return `${year}-${month.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
  };

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const onReportSearch = async () => {
    getAdminCampList(cat, campType, stats);
  };

  // onChange function for searching name
  const onFilterChange = (val) => {
    //  let hhh =  setSearchText(e.target.value);
    getAdminCampList("", "", "", "", val);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let std = getStatusType();
      let adt = getCampType();
      getAdminCampList(adt, std, pageNumber);
    }
  };
  const exportExcel = async () => {
    setLoading(true);
    const res = await campaignImportExcelReportGet(getDate(rangeDate.start), getDate(rangeDate.end));
    setLoading(false);
    console.log(res.data);

    const data = res.data;
    const fileName = "report";
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  useEffect(() => {
    setNotiChk(false);
    getAdminCampList();
    getCategory();
  }, []);

  return (
    <React.Fragment>
      <Head title="Campaign Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Campaign Report List</BlockTitle>
              {/* <BlockDes className="text-soft">You have total {data.length}  Campaign </BlockDes> */}
              <BlockDes className="text-soft">You have total {pgs} Campaign </BlockDes>
            </BlockHeadContent>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right"></div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search CampName, ID & UI"
                          // onChange={(e) => setFormData({ ...formData, search: e.target.value })}
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
                          <span>Filtered By {campType} Ads</span>
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
                                  // getAdminCampList();
                                  setCampType("");
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
                                  // getAdminCampList("text");
                                  setCampType("text");
                                }}
                              >
                                <span>Text Ads</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList("banner");
                                  setCampType("banner");
                                }}
                              >
                                <span>Banner Ads</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList("video");
                                  setCampType("video");
                                }}
                              >
                                <span>Video Ads</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList("native");
                                  setCampType("native");
                                }}
                              >
                                <span>Native Ads</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList("social");
                                  setCampType("social");
                                }}
                              >
                                <span>Social Ads</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList("popup");
                                  setCampType("popup");
                                }}
                              >
                                <span>Popunder Ads</span>
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
                          <span>
                            Filtered By{" "}
                            {stats == 1
                              ? "Inreview"
                              : stats == 2
                              ? "Active"
                              : stats == 3
                              ? "Inactive"
                              : stats == 4
                              ? "Paused"
                              : stats == 5
                              ? "Onhold"
                              : stats == 6
                              ? "Suspended"
                              : ""}{" "}
                            Status
                          </span>
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
                                  // getAdminCampList();
                                  setStatus("");
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
                                  // getAdminCampList(campType, 1);
                                  setStatus("1");
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
                                  // getAdminCampList(campType, 2);
                                  setStatus("2");
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
                                  // getAdminCampList(campType, 3);
                                  setStatus("3");
                                }}
                              >
                                <span>InActive</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminCampList(campType, 4);
                                  setStatus("4");
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
                                  // getAdminCampList(campType, 5);
                                  setStatus("5");
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
                                  // getAdminCampList(campType, 6);
                                  setStatus("6");
                                }}
                              >
                                <span>Suspended</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li>
                      <div style={{ position: "relative" }}>
                        <DatePicker
                          selected={rangeDate.start}
                          startDate={rangeDate.start}
                          onChange={onRangeChange}
                          endDate={rangeDate.end}
                          maxDate={new Date()}
                          selectsRange
                          className="form-control date-picker"
                          dateFormat="dd-M-yyyy"
                        />
                      </div>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button color="primary" onClick={onReportSearch}>
                        <Icon name="search"></Icon>
                        <span>Search</span>
                      </Button>
                    </li>
                    <Button color="secondary" onClick={exportExcel}>
                      <Icon name="download"></Icon>
                    </Button>
                    {/* <Button
                      color="primary"
                      onClick={(ev) => {
                        ev.preventDefault();
                        exportExcel(getDate(rangeDate.start), getDate(rangeDate.end));
                      }}
                    >
                      <Icon name="download"></Icon>
                      <span>Excel</span>
                    </Button> */}
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow size="lg">
                  <span className="sub-text">Campaign Name </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Advertisers</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Website Category</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Operator</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Impressions </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Clicks </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Ad Type </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Status </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Spent Amount </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Deleted </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Created on </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Action </span>
                </DataTableRow>
              </DataTableHead>
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="user-info">
                            <Link
                              to={`${process.env.PUBLIC_URL}/cmp-imp-report/${btoa(item.campaign_id)}`}
                              title="Campaign Report"
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
                        <DataTableRow>
                          <div className="user-info">
                            <span className={`badge badge-dim badge-dark`}>{item.cat_name}</span>
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
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <Link
                            to={`${process.env.PUBLIC_URL}/cmp-imp-detail/${btoa(item.campaign_id)}`}
                            title="Impression Detail"
                          >
                            <span>{item.imprs}</span>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <Link
                            to={`${process.env.PUBLIC_URL}/cmp-click-detail/${btoa(item.campaign_id)}`}
                            title="Click Detail"
                          >
                            <span>{item.click}</span>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          {item.ad_type === "text" && (
                            <Badge pill color="primary">
                              Text Ad
                            </Badge>
                          )}
                          {item.ad_type === "banner" && (
                            <Badge pill color="warning">
                              Banner Ad{" "}
                            </Badge>
                          )}
                          {item.ad_type === "video" && (
                            <Badge pill color="danger">
                              Video Ad
                            </Badge>
                          )}
                          {item.ad_type === "native" && (
                            <Badge pill color="info">
                              Native Ad
                            </Badge>
                          )}
                          {item.ad_type === "social" && (
                            <Badge pill color="success">
                              Social Ad
                            </Badge>
                          )}
                          {item.ad_type === "popup" && (
                            <Badge pill color="dark">
                              Popunder Ad
                            </Badge>
                          )}
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.status === 0 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Incomplete</span>
                            </span>
                          )}
                          {item.status === 1 && (
                            <span className={`badge badge-dim badge-primary`}>
                              <span>InReview</span>
                            </span>
                          )}
                          {item.status === 2 && (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Active</span>
                            </span>
                          )}
                          {item.status === 3 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>InActive</span>
                            </span>
                          )}
                          {item.status === 4 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Paused</span>
                            </span>
                          )}
                          {item.status === 5 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>OnHold</span>
                            </span>
                          )}
                          {item.status === 6 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Suspended </span>
                            </span>
                          )}
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-product">
                            <span className="title">${item.totalamt}</span>
                          </span>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <span>
                            {item.trash === 0 && (
                              <Badge pill color="success">
                                Not Deleted
                              </Badge>
                            )}
                          </span>
                          <span>
                            {item.trash === 1 && (
                              <Badge pill color="danger">
                                Deleted
                              </Badge>
                            )}
                          </span>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                        </DataTableRow>

                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <Link
                            to={`${process.env.PUBLIC_URL}/cmp-imp-report/${btoa(item.campaign_id)}`}
                            title="Campaign Report"
                          >
                            <span>View report</span>
                          </Link>
                        </DataTableRow>

                        {/* <DataTableRow className="nk-tb-col-tools text-right">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateCouponStatus(item.id, 1);
                                             }}
                                             >
                                            <Icon name="eye"></Icon>
                                            <span>  View   </span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateCouponStatus(item.id, 1);
                                             }}
                                             >
                                            <Icon name="eye"></Icon>
                                            <span>  Print    </span>
                                          </DropdownItem>
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
          </DataTable>
        </Block>

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};
export default CampList;
