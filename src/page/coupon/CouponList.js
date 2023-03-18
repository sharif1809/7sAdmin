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
  blockIpCreate,
  blockIpStatusUpdate,
  couponCreate,
  couponDelete,
  couponGetList,
  couponStatusUpdate,
  couponupdate,
  couponUserList,
} from "../../app/api";
import * as moment from "moment";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const CouponList = () => {
  const [loading, setLoading] = useState(false);
  const [notichk, setNotiChk] = useState(false);
  const [editCoupon, setEditCoupon] = useState("");
  const [editcouponId, setEditCouponId] = useState(0);
  const [sm, updateSm] = useState(false);

  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [adv, setadv] = useState(null);
  const couponGetUserlist = async () => {
    const res = await couponUserList();
    if (res.data) {
      setadv(res.data);
    }
  };

  const deleteCoupon = async (id) => {
    setLoading(true);
    const res = await couponDelete(id);
    if (res.code === 200) {
      toast.success("Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getAdminCouponList();
      setLoading(false);
    } else {
      toast.error("Something went wrong !", {
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

  const [data, setData] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    coupon_code: "",
    coupon_type: "",
    min_bil_amt: "",
    coupon_value: "",
    max_disc: "",
    start_date: "",
    end_date: "",
  });
  const resetForm = () => {
    setFormData({
      user_id: "",
      title: "",
      coupon_code: "",
      coupon_type: "",
      min_bil_amt: "",
      coupon_value: "",
      max_disc: "",
      start_date: "",
      end_date: "",
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const filterStatusType = [
    { value: "0", label: "Deactive" },
    { value: "1", label: "Active" },
  ];

  // OnChange function to get the input data
  const onInputChange = (e) => {
    //   setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData({ ...formData, coupon_type: e.target.value });
  };

  const onChangeSelection = (e) => {
    setSelectedOption(e.target.value);
  };

  const [statustype, setStatustype] = useState("");
  const [pgs, setPgs] = useState(0);

  const getStatusType = () => {
    let adt = "";
    if (statustype == "Inactive") {
      adt = 0;
    } else if (statustype == "Active") {
      adt = 1;
    }
    return adt;
  };

  const filterCouponType = [
    { value: "Percent", label: "Percent" },
    { value: "Flat", label: "Flat" },
  ];

  // Get Coupon List

  const getAdminCouponList = async (type = "", pg = 1, src = "") => {
    setLoading(true);
    const res = await couponGetList(type, pg, itemPerPage, src);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };

  // submit function to add a new item
  const onFormSubmit = async (form) => {
    console.log(formData);
    setLoading(true);
    if (editcouponId > 0) {
      const res = await couponupdate(formData);
      if (res.code === 200) {
        toast.success(" Updated Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        getAdminCouponList();
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
    } else {
      const res = await couponCreate(formData);
      if (res.code === 200) {
        toast.success("Added Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        getAdminCouponList();
        setLoading(false);
      } else {
        toast.error( res.message, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      }
    }
    getAdminCouponList();
    resetForm();
    setModal({ add: false });
    // setFormData(false);
    setLoading(false);
  };

  const updateCouponStatus = async (id, sts) => {
    setLoading(true);
    const res = await couponStatusUpdate(id, sts);
    if (res.code === 200) {
      getAdminCouponList();
    }
    setLoading(false);
  };
  // onChange function for searching name
  const onFilterChange = (val) => {
    getAdminCouponList("", "", val);
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getStatusType();
      getAdminCouponList(adt, pageNumber);
    }
  };
  useEffect(() => {
    setNotiChk(false);
    couponGetUserlist();
    getAdminCouponList();
  }, []);

  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Coupon List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Coupon List</BlockTitle>
              <BlockDes className="text-soft">You have total {pgs} coupon</BlockDes>
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
                          placeholder="Name & ID ..."
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
                          <span>Filtered By {statustype}</span>
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
                                  getAdminCouponList();
                                  setStatustype("");
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
                                  getAdminCouponList(0);
                                  setStatustype("Inactive");
                                }}
                              >
                                <span>Inactive</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getAdminCouponList(1);
                                  setStatustype("Active");
                                }}
                              >
                                <span>Active</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li
                      className="nk-block-tools-opt"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setEditCouponId("");
                        setEditCoupon("");
                        setFormData("");
                        setModal({ add: true });
                      }}
                    >
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add New Coupon</span>
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
                  <span className="sub-text"> Coupon ID </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">No. Of Used</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Title</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> User Name </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Coupon Code </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Coupon Type </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Min Bill Amount </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Max Discount </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Start Date </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> End Date </span>
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
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.coupon_id}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <Badge pill color="success">
                            {item.cpncount}
                          </Badge>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="project-info">
                            <h6 className="title">{item.title}</h6>
                          </div>
                        </DataTableRow>

                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.users}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className={`badge badge-dim badge-dark`}>
                            <span>{item.coupon_code}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>
                            {item.coupon_type == "Flat" && (
                              <Badge pill color="primary">
                                Flat
                              </Badge>
                            )}
                            {item.coupon_type == "Percent" && (
                              <Badge pill color="info">
                                Percent
                              </Badge>
                            )}
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className="tb-product">
                            <span className="title">${item.min_bil_amt}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className="tb-product">
                            <span className="title">${item.max_disc}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span> {moment(item.start_date).format("DD-MM-YYYY")}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span> {moment(item.end_date).format("DD-MM-YYYY")}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          {/* {item.status === 0 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Expired</span>
                            </span>
                          )}
                          {item.status === 1 && (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Active</span>
                            </span>
                          )} */}

                          {item.status === 0 ? (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Expired</span>
                            </span>
                          ) : item.cpncount > 0 ? (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Expired</span>
                            </span>
                          ) : item.status === 1 ? (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Active</span>
                            </span>
                          ) : (
                            ""
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
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#editcoupon"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          //onEditClick(item.id);
                                          setEditCouponId(item.id);
                                          setEditCoupon(item);
                                          setFormData(item);

                                          if (item.users == "ALL") {
                                            setNotiChk(true);
                                          } else {
                                            setNotiChk(false);
                                          }
                                          setModal({ add: true });
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit Coupon</span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      {item.status === 1 ? (
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateCouponStatus(item.id, 0);
                                            }}
                                          >
                                            <Icon name="icon ni ni-cross-round"></Icon>
                                            <span>Inactive</span>
                                          </DropdownItem>
                                        </li>
                                      ) : (
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateCouponStatus(item.id, 1);
                                            }}
                                          >
                                            <Icon name="play"></Icon>
                                            <span>Active</span>
                                          </DropdownItem>
                                        </li>
                                      )}
                                    </li>
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
                                              deleteCoupon(item.id);
                                            }
                                          });
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Remove Coupon </span>
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
                  <span className="text-silent">No coupon found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="md">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{editcouponId > 0 ? "Update" : "Add"} Coupon</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="12">
                    <div className="form-control-wrap ">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          value={0}
                          id="customSwitch2"
                          checked={notichk}
                          onChange={(e) => {
                            setNotiChk(!notichk);
                            if (e.target.checked === true) {
                              setFormData({ ...formData, user_id: "0" });
                            }
                          }}
                        />
                        <label className="custom-control-label" htmlFor="customSwitch2">
                          {" "}
                          All User's{" "}
                        </label>
                      </div>
                    </div>
                  </Col>
                  {notichk == false ? (
                    <Col md="12">
                      <FormGroup>
                        <label className="form-label">Select User</label>
                        <RSelect
                          options={adv}
                          defaultValue={formData.userid_details}
                          isMulti
                          onChange={(val) => {
                            setFormData({ ...formData, userid_details: JSON.stringify(val) });
                          }}
                          value={formData.userid_details ? JSON.parse(formData.userid_details) : ""}
                        />
                      </FormGroup>
                    </Col>
                  ) : (
                    <div></div>
                  )}
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Title Name </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editCoupon.title}
                        placeholder="Enter Title Name ..."
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Name is required",
                        })}
                      />
                      {errors.title && <span className="invalid">{errors.title.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Coupon Code </label>
                      <input
                        type="text"
                        name="coupon_code"
                        defaultValue={editCoupon.coupon_code}
                        placeholder="Enter Coupon Code Name ..."
                        onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Coupon Code is required",
                        })}
                      />
                      {errors.coupon_code && <span className="invalid">{errors.coupon_code.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Coupon Type</label>
                      <RSelect
                        options={filterCouponType}
                        name="coupon_type"
                        defaultValue={{
                          value: editCoupon.coupon_type,
                          label: editCoupon.coupon_type,
                        }}
                        onChange={(e) => {
                          setFormData({ ...formData, coupon_type: e.value });
                          // console.log(e.value);
                        }}
                      />

                      {errors.coupon_type && <span className="invalid">{errors.coupon_type.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Min Bill Amount </label>
                      <input
                        type="text"
                        name="min_bil_amt"
                        defaultValue={editCoupon.min_bil_amt}
                        placeholder="Enter Min Bill Amount ..."
                        onChange={(e) => setFormData({ ...formData, min_bil_amt: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Min Bill Amount  is required",
                        })}
                      />
                      {errors.min_bil_amt && <span className="invalid">{errors.min_bil_amt.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Coupon Value </label>
                      <input
                        type="text"
                        name="coupon_value"
                        defaultValue={editCoupon.coupon_value}
                        placeholder="Enter Coupon Value ..."
                        onChange={(e) => setFormData({ ...formData, coupon_value: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Coupon Value is required",
                        })}
                      />
                      {errors.coupon_value && <span className="invalid">{errors.coupon_value.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Max Discount </label>
                      <input
                        type="text"
                        name="max_disc"
                        defaultValue={editCoupon.max_disc}
                        placeholder="Enter Max Discount ..."
                        onChange={(e) => setFormData({ ...formData, max_disc: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Max Discount is required",
                        })}
                      />
                      {errors.max_disc && <span className="invalid">{errors.max_disc.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> Start Date </label>
                      <input
                        type="date"
                        name="start_date"
                        defaultValue={editCoupon.start_date}
                        placeholder="Enter End Date ..."
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Start Date is required",
                        })}
                        min={disablePastDate()}
                      />
                      {errors.start_date && <span className="invalid">{errors.start_date.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label"> End Date </label>
                      <input
                        type="date"
                        name="end_date"
                        defaultValue={editCoupon.end_date}
                        placeholder="Enter Start Date ..."
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "End Date is required",
                        })}
                        min={disablePastDate()}
                      />
                      {errors.end_date && <span className="invalid">{errors.end_date.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          {editcouponId > 0 ? "Update" : "Create"}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default CouponList;
