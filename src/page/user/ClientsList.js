import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import * as moment from "moment";

import {
  Block,
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
} from "../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { deleteClients, getClientList, updateUserAcountType, updateUserStatus, loginAsUserApi, getCmpListCategoryList } from "../../app/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";
import { Link } from "react-router-dom";

const ClientsList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [sm, updateSm] = useState(false);
  const [userstatus, setUserstatus] = useState("");

  const getUserStatus = () => {
    let usr = "";
    if (userstatus == "Active") {
      usr = 0;
    } else if (userstatus == "Inactive") {
      usr = 1;
    } else if (userstatus == "pending") {
      usr = 2;
    } else if (userstatus == "Suspended") {
      usr = 3;
    } else if (userstatus == "Hold") {
      usr = 4;
    }
    return usr;
  };

  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  //console.log(editUserId);

  // Changing state value when searching name
  const getUsersData = async (cat, type = "", acnt_type = 0, src = "", usertype = 2) => {
    setLoading(true);
    const res = await getClientList(cat, type, acnt_type, src, usertype);
    if (res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const [categlist, setCategory] = useState(null);
  const [cat, setCat] = useState(null);
  const [catName, setCatName] = useState(null);

  const getCategory = async () => {
    const res = await getCmpListCategoryList();
    // console.log(res);
    setCategory(res);
  };

  const updateUser = async (uid, sts) => {
    setLoading(true);
    const res = await updateUserStatus(uid, sts);
    if (res.code === 200) {
      getUsersData();
    }
    setLoading(false);
  };

  const updateAcountType = async (uid, acount_type) => {
    setLoading(true);
    const res = await updateUserAcountType(uid, acount_type);
    if (res.code === 200) {
      getUsersData();
    }
    setLoading(false);
  };
  const loginAsUser = async (uid) => {
    const res = await loginAsUserApi(uid);
    console.log(res);
    if (res.token) {
      let str = window.btoa(res.token + "|" + res.email);
      window.open("https://advertiser.7searchppc.com/auto-auth/" + str, "_blank");
    } else {
      setTimeout(() => {
        setError("Cannot login with credentials");
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getUsersData();
    getCategory();
  }, []);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onChange function for searching name
  const onFilterChange = (val) => {
    //  let hhh =  setSearchText(e.target.value);
    getUsersData("","", 0, val);
  };

  // function to delete a product
  const deleteProduct = async (uid) => {
    setLoading(true);
    const res = await deleteClients(uid);
    if (res.code === 200) {
      toast.success("User Deleted Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      getUsersData();
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

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="Client User's List"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Client User's List</BlockTitle>
              <BlockDes>You have total {data.length} clients</BlockDes>
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
                          placeholder="Search Name, UID & Email"
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
                                  setCatName("");
                                  getUsersData("");
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
                                          getUsersData(item.value);
                                        }}
                                        defaultValue={{ label: "test", value: cat }}
                                      >
                                        <span>{item.label}</span>
                                        {/* {item.label === item.label && <Icon name="check" style={{position:'absolute', right:'10px', fontSize:'14px'}} />} */}
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
                          <span>Filtered By {userstatus}</span>
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
                                  getUsersData(cat, "");
                                  setUserstatus("");
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
                                  getUsersData(cat, "0");
                                  setUserstatus("Active");
                                }}
                              >
                                <span>Active</span>
                                {userstatus === "Active" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li>
                            {/* <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getUsersData("1");
                                  setUserstatus("Inactive");
                                }}
                              >
                                <span>Inactive</span>
                                {userstatus === "Inactive" && (
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
                                  getUsersData("2");
                                  setUserstatus("Pending");
                                }}
                              >
                                <span>Pending</span>
                                {userstatus === "Pending" && (
                                  <Icon
                                    name="check"
                                    style={{ position: "absolute", right: "10px", fontSize: "14px" }}
                                  />
                                )}
                              </DropdownItem>
                            </li> */}
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  getUsersData(cat,"3");
                                  setUserstatus("Suspended");
                                }}
                              >
                                <span>Suspend</span>
                                {userstatus === "Suspended" && (
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
                                  getUsersData(cat,"4");
                                  setUserstatus("Hold");
                                }}
                              >
                                <span>Hold </span>
                                {userstatus === "Hold" && (
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
                      <span className="sub-text">Advertisers</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Total Campaigns</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Country</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Email</span>
                    </DataTableRow>
                    {/* <DataTableRow>
                      <span className="sub-text">User Type</span>
                    </DataTableRow> */}
                    <DataTableRow>
                      <span className="sub-text">Website Category</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className="sub-text">Status</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Joined On</span>
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
                            <DataTableRow>
                              <div className="user-info">
                                <Link to={`${process.env.PUBLIC_URL}/user-details/${btoa(item.uid)}`}>
                                  <span className="tb-lead">{item.name} </span>
                                  <span>{item.uid}</span>
                                </Link>
                              </div>
                            </DataTableRow>

                            <DataTableRow>
                              <div className="user-info">
                                <span className={`badge badge-dim badge-dark`}>{item.cmpcount}</span>
                              </div>
                            </DataTableRow>
                            <DataTableRow>
                              <div className="user-info">
                                <span className={`badge badge-dim badge-dark`}>{item.country}</span>
                              </div>
                            </DataTableRow>

                            <DataTableRow>
                              <div className="user-info">
                                <span>{item.email}</span>
                              </div>
                            </DataTableRow>

                            {/* <DataTableRow size="md">
                              {item.user_type === 1 ? (
                                <span className={`badge badge-dim badge-dark`}>Advertiser</span>
                              ) : item.user_type === 2 ? (
                                <span className={`badge badge-dim badge-primary`}>Publisher</span>
                              ) : item.user_type === 3 ? (
                                <span className={`badge badge-dim badge-danger`}>Both</span>
                              ) : (
                                "--"
                              )}
                            </DataTableRow> */}

                            <DataTableRow size="md">
                              <span className="title">{item.cat_name}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              {item.status === 0 && (
                                <span className={`badge badge-dim badge-success`}>
                                  <span>Active</span>
                                </span>
                              )}
                              {item.status === 1 && (
                                <span className={`badge badge-dim badge-primary`}>
                                  <span>Inactive</span>
                                </span>
                              )}
                              {item.status === 2 && (
                                <span className={`badge badge-dim badge-warning`}>
                                  <span>Pending</span>
                                </span>
                              )}
                              {item.status === 3 && (
                                <span className={`badge badge-dim badge-danger`}>
                                  <span>Suspended</span>
                                </span>
                              )}
                              {item.status === 4 && (
                                <span className={`badge badge-dim badge-info`}>
                                  <span>Hold</span>
                                </span>
                              )}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
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
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              loginAsUser(item.uid);
                                            }}
                                          >
                                            <Icon name="user"></Icon>
                                            <span> Login As User </span>
                                          </DropdownItem>
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
                                                  deleteProduct(item.uid);
                                                }
                                              });
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove User</span>
                                          </DropdownItem>
                                        </li>
                                        {item.status === 0 ? (
                                          <li>
                                            {/* <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateUser(item.uid, 2);
                                              }}
                                            >
                                              <Icon name="histroy"></Icon>
                                              <span>Pending</span>
                                            </DropdownItem> */}

                                            <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateUser(item.uid, 3);
                                              }}
                                            >
                                              <Icon name="icon ni ni-na"></Icon>
                                              <span>Suspend</span>
                                            </DropdownItem>
                                            {/* <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateUser(item.uid, 1);
                                              }}
                                            >
                                              <Icon name="icon ni ni-cross-round"></Icon>
                                              <span>Inactive</span>
                                            </DropdownItem> */}
                                            <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateUser(item.uid, 4);
                                              }}
                                            >
                                              <Icon name="icon ni ni-alert-circle-fill"></Icon>
                                              <span>Hold</span>
                                            </DropdownItem>
                                          </li>
                                        ) : (
                                          <li>
                                            <DropdownItem
                                              tag="a"
                                              href="#markasdone"
                                              onClick={(ev) => {
                                                ev.preventDefault();
                                                updateUser(item.uid, 0);
                                              }}
                                            >
                                              <Icon name="play"></Icon>
                                              <span>Active</span>
                                            </DropdownItem>
                                          </li>
                                        )}
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              updateAcountType(item.uid, 1);
                                            }}
                                          >
                                            <Icon name="home"></Icon>
                                            <span>Make Inhouse</span>
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
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No User found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default ClientsList;
