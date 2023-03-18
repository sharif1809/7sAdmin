import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
;
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
import {noticeList, noticeCreate, noticeUpdate, noticeStatusUpdate, deleteNotice } from "../../app/api";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import * as moment from 'moment';

const NoticeList = () => {
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });

  
  
  const [data, setData] = useState('');
  const [errorList, setError] = useState([])
  const [formData, setFormData] = useState({
      title: "",
      link: "",
      description: "",
      errorList:[],
  });
  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      description: "",
      errorList:[],
      
    });
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  
  
  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [statustype, setStatustype] = useState('');
  const [pgs, setPgs] = useState(0);
  

  // Get Notification List

  const getNotice = async (pg=1,src='') => {
    setLoading(true);
    const res = await noticeList (pg, itemPerPage, src);
    if(res.data)
    {
      setData(res.data);
      setPgs(res.row)
    }
      setLoading(false);
  }

  const [editNotice, setEditnotice] = useState("");
  const [editnoticecId, setEditNoticeId] = useState(0);

  // submit function to add a new item
  const onFormSubmit = async (form) => {
    console.log(formData);
    setLoading(true);
    if (editnoticecId > 0) {
      const res = await noticeUpdate(formData);
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
        getNotice();
        
      }
      else {
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
      const res = await noticeCreate(form);
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
        getNotice();
        setLoading(false);
        setError(false);
        setModal({ add: false });
      }
      else if(res.code === 100)
      {
        setError(res.error);
        setModal({ add: true });
      }
      else {
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
    getNotice();
    resetForm();
    // setFormData(false);
    setLoading(false);
  };

  const updateNoticeSts = async (id,sts) => {
    setLoading(true);
    const res = await noticeStatusUpdate (id,sts);
    if(res.code === 200) {
      getNotice();
    }
    setLoading(false);

  }
  
  const onFilterChange = (val) => {
    getNotice('', val);
    };
  
  // function to delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    const res = await deleteNotice(id)
    if(res.code === 200)
    {
        toast.success("Notice Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getNotice();
    } 
    else
    {
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if(currentPage !== pageNumber) {
      getNotice(pageNumber)
    }
  }


  useEffect( () => {
    getNotice();
    
  }, []);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Manage Notice"></Head>
      <Content>
      <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Notice List</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} notice's</BlockDes>
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
                        <div className="form-icon form-icon-right">
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search Title"
                         onChange={(e) => { 
                            onFilterChange(e.target.value)
                          }}
                        />
                      </div>
                    </li> 
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add New Notice</span>
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
                  <span className="sub-text">Link</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Description</span>
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
                          <div className="tb-product">
                            <span className="title">{item.title}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            <span className="title">{item.link}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.description}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          {item.status === 1 && <span className={`badge badge-dim badge-danger`}><span>Inactive</span></span>}
                          {item.status === 2 && <span className={`badge badge-dim badge-success`}><span>Active</span></span>}
                        </DataTableRow>
                        <DataTableRow size="mb">
                        <span> {moment(item.created_at).format('DD-MM-YYYY')}</span>
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
                                          setEditNoticeId(item.id);
                                          setEditnotice(item);
                                          setFormData(item);
                                          setModal({ add: true });
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit Coupon</span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      {(item.status === 1) ? 
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateNoticeSts(item.id, 2)
                                            }}
                                          >
                                            <Icon name="icon ni ni-play"></Icon>
                                            <span>Active</span>
                                            
                                          </DropdownItem>
                                        </li>
                                        
                                      : (item.status === 2) ? 
                                        

                                        <DropdownItem
                                          tag="a"
                                          href="#markasdone"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            updateNoticeSts(item.id, 1)
                                          }}
                                        >
                                          <Icon name="icon ni ni-cross-round"></Icon>
                                          <span>Inactive</span>
                                          
                                        </DropdownItem>
                                        
                                      
                                      : '--'}
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
                                                deleteProduct(item.id);
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
                  <span className="text-silent">No notification found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal isOpen={modal.add} toggle={() => setModal(false)}  className="modal-dialog-centered" size="md">
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
              <h5 className="title">{(editnoticecId > 0) ? 'Update' : 'Add'} Notice</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={formData.title}
                        placeholder="Enter title"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-control"
                        ref={register({ })}
                      />
                      <span className="text-danger">{errorList.title}</span>
                      
                      {/* {errors.ip_addr && <span className="invalid">{errors.ip_addr.message}</span>} */}
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Link</label>
                      <input
                        type="text"
                        name="link"
                        defaultValue={formData.link}
                        placeholder="Enter link "
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="form-control"
                        ref={register({ })}
                      />
                      
                      <span className="text-danger">{errorList.link}</span>
                      {/* {errors.desc && <span className="invalid">{errors.ip_addr.desc}</span>} */}
                    </FormGroup>
                  </Col>
                  
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        name="description"
                        defaultValue={formData.description}
                        placeholder="Enter description "
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-control"
                        ref={register({ })}
                      />
                      
                      <span className="text-danger">{errorList.description}</span>
                      {/* {errors.desc && <span className="invalid">{errors.ip_addr.desc}</span>} */}
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                        {(editnoticecId > 0) ? 'Update' : 'Create'}
                        </Button>
                      </li>
                      
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        
                      
        
        <ToastContainer/>
      </Content>
    </React.Fragment>
  );
};

export default NoticeList;
