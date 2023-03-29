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
import { getCmpListCategoryList } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
import { adRateStore, adUnitList, updateAdUnitStatus, websiteReject, websiteStatusUpdate } from "../../app/api2";
import { useForm } from "react-hook-form";

const AdUnitList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const [adType, setAdType] = useState("");

  const getAdType = () => {
    let adt = "";
    if (adType == "Text Ads") {
      adt = "text";
    } else if (adType == "Banner Ads") {
      adt = "banner";
    } else if (adType == "Video Ads") {
      adt = "video";
    } else if (adType == "Social Ads") {
      adt = "social";
    } else if (adType == "Native Ads") {
      adt = "native";
    } else if (adType == "Popunder Ads") {
      adt = "popup";
    }
    return adt;
  };

  const [categlist, setCategory] = useState(null);

  const [cat, setCat] = useState(null);
  const [catName, setCatName] = useState(null);
  const [errorList, setError] = useState([]);
  const [webId, setWebId] = useState(0);
  const [formData, setFormData] = useState({
    remark: "",
    status: 6,
    id: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      remark: "",
      status: 6,
      id: "",
      errorList: [],
    });
  };

  const getCategory = async () => {
    const res = await getCmpListCategoryList();
    // console.log(res);
    setCategory(res);
  };
  
  const getAdUnitList = async (cat, adType, pg = 1, src = "") => {
    setLoading(true);
    const res = await adUnitList(cat, adType, pg, itemPerPage, src);
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

  const updateAdUnit = async (id, sts) => {
    setLoading(true);
    const res = await updateAdUnitStatus(id, sts);
    if (res.code === 200) {
      getAdUnitList();
    }
    setLoading(false);
  };
  const onFilterChange = (val) => {
    getAdUnitList("", "", "", val);
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
    
      const res = await websiteReject(formData);
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
        getAdUnitList();
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
    

    getAdUnitList();
    setLoading(false);
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      let adt = getAdType();
      getAdUnitList(cat, adt, pageNumber);
    }
  };
  useEffect(() => {
    getAdUnitList();
    getCategory();
   
  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Ad Unit List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Ad Unit List</BlockTitle>

              <BlockDes className="text-soft">You have total {pgs} Adunit</BlockDes>
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
                          placeholder="Search Unit Name, Unit ID, ,Website Url, User ID & Email ID, Category"
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
                                  getAdUnitList("");
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
                                          getAdUnitList(item.value);
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
                          <span>Filtered By {adType.charAt(0).toUpperCase() + adType.slice(1)} Ads</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu right>
                          {/* <ul className="link-list-opt no-bdr" style={{ height: "300px", "overflow-y": "scroll" }}>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setAdType("All");
                                  getAdUnitList(cat);
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
                                  getAdUnitList(cat, 1);
                                  setAdType("Unverified");
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
                                  getAdUnitList(cat, 2);
                                  setAdType("Verified");
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
                                  getAdUnitList(cat, 3);
                                  setAdType("Hold");
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
                                  getAdUnitList(cat, 4);
                                  setAdType("Approved");
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
                                  getAdUnitList(cat, 5);
                                  setAdType("Suspended");
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
                                  getAdUnitList(cat, 6);
                                  setAdType("Rejected");
                                }}
                              >
                                <span>Rejected</span>
                              </DropdownItem>
                            </li>
                          </ul> */}
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setAdType("All");
                                  getAdUnitList(cat);
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
                                  getAdUnitList(cat, "text");
                                  setAdType("text");
                                }}
                              >
                                <span>Text Ads</span>
                                {adType === "Text Ads" && (
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
                                  getAdUnitList(cat, "banner");
                                  setAdType("banner");
                                }}
                              >
                                <span>Banner Ads</span>
                                {adType === "Banner Ads" && (
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
                                  getAdUnitList(cat, "video");
                                  setAdType("video");
                                }}
                              >
                                <span>Video Ads</span>
                                {adType === "video" && (
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
                                  getAdUnitList(cat, "social");
                                  setAdType("social");
                                }}
                              >
                                <span>Social Ads</span>
                                {adType === "social" && (
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
                                  getAdUnitList(cat, "native");
                                  setAdType("native");
                                }}
                              >
                                <span>Native Ads </span>
                                {adType === "native" && (
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
                                  getAdUnitList(cat, "popup");
                                  setAdType("popup");
                                }}
                              >
                                <span>Popunder Ads</span>
                                {adType === "popup" && (
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
                      <span className="sub-text">Publisher</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Ad Unit</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Website</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Ad Type</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Category</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Status</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Total Impressions</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Total Clicks</span>
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
                            <DataTableRow>
                              <div className="user-info">
                                <span className="tb-lead">{item.ad_name} </span>
                                <span>{item.ad_code}</span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <a href={`${item.site_url}`} target="_blank">
                                <span>{item.site_url}</span>
                              </a>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.ad_type}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.category}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              {item.status === 1 && (
                                <span className={`badge badge-dim badge-info`}>
                                  <span>Inactive</span>
                                </span>
                              )}
                              {item.status === 2 && (
                                <span className={`badge badge-dim badge-primary`}>
                                  <span>Active</span>
                                </span>
                              )}
                              {item.status === 3 && (
                                <span className={`badge badge-dim badge-warning`}>
                                  <span>Hold</span>
                                </span>
                              )}
                              {item.status === 4 && (
                                <span className={`badge badge-dim badge-dark`}>
                                  <span>Suspended</span>
                                </span>
                              )}
                              
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.total_impressions}</span>
                            </DataTableRow>
                            
                            <DataTableRow size="lg">
                              <span className={`badge badge-dim badge-dark`}>{item.total_clicks}</span>
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
                                          {item.status === 1 ? (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateAdUnit(item.id, 2);
                                                }}
                                              >
                                                <Icon name="play"></Icon>
                                                <span>Active</span>
                                              </DropdownItem>


                                              
                                            </li>
                                          ) : (
                                            <li>
                                              <DropdownItem
                                                tag="a"
                                                href="#markasdone"
                                                onClick={(ev) => {
                                                  ev.preventDefault();
                                                  updateAdUnit(item.id, 1);
                                                }}
                                              >
                                                <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                                <span>Inactive</span>
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
              <h5 className="title">Add Remark for Rejection</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  
                   
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Remark</label>
                      <input
                        type="text"
                        name="remark"
                        placeholder="Enter Remark"
                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        className="form-control"
                        ref={register({})}
                      />
                      <span className="text-danger">{errorList.remark}</span>
                    </FormGroup>
                  </Col>
                  

                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Submit
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

export default AdUnitList;
