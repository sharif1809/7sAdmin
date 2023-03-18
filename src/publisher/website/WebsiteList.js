import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";
import * as moment from "moment";

import {
  Block,
  Button,
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
  Col,
  RSelect,
} from "../../components/Component";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  Modal,
  Form,
  FormGroup,
} from "reactstrap";
import { getCmpListCategoryList, countryDropListUser } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
import { adRateStore, updateAdRate, websiteList } from "../../app/api2";
import { useForm } from "react-hook-form";

const getWebsiteList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const [status, setStatus] = useState("");

  const getUserStatus = () => {
    let usr = "";
    if (status == "Unverified") {
      usr = 1;
    } else if (status == "Verified") {
      usr = 2;
    } else if (status == "Hold") {
      usr = 3;
    } else if (status == "Approved") {
      usr = 4;
    } else if (status == "Suspended") {
      usr = 5;
    } else if (status == "Rejected") {
      usr = 6;
    }

    return usr;
  };

  const [categlist, setCategory] = useState(null);

  const [cat, setCat] = useState(null);
  const [catName, setCatName] = useState(null);
  const [con, setCon] = useState(null);
  const [conName, setConName] = useState(null);
  const [errorList, setError] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    country_id: "",
    cpm: "",
    cpc: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      category_id: "",
      country_id: "",
      cpm: "",
      cpc: "",
      errorList: [],
    });
  };

  const getCategory = async () => {
    const res = await getCmpListCategoryList();
    // console.log(res);
    setCategory(res);
  };
  const [ucountry, setUcountry] = useState(null);
  const getCountryData = async () => {
    const res = await countryDropListUser();
    // console.log(res.data)
    setUcountry(res.data);
  };
  const [editAdRate, setAdRate] = useState("");
  const [editAdRateId, setAdRateId] = useState(0);

  const getWebsiteList = async (cat, status, pg = 1) => {
    setLoading(true);
    const res = await websiteList(cat, status, pg, itemPerPage);
    // console.log(res.data);
    if (res.data) {
      // console.log(res.data);
      setData(res.data);
      setPgs(res.row);
    } else {
      setData("");
      setPgs("");
    }
    setLoading(false);
  };
  const [modal, setModal] = useState(false);
  const reload = () => window.location.reload();
  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    reload();
    resetForm();
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit function to add a new item
  const onFormSubmit = async () => {
    // console.log(formData);
    setLoading(true);
    if (editAdRateId > 0) {
      const res = await updateAdRate(formData);
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
        getWebsiteList();
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
      const res = await adRateStore(formData);
      // console.log(res);
      if (res.code === 200) {
        toast.success("Rate Added Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        getWebsiteList();
        setLoading(false);
        setModal(false);
        resetForm();
      } else if (res.code === 100) {
        setModal(true);
        setError(res.error);
        // console.log(res.error);
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
    }

    getWebsiteList();
    setLoading(false);
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let std = getUserStatus();
      getWebsiteList(cat, std, con, pageNumber);
    }
  };
  useEffect(() => {
    getWebsiteList();
    getCategory();
    getCountryData();
  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Website List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Website List</BlockTitle>

              <BlockDes className="text-soft">You have total {pgs} Websites</BlockDes>
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
                          placeholder="Search Website, User ID & Email ID, Status, Category"
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
                                  getWebsiteList("");
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
                                          getWebsiteList(item.value);
                                        }}
                                        defaultValue={{ label: "test", value: cat }}
                                      >
                                        <span>{item.label}</span>
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
                                  setStatus("All");
                                  getWebsiteList(cat);
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
                                  getWebsiteList(cat, 1);
                                  setStatus("Unverified");
                                }}
                              >
                                <span>Unverified</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getWebsiteList(cat, 2);
                                  setStatus("Verified");
                                }}
                              >
                                <span>Verified</span>
                              </DropdownItem>
                            </li>

                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getWebsiteList(cat, 3);
                                  setStatus("Hold");
                                }}
                              >
                                <span>Hold</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getWebsiteList(cat, 4);
                                  setStatus("Approved");
                                }}
                              >
                                <span>Approved</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getWebsiteList(cat, 5);
                                  setStatus("Suspended");
                                }}
                              >
                                <span>Suspended</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getWebsiteList(cat, 6);
                                  setStatus("Rejected");
                                }}
                              >
                                <span>Rejected</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Rates</span>
                      </Button>
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
                      <span className="sub-text">Publisher</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Website</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Category</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Ad Units</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Status</span>
                    </DataTableRow>

                    <DataTableRow size="md">
                      <span className="sub-text">Date Added</span>
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
                                <span className="tb-lead">{item.user_email} </span>
                                <span>{item.user_id}</span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <a href={`${item.site_url}`} target="_blank">
                                <span>{item.site_url}</span>
                              </a>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.website_category}</span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.adunites}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              {item.website_status === 0 && (
                                <span className={`badge badge-dim badge-info`}>
                                  <span>Incomplete</span>
                                </span>
                              )}
                              {item.website_status === 1 && (
                                <span className={`badge badge-dim badge-primary`}>
                                  <span>Unverified</span>
                                </span>
                              )}
                              {item.website_status === 2 && (
                                <span className={`badge badge-dim badge-warning`}>
                                  <span>Verified</span>
                                </span>
                              )}
                              {item.website_status === 3 && (
                                <span className={`badge badge-dim badge-dark`}>
                                  <span>Hold</span>
                                </span>
                              )}
                              {item.website_status === 4 && (
                                <span className={`badge badge-dim badge-success`}>
                                  <span>Approved</span>
                                </span>
                              )}
                              {item.website_status === 5 && (
                                <span className={`badge badge-dim badge-warning`}>
                                  <span>Suspended</span>
                                </span>
                              )}
                              {item.website_status === 6 && (
                                <span className={`badge badge-dim badge-danger`}>
                                  <span>Rejected</span>
                                </span>
                              )}
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.create_date}</span>
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
                                          {item.website_status === 2 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  // updateCamp(item.campaign_id, 0);
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
                                                  // updateCamp(item.campaign_id, 1);
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
                                                  // updateCamp(item.campaign_id, 4);
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
                                                  // updateCamp(item.campaign_id, 5);
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
                                                  // updateCamp(item.campaign_id, 6);
                                                }}
                                              >
                                                <Icon name="icon ni ni-na"></Icon>
                                                <span>Suspend</span>
                                              </DropdownItem>
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
                      <span className="text-silent">No Data found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
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
              <h5 className="title">{editAdRateId > 0 ? "Update" : "Add"} Rate</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  {editAdRateId < 1 ? (
                    <Col md="12">
                      <FormGroup className="form-group">
                        <label className="form-label" htmlFor="category_id">
                          {" "}
                          Website Category *{" "}
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            options={categlist}
                            name="category_id"
                            defaultValue={editAdRate.category_id}
                            onChange={(e) => {
                              // console.log(e.value)
                              setFormData({ ...formData, category_id: e.value });
                            }}
                            ref={register({})}
                          />
                          <span className="text-danger">{errorList.category_id}</span>
                        </div>
                      </FormGroup>
                    </Col>
                  ) : (
                    ""
                  )}
                  {editAdRateId < 1 ? (
                    <Col lg="12">
                      <FormGroup className="form-group">
                        <label className="form-label" htmlFor="country_id">
                          {" "}
                          Country *{" "}
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            options={ucountry}
                            name="country_id"
                            defaultValue={editAdRate.country_id}
                            onChange={(e) => {
                              // console.log(editAdRate.country_id);
                              setFormData({ ...formData, country_id: e.value });
                            }}
                            ref={register({})}
                          />
                          <span className="text-danger">{errorList.country_id}</span>
                        </div>
                      </FormGroup>
                    </Col>
                  ) : (
                    ""
                  )}
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Cpm</label>
                      <input
                        type="text"
                        name="cpm"
                        defaultValue={editAdRate.cpm}
                        placeholder="Enter Cpm value"
                        onChange={(e) => setFormData({ ...formData, cpm: e.target.value })}
                        className="form-control"
                        ref={register({})}
                      />
                      <span className="text-danger">{errorList.cpm}</span>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Cpc</label>
                      <input
                        type="text"
                        name="cpc"
                        defaultValue={editAdRate.cpc}
                        placeholder="Enter Cpc value"
                        onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
                        className="form-control"
                        ref={register({})}
                      />
                      <span className="text-danger">{errorList.cpc}</span>
                    </FormGroup>
                  </Col>

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          {editAdRateId > 0 ? "Update" : "Create"}
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

export default getWebsiteList;
