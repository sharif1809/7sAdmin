import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";
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
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Button,
  Modal,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import { getTransactionUserInfo, transactionReport, transactionReportImportExcelReport } from "../../app/api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
import * as moment from "moment";
import exportFromJSON from "export-from-json";
import DatePicker from "react-datepicker";

const PaymentDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);

  const [modal, setModal] = useState({
    userinfo: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(20);
  const [methodtype, setMethodtype] = useState("");

  const getMethodType = () => {
    let mdt = "";
    if (methodtype == "Stripe") {
      mdt = "stripe";
    } else if (methodtype == "Bitcoin") {
      mdt = "bitcoin";
    } else if (methodtype == "Paypal") {
      mdt = "paypal";
    } else if (methodtype == "Paytm") {
      mdt = "paytm";
    } else if (methodtype == "Payu") {
      mdt = "payu";
    }
    return mdt;
  };

  // Changing state value when searching name
  const getReport = async (type = "", pg = 1, src = "") => {
    setLoading(true);
    const res = await transactionReport(type, pg, itemPerPage, src, rangeDate.start, rangeDate.end);
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
    getReport(methodtype);
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [userdetail, setUserDetail] = useState("");
  const getUserInfo = async (uid) => {
    setLoading(true);
    const res = await getTransactionUserInfo(uid);
    if (res.data) {
      setUserDetail(res.data);
    }
    setLoading(false);
  };

  const onFilterChange = (val) => {
    getReport("", "", val);
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ ipinfo: false });
    // resetForm();
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let mdt = getMethodType();
      getReport(mdt, pageNumber);
    }
  };

  const exportExcel = async () => {
    setLoading(true);
    const res = await transactionReportImportExcelReport(rangeDate.start, rangeDate.end);
    setLoading(false);
    // console.log(res.data);

    const data = res.data;
    const fileName = "PaymentReport";
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };
  useEffect(() => {
    getReport();
  }, []);

  return (
    <React.Fragment>
      <Head title="Payment Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>All Transactions List</BlockTitle>

              <BlockDes className="text-soft">You have total {pgs} transactions</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right"></div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search TxID, UID & Email"
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
                          <span>Filtered By {methodtype}</span>
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
                                  getReport();
                                  setMethodtype("");
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
                                  //getReport('stripe')
                                  setMethodtype("Stripe");
                                }}
                              >
                                <span>Stripe</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  //getReport('bitcoin')
                                  setMethodtype("Bitcoin");
                                }}
                              >
                                <span>Bitcoin</span>
                              </DropdownItem>
                            </li>

                            {/* <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getReport('paypal')
                                  setMethodtype('Paypal')
                                }}
                              >
                                <span>Paypal</span>
                              </DropdownItem>
                            </li>

                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getReport('paytm')
                                  setMethodtype('Paytm')
                                }}
                              >
                                <span>Paytm</span>
                              </DropdownItem>
                            </li> */}

                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  //getReport('payu')
                                  setMethodtype("Payu");
                                }}
                              >
                                <span>Payu</span>
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

                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right"></div>
                        <Button color="secondary" onClick={exportExcel}>
                          <Icon name="download"></Icon>
                        </Button>
                      </div>
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
                      <span className="sub-text">Advertisers</span>
                    </DataTableRow>
                    {/* <DataTableRow size="lg">
                    <span className="sub-text">Category</span>
                    </DataTableRow> */}
                    <DataTableRow size="lg">
                      <span className="sub-text">Payment Method</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Payment ID</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="sub-text">Amount</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="sub-text">Remark</span>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <span className="sub-text">Transaction ID</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="sub-text">Pay Type</span>
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
                          <DataTableItem key={item.id}>
                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.email} </span>
                                <span>{item.advertiser_code}</span>
                              </div>
                            </DataTableRow>
                            {/* <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}><span>{item.cat_name}</span></span>
                            </DataTableRow> */}

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>
                                <span>{item.payment_mode}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.payment_id == 0 ? "Direct" : item.payment_id}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>
                                <span>${item.amount}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span>{item.remark}</span>
                              
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-product">
                                <span className="title">{item.transaction_id}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="md">
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
                                <span
                                  className={`badge badge-sm badge-dim badge-outline-danger d-none d-md-inline-flex`}
                                >
                                  <span>
                                    <em class="icon ni ni-arrow-up-right"></em> Debit
                                  </span>
                                </span>
                              )}
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                            </DataTableRow>

                            <DataTableRow className="nk-tb-col-tools text-right">
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
                                          <DropdownItem
                                            tag="a"
                                            href="#modal"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              getUserInfo(item.advertiser_code);
                                              setModal({ userinfo: true });
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>View User Info</span>
                                          </DropdownItem>
                                        </li>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/transactions-view/${btoa(
                                            item.transaction_id
                                          )}`}
                                        >
                                          <Icon name="file-text"></Icon>
                                          <span> Generate Invoice </span>
                                        </Link>
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
                      <span className="text-silent">No Payment found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        <Modal
          isOpen={modal.userinfo}
          toggle={() => setModal({ userinfo: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Advertiser <small className="text-primary">#{userdetail.uid}</small>
              </h4>
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">First Name</span>
                  <span className="caption-text">{userdetail.first_name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Last Name</span>
                  <span className="caption-text">{userdetail.last_name}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Email</span>
                  <span className="caption-text"> {userdetail.email}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Contact</span>
                  <span className="caption-text"> {userdetail.phone}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Wallet</span>
                  <span className="caption-text">${userdetail.wallet}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Address</span>
                  <span className="caption-text"> {userdetail.address_line1}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">City</span>
                  <span className="caption-text"> {userdetail.city}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">State</span>
                  <span className="caption-text"> {userdetail.state}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Country</span>
                  <span className="caption-text"> {userdetail.country}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Account Status</span>
                  {userdetail.status === 0 && (
                    <span className={`badge badge-dim badge-success`}>
                      <span>Active</span>
                    </span>
                  )}
                  {userdetail.status === 1 && (
                    <span className={`badge badge-dim badge-primary`}>
                      <span>Inactive</span>
                    </span>
                  )}
                  {userdetail.status === 2 && (
                    <span className={`badge badge-dim badge-warning`}>
                      <span>Pending</span>
                    </span>
                  )}
                  {userdetail.status === 3 && (
                    <span className={`badge badge-dim badge-danger`}>
                      <span>Suspended</span>
                    </span>
                  )}
                  {userdetail.status === 4 && (
                    <span className={`badge badge-dim badge-info`}>
                      <span>Hold</span>
                    </span>
                  )}
                </Col>

                <Col lg={6}>
                  <span className="sub-text">User Type</span>
                  {userdetail.user_type === 1 ? (
                    <span className={`badge badge-dim badge-dark`}>Advertiser</span>
                  ) : userdetail.user_type === 2 ? (
                    <span className={`badge badge-dim badge-primary`}>Publisher</span>
                  ) : userdetail.user_type === 3 ? (
                    <span className={`badge badge-dim badge-danger`}>Both</span>
                  ) : (
                    "--"
                  )}
                </Col>

                <Col lg={6}>
                  <span className="sub-text">Account Type</span>
                  {userdetail.account_type === 0 && (
                    <span className={`badge badge-dim badge-success`}>
                      <span>Client</span>
                    </span>
                  )}
                  {userdetail.account_type === 1 && (
                    <span className={`badge badge-dim badge-primary`}>
                      <span>Inhouse</span>
                    </span>
                  )}
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default PaymentDetail;
