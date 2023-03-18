import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import * as moment from 'moment';
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
import { blockIpCreate, blockIpList, blockIpStatusUpdate, ipInfo } from "../../app/api";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const BlockIpList = () => {
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  
  const [modal, setModal] = useState(false);

  
  
  const [data, setData] = useState('');
  const [errorList, setError] = useState([])
  const [formData, setFormData] = useState({
      ip_addr: "",
      desc: "",
      errorList:[],
  });
  const resetForm = () => {
    setFormData({
      ip_addr: "",
      desc: "",
      errorList:[],
      
    });
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  
  const filterStatusType = [
    { value: "0", label: "Inreview" },
    { value: "1", label: "Blocked" },
    { value: "2", label: "Unblocked" },
  ];

  
  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [statustype, setStatustype] = useState('');
  const [pgs, setPgs] = useState(0);
  
  const getStatusType = () => {
    let adt = '';
    if(statustype == 'Inreview') {
      adt = 0;
    } else if(statustype == 'Blocked') {
      adt = 1;
    } else if(statustype == 'Unblocked') {
      adt = 2;
    }
    return adt;
  }

  // Get Notification List

  const getAdminBlockIp = async (type = '', pg=1, src='') => {
    setLoading(true);
    const res = await blockIpList (type, pg, itemPerPage, src);
    console.log(res);
    if(res.data)
    {
      setData(res.data);
      setPgs(res.row)
    }
      setLoading(false);
  }

  const [ipdetail, setIpDetail] = useState('');
  const getIpInfo = async (ip) => {

    setLoading(true);
    const res = await ipInfo(ip);
    if(res.data)
    {
      setIpDetail(res.data);
    }
    setLoading(false);
  }

  // submit function to add a new item
  const onFormSubmit = async (sData) => {
    //console.log(formData);
    setLoading(true);
    const res = await blockIpCreate(formData);
    //console.log(res.data);
    if(res.code === 200)
    {
      toast.success("Ip Added Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getAdminBlockIp();
      setLoading(false);
      setError(false);
      onFormCancel();
      setModal(false);
    }
    else if(res.code === 100)
    {
      setError(res.error);
      setModal({ add: true });
      setLoading(false);
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

  //  getAdminBlockIp();
  //  resetForm()
  //  setModal({ add: false });
  //  setFormData(false);
  }

  const onFilterChange = (val) => {
    //  let hhh =  setSearchText(e.target.value);
    getAdminBlockIp('', '', val);
    };

  const updateBlockIp = async (id,sts) => {
    setLoading(true);
    const res = await blockIpStatusUpdate (id,sts);
    if(res.code === 200)
    {
      toast.success("Status Change Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getAdminBlockIp();
      setLoading(false);
      setError(false);
    }
    else if(res.code === 101)
      {
        toast.error(res.message, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
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

  }

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false, ipinfo: false });
    resetForm();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if(currentPage !== pageNumber) {
      let adt = getStatusType();
      getAdminBlockIp(adt, pageNumber)
    }
  }


  useEffect( () => {
    getAdminBlockIp();
    
  }, []);

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Block Ip List"></Head>
      <Content>
      <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>IP List</BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} IP's</BlockDes>
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
                          placeholder="Search IP"
                          onChange={(e) => { 
                            onFilterChange(e.target.value)
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
                                  getAdminBlockIp()
                                  setStatustype('')
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
                                  getAdminBlockIp(0)
                                  setStatustype('Inreview')
                                }}
                              >
                                <span>Inreview</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getAdminBlockIp(1)
                                  setStatustype('Blocked')
                                }}
                              >
                                <span>Blocked</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getAdminBlockIp(2)
                                  setStatustype('Unblocked')
                                }}
                              >
                                <span>UnBlocked</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt" onClick={() => setModal({ add: true })}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Block New IP</span>
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
                  <span className="sub-text">Created By </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">IP-Addresses</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Description</span>
                </DataTableRow>

                <DataTableRow size="lg">
                  <span className="sub-text">IP Type</span>
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
                          <div className="user-info">
                            <span className="tb-lead">  {item.uid}</span>
                               {/* <span>{item.uid}</span> */}
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="tb-product">
                            <span className="title">{item.ip}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.desc}</span>
                        </DataTableRow>

                        <DataTableRow size="md">
                          {item.ip_type == 'real' && <span className={`badge badge-sm badge-dim badge-outline-success d-none d-md-inline-flex`}><span>Real</span></span>}
                          {item.ip_type == 'proxy' && <span className={`badge badge-sm badge-dim badge-outline-danger d-none d-md-inline-flex`}><span>Proxy</span></span>}
                          
                        </DataTableRow>

                        <DataTableRow size="md">
                          {item.status === 0 && <span className={`badge badge-dim badge-primary`}><span>Inreview</span></span>}
                          {item.status === 1 && <span className={`badge badge-dim badge-danger`}><span>Blocked</span></span>}
                          {item.status === 2 && <span className={`badge badge-dim badge-success`}><span>Unblocked</span></span>}
                        </DataTableRow>
                        <DataTableRow size="mb">
                        {/* <span> {item.created_at} </span> */}
                        <span> {moment(item.created_at).format('DD-MM-YYYY HH:mm:ss A')} </span>
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
                                      {(item.status === 0) ? 
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateBlockIp(item.id, 2)
                                            }}
                                          >
                                            <Icon name="icon ni ni-cross-round"></Icon>
                                            <span>UnBlocked</span>
                                            
                                          </DropdownItem>

                                          <DropdownItem
                                            tag="a"
                                            href="#markasdone"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateBlockIp(item.id, 1)
                                            }}
                                          >
                                            <Icon name="icon ni ni-cross-round"></Icon>
                                            <span>Blocked</span>
                                            
                                          </DropdownItem>

                                        </li>
                                        
                                      : (item.status === 1) ? 
                                        

                                        <DropdownItem
                                          tag="a"
                                          href="#markasdone"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            updateBlockIp(item.id, 2)
                                          }}
                                        >
                                          <Icon name="icon ni ni-cross-round"></Icon>
                                          <span>UnBlocked</span>
                                          
                                        </DropdownItem>
                                        
                                      : (item.status === 2) ?
                                      

                                        <DropdownItem
                                          tag="a"
                                          href="#markasdone"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            updateBlockIp(item.id, 1)
                                          }}
                                        >
                                          <Icon name="icon ni ni-cross-round"></Icon>
                                          <span>Blocked</span>
                                          
                                        </DropdownItem>
                                        

                                      : '--'}
                                    </li>

                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#modal"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          getIpInfo(item.ip);
                                          //toggle("ipinfo");
                                          setModal({ ipinfo: true })
                                        }}
                                        
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>View IP info</span>
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

        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })}  className="modal-dialog-centered" size="md">
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
              <h5 className="title">Add New IP</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">IP</label>
                      <input
                        type="text"
                        name="ip_addr"
                        defaultValue={formData.ip_addr}
                        placeholder="Enter IP address"
                        onChange={(e) => setFormData({ ...formData, ip_addr: e.target.value })}
                        className="form-control"
                        ref={register({ })}
                      />
                      <span className="text-danger">{errorList.ip_addr}</span>
                      
                      {/* {errors.ip_addr && <span className="invalid">{errors.ip_addr.message}</span>} */}
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        name="desc"
                        defaultValue={formData.ip}
                        placeholder="Enter description "
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        className="form-control"
                        ref={register({ })}
                      />
                      
                      <span className="text-danger">{errorList.desc}</span>
                      {/* {errors.desc && <span className="invalid">{errors.ip_addr.desc}</span>} */}
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
                      
        <Modal isOpen={modal.ipinfo} toggle={() => setModal({ ipinfo: false })}className="modal-dialog-centered" size="lg">
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
                IP <small className="text-primary">{ipdetail.query}</small>
              </h4>
              
            </div>
            { ipdetail.status == 'success' ? (
            <div className="nk-tnx-details mt-sm-3">
              
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Country</span>
                  <span className="caption-text">{ipdetail.country}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Country Code</span>
                  <span className="caption-text">{ipdetail.countryCode}</span>
                </Col>
                
                <Col lg={6}>
                  <span className="sub-text">Region</span>
                  <span className="caption-text"> {ipdetail.regionName}</span>
                </Col>

                <Col lg={6}>
                  <span className="sub-text">City</span>
                  <span className="caption-text"> {ipdetail.city}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Zipcode</span>
                  <span className="caption-text"> {ipdetail.zip}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">TimeZone</span>
                  <span className="caption-text"> {ipdetail.timezone}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Latitude</span>
                  <span className="caption-text"> {ipdetail.lat}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Longitude</span>
                  <span className="caption-text"> {ipdetail.lon}</span>
                </Col>
              </Row>
            </div>
           ) : (
             <div className="text-center">
              <span className="text-silent">No Data Found (Private range ip address)</span>
            </div>
          )}
          </ModalBody>
        </Modal>

       
        <ToastContainer/>
      </Content>
    </React.Fragment>
  );
};

export default BlockIpList;
