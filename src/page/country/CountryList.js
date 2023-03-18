import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import SimpleBar from "simplebar-react";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import {
  deleteCountry,
  getCountryIndex,
  saveCountry,
  updateCountry,
  updateCountryup,
  updateCountryStatus,
} from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
const CountryList = () => {
  const [loading, setLoading] = useState(false);
  const [editCountry, setEditCountry] = useState("");
  const [formSave, setformSave] = useState(false);
  const [editCountryId, setEditCountryId] = useState(0);
  const [data, setData] = useState("");
  const [sm, updateSm] = useState(false);
  const [errorList, setError] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    iso: "",
    iso3: "",
    nicename: "",
    numcode: "",
    phonecode: "",
    currency_code: "",
  });
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  //console.log(editCountryId);
  const [pgs, setPgs] = useState(0);

  // Changing state value when searching name
  const getCountryData = async (pg = 1, lim = 0, src = "") => {
    setLoading(true);
    let itemLim = lim > 0 ? lim : itemPerPage;
    const res = await getCountryIndex(pg, itemLim, src);
    setData(res.data);
    setPgs(res.row);
    setLoading(false);
  };

  const updateCountry = async (uid, sts) => {
    setLoading(true);
    const res = await updateCountryStatus(uid, sts);
    if (res.code === 200) {
      getCountryData(currentPage);
    }
    setLoading(false);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getCountryData(pageNumber);
    }
  };

  useEffect(() => {
    getCountryData();
  }, []);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFormSubmit = async (form) => {
    setformSave(true);
    if (editCountryId > 0) {
      console.log(form);
      //updateCountry(editCountryId, form.name);
      const res = await updateCountryup(
        editCountryId,
        form.name,
        form.nicename,
        form.iso,
        form.iso3,
        form.numcode,
        form.phonecode,
        form.currency_code
      );
      if (res.code === 200) {
        toast.success("Country Updated Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        getCountryData(currentPage);
        setformSave(false);
        toggle();
        // location.reload();
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
        setformSave(false);
      }
    } else {
      const res = await saveCountry(form);
      if (res.code === 200) {
        toast.success("Country Added Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        getCountryData();
        setformSave(false);
        toggle();
      } else if (res.code === 101) {
        toast.error(res.message, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        setformSave(false);
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
      setformSave(false);
    }
  };

  // onChange function for searching name
  const onFilterChange = (val) => {
    getCountryData("", "", val);
  };

  // function to delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    const res = await deleteCountry(id);
    if (res.code === 200) {
      toast.success("Country Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getCountryData();
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

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
    });
  };
  // console.log(data);
  // Get current list, pagination
  // const indexOfLastItem = currentPage * itemPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Country List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Countries</BlockTitle>
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
                          placeholder="Search Country Name"
                          onChange={(e) => {
                            onFilterChange(e.target.value);
                          }}
                        />
                      </div>
                    </li>

                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          setEditCountryId(0);
                          setEditCountry("");
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Country</span>
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
                    <DataTableRow size="sm">
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Nickname</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>ISO</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>ISO3</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Numcode</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Phonecode</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Currency Code</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Status</span>
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
                    ? data.map((item, key) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.name}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.nicename}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.iso}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.iso3}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.numcode}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.phonecode}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">{item.currency_code}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              {item.status === 0 && (
                                <span className={`badge badge-dim badge-danger`}>
                                  <span>Inactive</span>
                                </span>
                              )}
                              {item.status === 1 && (
                                <span className={`badge badge-dim badge-success`}>
                                  <span>Active</span>
                                </span>
                              )}
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
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              setEditCountryId(item.id);
                                              setEditCountry(item);
                                              toggle("add");
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit Country</span>
                                          </DropdownItem>
                                        </li>

                                        {/* <li>
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
                                                  deleteProduct(item.id);
                                                }
                                            });
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Country</span>
                                          </DropdownItem>
                                        </li> */}

                                        {/* <li>
                                          {item.status === 0 ? (
                                            <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateCountry(item.id, 1);
                                              }}
                                            >
                                              <Icon name="play"></Icon>
                                              <span>Active</span>
                                            </DropdownItem>
                                          ) : item.status === 1 ? (
                                            <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateCountry(item.id, 0);
                                              }}
                                            >
                                              <Icon name="pause"></Icon>
                                              <span>Inactive</span>
                                            </DropdownItem>
                                          ) : (
                                            ""
                                          )}
                                        </li> */}
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
                        <span className="text-silent">No Country found</span>
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
                                getCountryData(1, 10);
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
                                getCountryData(1, 20);
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
                                getCountryData(1, 50);
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
                                getCountryData(1, 100);
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
                                getCountryData(1, 500);
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

        {/* Add product */}

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">{editCountryId > 0 ? "Edit" : "Add"} Country</BlockTitle>
              <BlockDes>
                <p>{editCountryId > 0 ? "Edit" : "Add"} information or update Country.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Country Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country name",
                        })}
                        defaultValue={editCountry.name}
                        autoComplete="off"
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nicename">
                      Country Nickname
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="nicename"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country Nickname",
                        })}
                        defaultValue={editCountry.nicename}
                        autoComplete="off"
                      />
                      {errors.nicename && <span className="invalid">{errors.nicename.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="iso">
                      Country ISO
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="iso"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country iso",
                        })}
                        defaultValue={editCountry.iso}
                        autoComplete="off"
                      />
                      {errors.iso && <span className="invalid">{errors.iso.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="iso3">
                      Country ISO3
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="iso3"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country iso3",
                        })}
                        defaultValue={editCountry.iso3}
                        autoComplete="off"
                      />
                      {errors.iso3 && <span className="invalid">{errors.iso3.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="numcode">
                      Country Numcode
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="numcode"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country numcode",
                        })}
                        defaultValue={editCountry.numcode}
                        autoComplete="off"
                      />
                      {errors.numcode && <span className="invalid">{errors.numcode.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phonecode">
                      Country Phonecode
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="phonecode"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country phonecode",
                        })}
                        defaultValue={editCountry.phonecode}
                        autoComplete="off"
                      />
                      {errors.phonecode && <span className="invalid">{errors.phonecode.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="currency_code">
                      Currency Code
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="currency_code"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "Please enter Country currency",
                        })}
                        defaultValue={editCountry.currency_code}
                        autoComplete="off"
                      />
                      {errors.currency_code && <span className="invalid">{errors.currency_code.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit" disabled={formSave}>
                    {formSave && <Spinner size="sm" />}
                    <span>{editCountryId > 0 ? "Update" : "Add"} Country</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default CountryList;
