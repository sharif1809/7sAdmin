import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import * as moment from "moment";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  FormGroup,
  ModalBody,
  Modal,
  DropdownItem,
  Form,
  Badge,
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
  getNotiUserData,
  notificationCreate,
  notificationList,
  notificationStatusUpdate,
  trashNotification,
} from "../../app/api";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

const NotificationList = () => {
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  const [notichk, setNotiChk] = useState(false);
  const [udata, setUdata] = useState(null);
  const [errorList, setError] = useState([]);

  const getUserdata = async (noti_for) => {
    const res = await getNotiUserData(noti_for);
    setUdata(res.data);
    // console.log(res);
  };
  const [modal, setModal] = useState(false);

  const [data, setData] = useState("");
  // const [dateget, setDateget] = useState()
  const [formData, setFormData] = useState({
    noti_type: 1,
    noti_for: 3,
    user_id: "",
    title: "",
    display_url: "",
    noti_desc: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      noti_type: 1,
      noti_for: 3,
      user_id: "",
      title: " ",
      display_url: "",
      noti_desc: "",
      errorList: [],
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const filterStatus = [
    { value: "3", label: "All Users" },
    { value: "1", label: "Advertiser" },
    { value: "2", label: "Publisher" },
  ];

  const filterNotiType = [
    { value: "1", label: "Notification" },
    { value: "2", label: "Offer" },
  ];
  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [notitype, setNotitype] = useState("");
  const [pgs, setPgs] = useState(0);

  const getNotiType = () => {
    let adt = "";
    if (notitype == "Notifications") {
      adt = 1;
    } else if (notitype == "Offers") {
      adt = 2;
    }
    return adt;
  };
  // Get Notification List
  const getAdminNotification = async (type = "", pg = 1, lim = 0, src) => {
    setLoading(true);
    // console.log(rangeDate.start)
    let itemLim = lim > 0 ? lim : itemPerPage;
    const res = await notificationList(type, pg, itemLim, src, getDate(rangeDate.start), getDate(rangeDate.end));
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
    
    return `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  }

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
    
  };

  const onReportSearch = async () => {
    getAdminNotification(notitype);
  };
  // submit function to add a new item
  const onFormSubmit = async (sData) => {
    console.log(formData);
    setLoading(true);
    const res = await notificationCreate(formData);
    // console.log(res);
    if (res.code === 200) {
      toast.success("Notification Added Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getAdminNotification();
      setLoading(false);
      setModal(false);
      resetForm();
    } else if (res.code === 100) {
      setModal(true);
      setError(res.err);
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

    getAdminNotification();
    // resetForm()
    //  setModal({ add: false });
    // setFormData(false);
    setLoading(false);
  };

  const updateNoti = async (id, sts) => {
    setLoading(true);
    const res = await notificationStatusUpdate(id, sts);
    if (res.code === 200) {
      getAdminNotification();
    }
    setLoading(false);
  };

  // function to delete a notification
  const deleteNotification = async (id) => {
    setLoading(true);
    const res = await trashNotification(id);
    if (res.code === 200) {
      toast.success("Notification Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getAdminNotification();
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

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // Get current list, pagination
  // const indexOfLastItem = currentPage * itemPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const onFilterChange = (val) => {
    getAdminNotification("", 1, "", val);
  };
  // Change Page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getNotiType();
      getAdminNotification(adt, pageNumber);
    }
  };

  useEffect(() => {
    setNotiChk(false);
    getAdminNotification();
    getUserdata(3);
  }, []);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Notification List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Notifications</BlockTitle>
              <BlockDes className="text-soft">You have total {pgs} notification</BlockDes>
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
                          placeholder="Search Name"
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
                          <span>Filtered By {notitype == 1 ? 'Notifications' : notitype == 2 ? 'Offers' : ''}</span>
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
                                  //getAdminNotification();
                                  setNotitype("");
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
                                  //getAdminNotification(1);
                                  setNotitype("1");
                                }}
                              >
                                <span>Notifications</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  //getAdminNotification(2);
                                  setNotitype("2");
                                }}
                              >
                                <span>Offers</span>
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
                          maxDate ={new Date()}
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
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Notification</span>
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
                  <span className="sub-text">Title</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Description</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">Url</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">Notification Type</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">Notification For</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">User's</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Status</span>
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
                          <div className="project-info">
                            <h6 className="title">{item.title}</h6>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.noti_desc}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.display_url ? item.display_url : '--'}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.noti_type === 1 && (
                            <Badge pill color="primary">
                              Notifications
                            </Badge>
                          )}
                          {item.noti_type === 2 && (
                            <Badge pill color="info">
                              Offers
                            </Badge>
                          )}
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.noti_for === 1 && (
                            <span className={`badge badge-dim badge-dark`}>
                              <span>Advertiser</span>
                            </span>
                          )}
                          {item.noti_for === 2 && (
                            <span className={`badge badge-dim badge-primary`}>
                              <span>Publisher</span>
                            </span>
                          )}
                          {item.noti_for === 3 && (
                            <span className={`badge badge-dim badge-warning`}>
                              <span>Both</span>
                            </span>
                          )}
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.uname}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>
                            {item.status === 1 && (
                              <span className={`badge badge-dim badge-success`}>
                                <span>Active</span>
                              </span>
                            )}
                            {item.status === 0 && (
                              <span className={`badge badge-dim badge-danger`}>
                                <span>Inactive</span>
                              </span>
                            )}
                          </span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          {/* <span className="title"><Moment format="DD-MM-YYYY"><span> {item !== null ? item.created_at: '0'} </span></Moment></span> */}
                          <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
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
                                    {/* <li>
                                      {item.status === 1 ? (
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateNoti(item.id, 0);
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
                                              updateNoti(item.id, 1);
                                            }}
                                          >
                                            <Icon name="play"></Icon>
                                            <span>Active</span>
                                          </DropdownItem>
                                        </li>
                                      )}
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
                                              deleteNotification(item.id);
                                            }
                                          });
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Remove</span>
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
                    <span className="text-silent">No notification found</span>
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
                            let adt = getNotiType();
                            getAdminNotification(adt,1, 10);
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
                            let adt = getNotiType();
                            getAdminNotification(adt,1, 20);
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
                            let adt = getNotiType();
                            getAdminNotification(adt,1, 50);
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
                            let adt = getNotiType();
                            getAdminNotification(adt,1, 100);
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
                            let adt = getNotiType();
                            getAdminNotification(adt,1, 500);
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

        <Modal isOpen={modal} toggle={() => setModal(false)} className="modal-dialog-centered" size="md">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
                setModal(false);
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Notification</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Notification Type</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterNotiType}
                          defaultValue={{ value: "1", label: "Notification" }}
                          onChange={(e) => {
                            // console.log(e.value)
                            setFormData({ ...formData, noti_type: e.value });
                          }}
                        />
                      </div>
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">User Type</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{ value: "3", label: "All Users" }}
                          onChange={(e) => {
                            // console.log(e.value)
                            setFormData({ ...formData, noti_for: e.value });
                            getUserdata(e.value);
                          }}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <div className="form-control-wrap ">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          value={1}
                          id="customSwitch2"
                          checked={notichk}
                          onChange={(e) => {
                            setNotiChk(!notichk);
                            if (e.target.checked === true) {
                              setFormData({ ...formData, user_id: "All" });
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
                          options={udata}
                          isMulti
                          onChange={(val) => {
                            if (val.length > 0) {
                              setFormData({ ...formData, user_id: JSON.stringify(val) });
                            } else {
                              setFormData({ ...formData, user_id: "" });
                            }
                          }}
                        />
                      </FormGroup>
                      <span className="text-danger">{errorList.user_id}</span>
                    </Col>
                  ) : (
                    <div> </div>
                  )}
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        placeholder="Enter Title"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-control"
                        ref={register({})}
                      />
                      <span className="text-danger">{errorList.title}</span>
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Display Url </label>
                      <input
                        type="text"
                        name="display_url"
                        value={formData.display_url}
                        placeholder="Enter display url"
                        onChange={(e) => setFormData({ ...formData, display_url: e.target.value })}
                        className="form-control"
                        ref={register({pattern : /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/})}
                      />
                      {errors.display_url && <span className="invalid">Please enter valid display url.</span>}
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <FormGroup>
                      <label className="form-label">Description</label>
                      <textarea
                        name="noti_desc"
                        defaultValue={formData.noti_desc}
                        placeholder="Enter description"
                        onChange={(e) => setFormData({ ...formData, noti_desc: e.target.value })}
                        className="form-control-xl form-control no-resize"
                        ref={register({})}
                      />
                      <span className="text-danger">{errorList.noti_desc}</span>
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Create
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

export default NotificationList;
