import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import * as moment from "moment";

import { Nav, NavItem, NavLink, Card, TabContent, TabPane, Badge, Form, Col, FormGroup, Row } from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  PreviewCard,
  RSelect,
  DataTable,
} from "../../components/Component";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { cmpImpReport } from "../../app/api";
import Loader from "../../app/Loader";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import exportFromJSON from "export-from-json";
import DatePicker from "react-datepicker";

const CampaignReportDetail = () => {
  const { campaign_id } = useParams();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [data, setData] = useState("");
  const [pgs, setPgs] = useState(0);
  const [sm, updateSm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [totals, setTotals] = useState(null);

  const getCmpDetail = async (cmp_id, pg = 1) => {
    // console.log(rangeDate)
    setLoading(true);
    const res = await cmpImpReport(cmp_id, pg, itemPerPage, rangeDate.start, rangeDate.end);
    // console.log(res.data);
    if (res.data) {
      setData(res.data);
      setPgs(res.row);
      setTotals(res.total);
    }
    setLoading(false);
  };

  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    // console.log(end)
    setRangeDate({ start: start, end: end });
    
  };

  const onReportSearch = async () => {
    getCmpDetail(campaign_id);
  };

  

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getCmpDetail(campaign_id, pageNumber);
    }
  };

  const exportExcel = () => {
     console.log(data);
    const fileName  = 'report';
    const exportType =  exportFromJSON.types.xls
    exportFromJSON({ data, fileName, exportType })
  }

  useEffect(() => {
    getCmpDetail(campaign_id);
  }, []);

  return (
    <React.Fragment>
      <Head title="Campaign Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Campaign Impressions & Clicks Report</BlockTitle>
              {/* <BlockDes className="text-soft">You have total {data.length}  Campaign </BlockDes> */}
              <BlockDes className="text-soft">Campaign Id : {atob(campaign_id)} </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
            <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button
                        color="light"
                        outline
                        className="bg-white d-none d-sm-inline-flex"
                        onClick={() => history.goBack()}
                      >
                        <Icon name="arrow-left"></Icon>
                        <span>Back</span>
                      </Button>
                      <a
                        href="#back"
                        onClick={(ev) => {
                          ev.preventDefault();
                          history.goBack();
                        }}
                        className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                      >
                        <Icon name="arrow-left"></Icon>
                      </a>
                    </li>
                    <li>
                      <div style={{ position: "relative" }}>
                        <DatePicker
                          selected={rangeDate.start}
                          startDate={rangeDate.start}
                          onChange={onRangeChange}
                          endDate={rangeDate.end}
                          maxDate ={new Date()}
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
                      &nbsp;
                      <Button color="secondary" onClick={exportExcel}>
                        <Icon name="download"></Icon>
                        {/* <span>Search</span> */}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <Button
                color="light"
                outline
                className="bg-white d-none d-sm-inline-flex"
                onClick={() => history.goBack()}
              >
                <Icon name="arrow-left"></Icon>
                <span>Back</span>
              </Button>
              <a
                href="#back"
                onClick={(ev) => {
                  ev.preventDefault();
                  history.goBack();
                }}
                className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
              >
                <Icon name="arrow-left"></Icon>
              </a>
              &nbsp; &nbsp;
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
              &nbsp; &nbsp;
              <Button color="secondary" onClick={exportExcel}>
                <Icon name="download"></Icon>
              </Button> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow size="lg">
                  <span className="sub-text">Date </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Impressions </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Clicks </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Amount </span>
                </DataTableRow>
                
                
              </DataTableHead>
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="user-info">
                            <span> {moment(item.Created).format("DD-MM-YYYY")}</span>
                          </div>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <span>{item.Imprs}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.Clicks}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>${item.Total}</span>
                        </DataTableRow>
                        
                      </DataTableItem>
                    );
                  })
                : null}
                {totals ? 
                  <DataTableItem key={0}>
                    <DataTableRow className="sm">
                      <span className="tb-amount">Total</span>
                    </DataTableRow>
                      
                    <DataTableRow size="lg">
                      <span className="tb-amount">{totals.total_impression}</span>
                    </DataTableRow>
                    <DataTableRow className="lg" >
                      <span className="tb-amount">{totals.total_click}</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <span className="tb-amount">${totals.total_amount}</span>
                    </DataTableRow>

    
                  </DataTableItem>
                : ''}
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
                  <span className="text-silent">No Impression & Clicks found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};
export default CampaignReportDetail;
