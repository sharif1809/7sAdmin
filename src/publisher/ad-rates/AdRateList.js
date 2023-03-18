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
import { deleteCampaign, getCmpListCategoryList, countryDropListUser } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
import { adRateList, adRateStore, updateAdRate } from "../../app/api2";
import { useForm } from "react-hook-form";

const AdRateList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [pgs, setPgs] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

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

  const getRateData = async (cat, con, pg = 1) => {
    setLoading(true);
    const res = await adRateList(cat, con, pg, itemPerPage);
    // console.log(res.data);
    if (res.data) {
      // console.log(res.data);
      setData(res.data);
      setPgs(res.row);
    }
    else
    {
      setData("");
      setPgs("");
    }
    setLoading(false);
  };
  const [modal, setModal] = useState(false);
  const reload=()=>window.location.reload();
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
        getRateData();
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
        getRateData();
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

    getRateData();
    setLoading(false);
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getRateData(cat, con, pageNumber);
    }
  };
  useEffect(() => {
    getRateData();
    getCategory();
    getCountryData();
  }, []);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Manage Ad Rates List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Ad Rates List</BlockTitle>

              <BlockDes className="text-soft">You have total {pgs} Ad Rates</BlockDes>
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
                                  getRateData("");
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
                                          getRateData(item.value);
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
                          <span>Filtered By Country {cat != null && <span> : {conName}</span>}</span>
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
                                  getRateData("");
                                }}
                              >
                                <span>All</span>
                              </DropdownItem>
                            </li>
                            {ucountry !== null
                              ? ucountry.map((item) => {
                                  return (
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setCon(item.value);
                                          setConName(item.label);
                                          getRateData(cat,item.value);
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
                      <span className="sub-text">Country</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Category</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Cpm</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="sub-text">Cpc</span>
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
                            <DataTableRow size="lg">
                              <span>{item.country_name}</span>
                            </DataTableRow>

                            <DataTableRow size="lg">
                              <span>{item.category_name}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.cpm}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.cpc}</span>
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
                                          <DropdownItem
                                            tag="a"
                                            href="#editcoupon"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              //onEditClick(item.id);
                                              setAdRateId(item.id);
                                              setAdRate(item);
                                              setFormData(item);
                                              setModal({ add: true });
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit Ad Rate</span>
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
                  ) : ""}
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
                  ) : ""}
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

export default AdRateList;
