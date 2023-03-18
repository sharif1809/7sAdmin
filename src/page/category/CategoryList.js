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
  RSelect,
} from "../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Spinner, Badge } from "reactstrap";
import { useForm } from "react-hook-form";
import { deleteCategory, getCategoryList, saveCategory, updateCategory, updateCategoryStatus } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";

const CategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [editCat, setEditCat] = useState("");
  const [formSave, setformSave] = useState(false);
  const [editCatId, setEditCatId] = useState(0);
  const [data, setData] = useState("");
  const [sm, updateSm] = useState(false);
  const [errorList, setError] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cpm: "",
    cpc: "",
    status: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      name: "",
      cpm: "",
      cpc: "",
      status: "",
      errorList: [],
    });
  };
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  //console.log(editCatId);
  // Changing state value when searching name
  const getCategoryData = async (src = "") => {
    setLoading(true);
    const res = await getCategoryList(src);
    setData(res.data);
    setLoading(false);
  };
  const updateCategorySts = async (uid, sts) => {
    setLoading(true);
    const res = await updateCategoryStatus(uid, sts);
    if (res.code === 200) {
      getCategoryData();
    }
    setLoading(false);
  };
  useEffect(() => {
    getCategoryData();
  }, []);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onFormSubmit = async (form) => {
    setformSave(true);
    if (editCatId > 0) {
      //updateCategory(editCatId, form.cat_name);
      const res = await updateCategory(editCatId, form.cat_name, form.cpm, form.cpc);
      // console.log(res);
      if (res.code === 200) {
        toast.success("Category Updated Successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        setformSave(false);
        resetForm(false);
        setError(false);
        getCategoryData();
        setFormData(false);
        setEditCat(false);
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
      const res = await saveCategory(form);
      if (res.code === 200) {
        // toast.success("Category Added Successfully", {
        //   position: "top-right",
        //   autoClose: true,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: false,
        // });
        setformSave(false);
        resetForm(false);
        setError(false);
        getCategoryData();
        setFormData(false);
        setEditCat(false);
      } else if (res.code === 100) {
        //   toast.error(res.message, {
        //   position: "top-right",
        //   autoClose: true,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: false,
        // });
        setError(res.error);
        setformSave(false);
        setEditCat("");
        // getCategoryData();
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
        getCategoryData();
        setformSave(false);
        toggle();
        setEditCat("");
      }
    }
    // getCategoryData();
    // setformSave(false);
    // toggle();
    // setEditCat('');
  };

  // onChange function for searching name
  const onFilterChange = (val) => {
    getCategoryData(val);
  };

  // function to delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    const res = await deleteCategory(id);
    if (res.code === 200) {
      toast.success("Category Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getCategoryData();
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

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const serial_num = currentItems * (currentPage - 1) + itemPerPage;

  // Change Page ::
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Category List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Categories</BlockTitle>
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
                          placeholder="Search Category Name"
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
                          setEditCatId(0);
                          setEditCat("");
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Category</span>
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
                    <DataTableRow size="sm">
                      <span>Inhouse</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Clients</span>
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
                  {currentItems.length > 0
                    ? currentItems.map((item, key) => {
                        return (
                          <DataTableItem key={key}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.label}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span>
                                <Badge pill color="success">
                                  {item.inhouse}
                                </Badge>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span>
                                <Badge pill color="success">
                                  {item.client}
                                </Badge>
                              </span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="title">
                                {item.status == 1 ? (
                                  <span className={`badge badge-dim badge-info`}>Active</span>
                                ) : (
                                  <span className={`badge badge-dim badge-danger`}>Inactive</span>
                                )}
                              </span>
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
                                              //onEditClick(item.id);
                                              setEditCatId(item.value);
                                              setEditCat(item);
                                              toggle("add");
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit Category</span>
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
                                                  deleteProduct(item.value);
                                                }
                                            });
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Category</span>
                                          </DropdownItem>
                                        </li> */}
                                        {/* <li>
                                          {item.status === 0 ? (
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateCategorySts(item.value, 1)
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
                                              updateCategorySts(item.value, 0)
                                            }}
                                          >
                                            <Icon name="pause"></Icon>
                                            <span>Inactive</span>
                                          </DropdownItem>
                                          ) : ''}
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
                <div className="card-inner">
                  {data.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No category found</span>
                    </div>
                  )}
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
              <BlockTitle tag="h5">{editCatId > 0 ? "Edit" : "Add"} Category</BlockTitle>
              <BlockDes>
                <p>{editCatId > 0 ? "Edit" : "Add"} information or update category.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cat_name">
                      Category Name *
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="cat_name"
                        onChange={(e) => onInputChange(e)}
                        ref={register({})}
                        //  value={editCat.label}
                        defaultValue={editCat ? editCat.label : formData.cat_name}
                        autoComplete="off"
                      />

                      <span className="text-danger">{errorList.cat_name}</span>
                    </div>
                  </div>
                </Col>

                <Col size="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cpm">
                      CPM *
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="cpm"
                        onChange={(e) => onInputChange(e)}
                        ref={register({})}
                        defaultValue={editCat ? editCat.cpm : formData.cpm}
                        // defaultValue={editCat.cpm}
                        autoComplete="off"
                      />
                      <span className="text-danger">{errorList.cpm}</span>
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cpc">
                      CPC *
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="cpc"
                        onChange={(e) => onInputChange(e)}
                        ref={register({})}
                        defaultValue={editCat ? editCat.cpc : formData.cpc}
                        //   defaultValue={editCat.cpc}
                        autoComplete="off"
                      />
                      <span className="text-danger">{errorList.cpc}</span>
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <Button color="primary" type="submit" disabled={formSave}>
                    {formSave && <Spinner size="sm" />}
                    <span>{editCatId > 0 ? "Update" : "Add"} Category</span>
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

export default CategoryList;
