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
  staffCreate,
  staffGetList ,
  couponupdate,
  getroledrop,
  staffUpdate,
  couponUserList,
  updateStaffStatus,
} from "../../app/api";
import Moment from "react-moment";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";




const CouponList = () => {
  const [udata,setUdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  const [editStaff, setStaffCoupon] = useState("");
  const [role, setRole] = useState("");
  const [editstaffId, setEditStaffId] = useState(0);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });

  const getUserdata = async () => {
    const res = await getroledrop();
    setUdata(res.data);
    // console.log(res);
  }

  const updateStatus = async (id,sts) => {
    setLoading(true);
    //console.log(id);
    const res = await updateStaffStatus(id,sts);
    if(res.code === 200) {
      getAdminCouponList();
    }
    setLoading(false);

  }


  const [adv, setadv] = useState(null);
  const couponGetUserlist = async () => {
    const res = await couponUserList();
    if (res.data) {
      setadv(res.data);
    }
  };

  const [data, setData] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role_id: "",
    email: "",
    password: "",
  });
  const resetForm = () => {
    setFormData({
        name: "",
        username: "",
        role_id: "",
        email: "",
        password: "",
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(20); 
  const [pgs, setPgs] = useState(0);

  // Get Coupon List

  const getAdminCouponList = async (pg = 1) => {
    setLoading(true);
    const res = await staffGetList(pg, itemPerPage);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };




  // submit function to add a new item
  const onFormSubmit = async (form) => {
    console.log(form);
    setLoading(true);
    if (editstaffId > 0) {
      const res = await staffUpdate(formData);
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
    } 
    else {
      const res = await staffCreate(formData);
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
    getAdminCouponList();
    resetForm();
    setModal({ add: false });
    // setFormData(false);
    setLoading(false);
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
    couponGetUserlist();
    getAdminCouponList();
    getUserdata();
  }, []);

  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Staff List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Staff List</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} Staff </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add New Staff </span>
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
                  <span className="sub-text"> User Name </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Role Name  </span>
                </DataTableRow>   
                <DataTableRow size="sm">
                  <span className="sub-text"> Status </span>
                </DataTableRow>        
               
                <DataTableRow size="md">
                  <span className="sub-text">Last Login</span>
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
                          {/* <span>{item.name}</span> */}
                          <span className="tb-lead">
                            {item.name}{" "}
                          </span>
                          <span>{item.email}</span>
                        </DataTableRow>  
                                          
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className={`badge badge-dim badge-dark`}><span>{item.role_name}</span></span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.status === 2 && (
                            <span className={`badge badge-dim badge-danger`}>
                              <span>Deactive</span>
                            </span>
                          )}
                          {item.status === 1 && (
                            <span className={`badge badge-dim badge-success`}>
                              <span>Active</span>
                            </span>
                          )}
                        </DataTableRow>
                    
                        <DataTableRow size="mb">
                          <span>{item.last_login}</span>
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
                                        href="#editstaff"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setEditStaffId(item.id);
                                          setStaffCoupon(item);
                                          setFormData(item);
                                          setModal({ add: true });
                                          setRole(item.roles_id);
                                          console.log(item);
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit Staff </span>
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
                                              updateStatus(item.id, 2)
                                            
                                            }}
                                          >
                                            <Icon name="icon ni ni-cross-round"></Icon>
                                            <span>Deactive</span>
                                          </DropdownItem>
                                        </li>
                                      ) : (
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateStatus(item.id, 1)
                                             
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
                  <span className="text-silent">No Staff found</span>
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
              <h5 className="title">{(editstaffId > 0) ? 'Edit' : 'Add New'} Staff </h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">  Name </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editStaff.name}
                        placeholder="Enter Name ..."
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Name is required",
                        })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">User Name </label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={editStaff.username}
                        placeholder="Enter User  Name ..."
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "User Name is required",
                        })}
                      />
                      {errors.username && <span className="invalid">{errors.username.message}</span>}
                    </FormGroup>
                  </Col>
                
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Role name </label>
                      <RSelect options={udata}  
                        name = "role_id"
                        value={(role) ? JSON.parse(role) : ''}
                        onChange={(e) => {
                        // setFormData({ ...formData, role_id: JSON.stringify(val) })}
                        setFormData({ ...formData, role_id: e.value, roles_id:JSON.stringify(e)})
                       //console.log(e.value);
                       setRole(JSON.stringify(e));
                       
                    }
                      } />
                      {errors.role_id && <span className="invalid">{errors.role_id.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editStaff.email}
                        placeholder="Enter Email Address ..."
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Email address is required",
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  {(editstaffId == 0) ? 
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password </label>
                      <input
                        type="password"
                        name="password"
                        defaultValue={editStaff.password}
                        placeholder="Enter Password  ..."
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Title Coupon Value is required",
                        })}
                      />
                      {errors.password && <span className="invalid">{errors.password.message}</span>}
                    </FormGroup>
                  </Col>
                  : ''}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                        {(editstaffId > 0) ? 'Update' : 'Create'}
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
