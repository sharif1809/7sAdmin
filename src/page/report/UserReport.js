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
import { userReportExport, userReportGet } from "../../app/api";
import Moment from "react-moment";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

const UserReportList = () => {
  const [loading, setLoading] = useState(false);
  const [notichk, setNotiChk] = useState(false);
  const [sm, updateSm] = useState(false);
  const [data, setData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [usertype, setUsertype] = useState("");
  const [acttype, setAcnttype] = useState("");

  // const [stats, setStatus] = useState('');
  const getUType = () => {
    let udt = "";
    if (acttype == "Client") {
      udt = 0;
    } else if (acttype == "Inhouse") {
      udt = 1;
    }
    return udt;
  };

  const [pgs, setPgs] = useState(0);

  const getUserType = () => {
    let adt = "";
    if (usertype == "Advertiser") {
      adt = 1;
    } else if (usertype == "Publisher") {
      adt = 2;
    } else if (usertype == "Both") {
      adt = 3;
    }

    return adt;
  };

  // Get User List
  const getAdminUserList = async (type = "", acttype, pg = 1, src = "") => {
    setLoading(true);
    //let tpe = (type != 1) ? type : getUserType();
    const res = await userReportGet(type, acttype, pg, itemPerPage, src, rangeDate.start, rangeDate.end);
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

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const onReportSearch = async () => {
    getAdminUserList(usertype,acttype);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getUserType();
      let udt = getUType();
      getAdminUserList(adt, udt, pageNumber);
    }
  };

  const onFilterChange = (val) => {
    getAdminUserList("", "", "", val);
  };

  const showAlert = async () => {
    const ress = await userReportExport();
    console.log(ress);
    if (ress.data) {
    }
  };

  useEffect(() => {
    setNotiChk(false);
    getAdminUserList();
  }, []);

  return (
    <React.Fragment>
      <Head title="User Wallet Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> User Wallet Report List</BlockTitle>
              <BlockDes className="text-soft">You have total {pgs} User </BlockDes>
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
                          placeholder="Search UID & Email"
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
                          <span>Filtered By {usertype == '1' ? 'Advertiser' : usertype == '2' ? 'Publisher' : ''}</span>
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
                                  // getAdminUserList();
                                  setUsertype("");
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
                                  // getAdminUserList(1);
                                  setUsertype("1");
                                }}
                              >
                                <span>Advertiser</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  // getAdminUserList(2);
                                  setUsertype("2");
                                }}
                              >
                                <span>Publisher</span>
                              </DropdownItem>
                            </li>
                            {/* <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    getAdminUserList(3);
                                    setUsertype("Both");
                                }}
                              >
                                <span>Both</span>
                              </DropdownItem>
                            </li> */}
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>

                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                          <span>Filtered By Operator {acttype == '0' ? 'Client' : acttype == '1' ? 'Inhouse' : ''}</span>
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
                                  // getAdminUserList();
                                  setAcnttype("");
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
                                  // let udt = getUType();
                                  // getAdminUserList(usertype, 0);
                                  setAcnttype("0");
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
                                  // let adt = getUType();
                                  // getAdminUserList(usertype, 1);
                                  setAcnttype("1");
                                }}
                              >
                                <span>Inhouse</span>
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

                    {/* <li>
                      <a
                        href="#export"
                       
                        onClick={showAlert}
                        className="btn btn-white btn-outline-light"
                      >
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </a>
                    </li> */}
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
                  <span className="sub-text"> Advertisers </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Operator</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Email </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Phone No. </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> User Type </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Status </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Wallet Amount </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Created on </span>
                </DataTableRow>
                {/* <DataTableRow className="nk-tb-col-tools">
                  <ul className="nk-tb-actions gx-1 my-n1 sm">
                    <li className="mr-n1">
                      <span>Action</span>
                    </li>
                  </ul>
                </DataTableRow> */}
              </DataTableHead>
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="user-info">
                            <span className="tb-lead">{item.name} </span>
                            <span>{item.uid}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>
                            {item.account_type === "Client" && (
                              <Badge pill color="success">
                                Client
                              </Badge>
                            )}
                          </span>
                          <span>
                            {item.account_type === "Inhouse" && (
                              <Badge pill color="info">
                                Inhouse
                              </Badge>
                            )}
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.email}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.phone}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          {item.user_type === "Advertiser" ? (
                            <span className={`badge badge-dim badge-dark`}>Advertiser</span>
                          ) : item.user_type === "Publisher" ? (
                            <span className={`badge badge-dim badge-primary`}>Publisher</span>
                          ) : item.user_type === "Both" ? (
                            <span className={`badge badge-dim badge-danger`}>Both</span>
                          ) : (
                            "--"
                          )}
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.status === 0 && (
                            <span className={`badge badge-success`}>
                              <span>Active</span>
                            </span>
                          )}
                          {item.status === 1 && (
                            <span className={`badge badge-dim badge-primary`}>
                              <span>Inactive</span>
                            </span>
                          )}
                          {item.status === 2 && (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Pending</span>
                            </span>
                          )}
                          {item.status === 3 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Suspended</span>
                            </span>
                          )}
                          {item.status === 4 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Hold</span>
                            </span>
                          )}
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-product">
                            <span className="title">${item.wallet}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.created_at}</span>
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
                  <span className="text-silent">No User found</span>
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
export default UserReportList;
