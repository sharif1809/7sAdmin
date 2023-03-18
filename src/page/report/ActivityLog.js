import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import * as moment from "moment";

import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Icon,
} from "../../components/Component";
import { getAcountActivity, getAcountActivityImportExcelReport } from "../../app/api";
import Moment from "react-moment";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import exportFromJSON from "export-from-json";
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import DatePicker from "react-datepicker";

const ActivityLog = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  const [sm, updateSm] = useState(false);

  const [pgs, setPgs] = useState(0);

  // Get activity List
  const getActivityList = async (pg = 1, lim = 0, src = "") => {
    setLoading(true);
    let itemLim = lim > 0 ? lim : itemPerPage;
    const res = await getAcountActivity(pg, itemLim, src, rangeDate.start, rangeDate.end);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
    }
    setLoading(false);
  };

  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const onReportSearch = async () => {
    getActivityList();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getActivityList(pageNumber);
    }
  };

  const onFilterChange = (val) => {
    getActivityList("", "", val);
  };

  const exportExcel = async () => {
    setLoading(true);
    const res = await getAcountActivityImportExcelReport(rangeDate.start, rangeDate.end);
    setLoading(false);
    const data = res.data;
    const fileName = "ActivityReport";
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  useEffect(() => {
    getActivityList();
  }, []);

  return (
    <React.Fragment>
      <Head title="User Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Activity Log List</BlockTitle>
              <BlockDes className="text-soft">You have total {pgs} Activity </BlockDes>
            </BlockHeadContent>
            <div className="toggle-wrap nk-block-tools-toggle">
              <div className="toggle-expand-content">
                <ul className="nk-block-tools g-3">
                  <li>
                    <div className="form-control-wrap">
                      <div className="form-icon form-icon-right"></div>
                      <input
                        type="text"
                        className="form-control"
                        id="default-04"
                        placeholder="Search UID"
                        onChange={(e) => {
                          onFilterChange(e.target.value);
                        }}
                      />
                    </div>
                  </li>

                  <li>
                    <div style={{ position: "relative" }}>
                      <DatePicker
                        selected={rangeDate.start}
                        startDate={rangeDate.start}
                        onChange={onRangeChange}
                        endDate={rangeDate.end}
                        selectsRange
                        className="form-control date-picker"
                        dateFormat="dd-M-yyyy"
                      />
                    </div>
                  </li>
                  <li className="nk-block-tools-opt">
                    <Button color="primary" onClick={onReportSearch}>
                      <Icon name="search"></Icon>
                      <span>Search</span>
                    </Button>
                  </li>
                  <li>
                    <div className="form-control-wrap">
                      <div className="form-icon form-icon-right"></div>
                      <Button color="secondary" onClick={exportExcel}>
                        <Icon name="download"></Icon>
                      </Button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow size="lg">
                  <span className="tb-product">
                    <span className="title"> Created On </span>
                  </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="tb-product">
                    <span className="title"> Created By</span>
                  </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="tb-product">
                    <span className="title"> Description </span>
                  </span>
                </DataTableRow>
                {/* <DataTableRow size="lg">
                  <span className="tb-product">
                    <span className="title"> Status </span>
                  </span>
                </DataTableRow> */}
              </DataTableHead>
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow size="mb">
                          <span> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <div className="user-info">
                            <span className="tb-lead">{item.uid}</span>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.description}</span>
                        </DataTableRow>
                        {/* <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className={`badge badge-dim badge-success`}>
                            <span>Active</span>
                          </span>
                        </DataTableRow> */}
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
                    <span className="text-silent">No User found</span>
                  </div>
                )}
              </div>
              <div style={{ alignSelf: "end" }}>
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" className="dropdown-toggle bg-white btn btn-sm btn-outline-light btn-icon">
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
                            getActivityList(1, 10);
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
                            getActivityList(1, 20);
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
                            getActivityList(1, 50);
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
                            getActivityList(1, 100);
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
                            getActivityList(1, 500);
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
          </DataTable>
        </Block>

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};
export default ActivityLog;
