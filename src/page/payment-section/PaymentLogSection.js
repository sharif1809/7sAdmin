import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
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
  Row,
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
import { allTransactionList, transactionAproved, transactionViews } from "../../app/api";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import * as moment from "moment";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
const PaymentLogSection = () => {
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  const [data, setData] = useState("");
  const [data1, setData1] = useState("");
  const [modal, setModal] = useState(false);
  const [errorList, setError] = useState([]);
  const [formData, setFormData] = useState({
    ip_addr: "",
    desc: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      ip_addr: "",
      desc: "",
      errorList: [],
    });
  };

  /* Pagination  */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  const [pgs, setPgs] = useState(0);

  /* Get Bitcoin QR List ! */
  const getNotice = async (pg = 1, lim = 0, src = "") => {
    setLoading(true);
    console.log(getDate(rangeDate.start));
    let itemLim = lim > 0 ? lim : itemPerPage;
    const res = await allTransactionList(pg, itemLim, src, rangeDate.start, rangeDate.end);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };

  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const getDate = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const d = newDate.getDate();

    return `${year}-${month.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
  };

  const onFilterChange = (val) => {
    //  let hhh =  setSearchText(e.target.value);
    getNotice("", "", val);
  };

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };
  const onReportSearch = async () => {
    getNotice();
  };

  const [transdetail, setTransactionDetail] = useState("");
  const transactionViewDeatils = async (transactionid) => {
    setLoading(true);
    const res = await transactionViews(transactionid);
    //   console.log(res);
    if (res.data) {
      setTransactionDetail(res.data);
      setData1(res.data1);
    }
    setLoading(false);
  };

  const approvedTransaction = async (txnid, uid) => {
    setLoading(true);
    const res = await transactionAproved(txnid, uid);
    if (res.code === 200) {
      toast.success("Transaction approved successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getNotice(currentPage);
      setLoading(false);
      setModal({ transactionView: false });
      setModal({ transactionRemark: false });
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

  const onFormCancel = () => {
    setModal({ transactionView: false });
    setModal({ transactionRemark: false });
    resetForm();
  };

  /* ###### Pagination Section    ##### */
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getNotice(pageNumber);
    }
  };
  useEffect(() => {
    getNotice();
  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Transaction History"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Transaction History </BlockTitle>
              <BlockDes className="text-soft">You have total {pgs} Transaction History </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    
                  </ul>
                </div>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right"></div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search Name, UID & Transaction ID"
                          // onChange={(e) => setFormData({ ...formData, search: e.target.value })}
                          onChange={(e) => {
                            // console.log(e.target.value);
                            onFilterChange(e.target.value);
                          }}
                        />
                      </div>
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
                  <span className="sub-text">Date</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Payment Mode</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Screen Shot</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">User ID</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Transaction ID</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">Bill Amount</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Coupon Amount</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Status</span>
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
                          <div className="tb-product">
                            <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            <span className={`badge badge-dim badge-danger`}>
                              <span>{item.payment_mode}</span>
                            </span>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            {item.screenshot ? (
                              <span className="title">
                                <a
                                  href={`https://services.7searchppc.com/public/images/bitcoin/${item.screenshot}`}
                                  target="_blank"
                                >
                                  {" "}
                                  View{" "}
                                </a>
                              </span>
                            ) : (
                              <span className={`badge badge-dim badge-success`}>
                                <span>N/A</span>
                              </span>
                            )}
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            <span className="title">{item.advertiser_code}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            <span className="title">{item.transaction_id}</span>
                          </div>
                        </DataTableRow>

                        <DataTableRow>
                          <div className="tb-product">
                            <span className="title">{item.amount}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            {/* <span className="title">{item.cpn_amt}</span> */}
                            {/* {item.cpn_amt === 0 && (
                              <span className={`badge badge-dim badge-danger`}>
                                <span>Not Applied </span>
                              </span>
                            )}
                            {item.cpn_amt != 0 && <span>{item.cpn_amt}</span>} */}
                            {item.cpn_amt === 0 ? (
                              <span className={`badge badge-dim badge-danger`}>
                                <span>Not Applied </span>
                              </span>
                            ) : item.cpn_amt == null ? (
                              <span className={`badge badge-dim badge-danger`}>
                                <span>Not Applied </span>
                              </span>
                            ) : item.cpn_amt }
                            
                          </div>
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.status === 0 && (
                            <span className={`badge badge-dim badge-warning`}>
                              <span>Pending</span>
                            </span>
                          )}
                          {item.status === 1 && (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Success</span>
                            </span>
                          )}
                          {item.status === 2 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Failed</span>
                            </span>
                          )}
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools text-right">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    {item.status === 0 ? (
                                      <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#markasdone"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            transactionViewDeatils(item.transaction_id);
                                            setModal({ transactionRemark: true });
                                          }}
                                        >
                                          <Icon name="done"></Icon>
                                          <span>Approved </span>
                                        </DropdownItem>
                                      </li>
                                    ) : (
                                      // : item.status === 2 ? (
                                      //   <li>
                                      //     <DropdownItem
                                      //       tag="a"
                                      //       href="#markasdone"
                                      //       onClick={(ev) => {
                                      //         ev.preventDefault();
                                      //         transactionViewDeatils(item.transaction_id);
                                      //         setModal({ transactionRemark: true });
                                      //       }}
                                      //     >
                                      //       <Icon name="done"></Icon>
                                      //       <span>Approved </span>
                                      //     </DropdownItem>
                                      //   </li>)
                                      <li> </li>
                                    )}
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#markasdone"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          transactionViewDeatils(item.transaction_id);
                                          setModal({ transactionView: true });
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span> View Details </span>
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
                    <span className="text-silent">No Transaction List .. </span>
                  </div>
                )}
              </div>
              <div style={{ alignSelf: "end" }}>
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="dropdown-toggle bg-white btn btn-sm btn-outline-light btn-icon">
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
                            getNotice(1, 10);
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
                            getNotice(1, 20);
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
                            getNotice(1, 50);
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
                            getNotice(1, 100);
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
                            getNotice(1, 500);
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
          </DataTable>
        </Block>
        <Modal
          isOpen={modal.transactionView}
          toggle={() => setModal({ transactionView: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            {/* <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a> */}
            <Link to="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                  setModal(false);
                }}
              ></Icon>
            </Link>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Transaction View <small className="text-primary"> #{transdetail.transaction_id} </small>
              </h4>
              <hr />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={4}>
                  <span className="sub-text">Advertiser Code</span>
                  <span className="caption-text">{transdetail.advertiser_code}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Payment ID</span>

                  <span className="caption-text">{transdetail.payment_id}</span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Payment Mode</span>
                  <span className={`badge badge-dim badge-danger`}>
                    <span>{transdetail.payment_mode}</span>
                  </span>
                </Col>
                {/* <Col lg={4}>
                  <span className="sub-text">Fees </span>
                  <span className="caption-text"> { transdetail.fees_tax } </span>
                </Col> */}
                <Col lg={4}>
                  <span className="sub-text">Fee</span>
                  <span className="caption-text"> {transdetail.fee ? transdetail.fee : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text"> GST </span>
                  <span className="caption-text"> {transdetail.gst ? transdetail.gst : "N/A"} </span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Payable Amount</span>
                  <span className="caption-text"> {transdetail.payble_amt} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Amount</span>
                  <span className="caption-text"> {transdetail.amount} </span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Coupon ID </span>
                  <span className="caption-text"> {transdetail.cpn_id ? transdetail.cpn_id : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text"> Coupon Code </span>
                  <span className="caption-text"> {transdetail.cpn_code ? transdetail.cpn_code : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Coupon Amount </span>
                  <span className="caption-text"> {transdetail.cpn_amt ? transdetail.cpn_amt : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Status </span>
                  {transdetail.status === 0 && (
                    <span className={`badge badge-dim badge-warning`}>
                      <span>Pending</span>
                    </span>
                  )}
                  {transdetail.status === 1 && (
                    <span className={`badge badge-dim badge-success`}>
                      <span>Success</span>
                    </span>
                  )}
                  {transdetail.status === 2 && (
                    <span className={`badge badge-dim badge-danger`}>
                      <span>Failed</span>
                    </span>
                  )}
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Created At </span>
                  <span className="caption-text"> {moment(transdetail.created_at).format("DD-MM-YYYY")} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">GST No. </span>
                  <span className="caption-text"> {transdetail.gst_no ? transdetail.gst_no : "N/A"} </span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Remark </span>
                  <span className="caption-text"> {transdetail.remark ? transdetail.remark : "N/A"} </span>
                </Col>
              </Row>
              {transdetail.status === 1 ? (
                <Row className="gy-3">
                  <Col lg={12}>
                    <DataTable className="card-stretch">
                      <DataTableBody>
                        <DataTableHead className="nk-tb-item nk-tb-head">
                          <DataTableRow size="lg">
                            <span className="sub-text">Pay Type </span>
                          </DataTableRow>
                          <DataTableRow size="lg">
                            <span className="sub-text">Amount </span>
                          </DataTableRow>

                          <DataTableRow size="lg">
                            <span className="sub-text">Remark</span>
                          </DataTableRow>
                        </DataTableHead>
                        {data1.length > 0
                          ? data1.map((itemd) => {
                              return (
                                <DataTableItem key={itemd.id}>
                                  <DataTableRow>
                                    <div className="lg">
                                      <span className="tb-lead"> {itemd.pay_type} </span>
                                    </div>
                                  </DataTableRow>
                                  <DataTableRow>
                                    <div className="user-info">
                                      <span className="tb-lead"> {itemd.amount}</span>
                                    </div>
                                  </DataTableRow>
                                  <DataTableRow>
                                    <div className="lg">
                                      <span className="tb-lead"> {itemd.remark}</span>
                                    </div>
                                  </DataTableRow>
                                </DataTableItem>
                              );
                            })
                          : null}
                      </DataTableBody>
                      {/* <div className="card-inner">
                {data1.length > 0 ? (
                null
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No notification found</span>
                  </div>
                )}
              </div> */}
                    </DataTable>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={modal.transactionRemark}
          toggle={() => setModal({ transactionRemark: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            {/* <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a> */}
            <Link to="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                  setModal(false);
                }}
              ></Icon>
            </Link>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Transaction View <small className="text-primary"> #{transdetail.transaction_id} </small>
              </h4>
              <hr />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={4}>
                  <span className="sub-text">Advertiser Code</span>
                  <span className="caption-text">{transdetail.advertiser_code}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Payment ID</span>

                  <span className="caption-text">{transdetail.payment_id}</span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Payment Mode</span>
                  <span className={`badge badge-dim badge-danger`}>
                    <span>{transdetail.payment_mode}</span>
                  </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Fee</span>
                  <span className="caption-text"> {transdetail.fee ? transdetail.fee : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text"> GST </span>
                  <span className="caption-text"> {transdetail.gst ? transdetail.gst : "N/A"} </span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Payable Amount</span>
                  <span className="caption-text"> {transdetail.payble_amt ? transdetail.payble_amt : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Amount</span>
                  <span className="caption-text"> {transdetail.amount ? transdetail.amount : "N/A"} </span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Coupon ID </span>
                  <span className="caption-text"> {transdetail.cpn_id ? transdetail.cpn_id : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text"> Coupon Code </span>
                  <span className="caption-text"> {transdetail.cpn_code ? transdetail.cpn_code : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Coupon Amount </span>
                  <span className="caption-text"> {transdetail.cpn_amt ? transdetail.cpn_amt : "N/A"} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Status </span>
                  {transdetail.status === 0 && (
                    <span className={`badge badge-dim badge-warning`}>
                      <span>Pending</span>
                    </span>
                  )}
                  {transdetail.status === 1 && (
                    <span className={`badge badge-dim badge-success`}>
                      <span>Success</span>
                    </span>
                  )}
                  {transdetail.status === 2 && (
                    <span className={`badge badge-dim badge-danger`}>
                      <span>Failed</span>
                    </span>
                  )}
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Created At </span>
                  <span className="caption-text"> {moment(transdetail.created_at).format("DD-MM-YYYY")} </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">GST No. </span>
                  <span className="caption-text"> {transdetail.gst_no ? transdetail.gst_no : "N/A"} </span>
                </Col>
                <Col lg={12}>
                  <span className="sub-text">Remark </span>
                  <span className="caption-text"> {transdetail.remark ? transdetail.remark : "N/A"} </span>
                </Col>
              </Row>
              <Row className="gy-3">
                <Col size="12">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    <li>
                      <Button
                        color="primary"
                        size="md"
                        onClick={(ev) => {
                          ev.preventDefault();
                          approvedTransaction(transdetail.transaction_id, transdetail.advertiser_code);
                        }}
                      >
                        Approved Transaction
                      </Button>
                    </li>
                  </ul>
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

export default PaymentLogSection;
