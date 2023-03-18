import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";


import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
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
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  LinkList,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import {
  getrole,
} from "../../app/api";
import Moment from "react-moment";
import Loader from "../../app/Loader";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const RolePermissionList = () => {
  const [loading, setLoading] = useState(false);
  const [sm, updateSm] = useState(false);
  const [data, setData] = useState("");

 
  /* Get Role & Permission List API */
  const getAdminRolePermission = async () => {
    setLoading(true);
    const res = await getrole();
    if (res.data) {
      setData(res.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAdminRolePermission();
  }, []);

  return (
    <React.Fragment>
      <Head title="List : : Role And Permission"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>  Manage Role & Permission </BlockTitle>
              <BlockDes className="text-soft">You have total {data.length} Role & Permissio</BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                        <Link to={`${process.env.PUBLIC_URL}/role-permission`}>
                                <Button color="primary">
                                    <Icon name="plus"></Icon>
                                    <span>Add New Role </span>
                            </Button>
                        </Link>
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
              <DataTableRow size="sm">
                  <span className="sub-text"> Sr.No. </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Role Name </span>
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
                              <span>{item.id}</span>
                            </DataTableRow>
                            <DataTableRow size="lg">
                              <span>{item.role_name}</span>
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
                                        href="#viewrole"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span> View  Role </span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#editrole"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span> Edit Role </span>
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
          </DataTable>
        </Block>
        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};
export default RolePermissionList;
