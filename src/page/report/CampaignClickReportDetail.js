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
import { clickReportExcel, cmpClickDetail } from "../../app/api";
import Loader from "../../app/Loader";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import exportFromJSON from "export-from-json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";


const CampaignClickReportDetail = () => {
  const { campaign_id } = useParams();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [data, setData] = useState("");
  const [pgs, setPgs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(20);
  const [sm, updateSm] = useState(false);
  const [totals, setTotals] = useState(null);

  const getCmpDetail = async (cmp_id, pg = 1) => {
    setLoading(true);
    const res = await cmpClickDetail(cmp_id, pg, itemPerPage, rangeDate.start, rangeDate.end);
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
  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getCmpDetail(campaign_id, pageNumber);
    }
  };
  const onReportSearch = async () => {
    getCmpDetail(campaign_id);
  };

  const [dataimp, setDataImp] = useState([]);

  
  const downloadPdf = async (campaign_id) => {
    setLoading(true);
    const res = await clickReportExcel(campaign_id);
    // console.log(res);
    if (res) {
      setDataImp(res);
    }
    setLoading(false);
      const data = res.data
    const doc = new jsPDF()
    doc.text("Click Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: data
    })
    doc.save('clickreport.pdf')
  }

  const columns = [
    { title: "Date", field: "created_at" },
    { title: "Ip Address", field: "ip_address" },
    { title: "Country", field: "country" },
    { title: "Amount", field: "amount", type: "currency" },
    { title: "Device OS", field: "device_os" },
    { title: "Device Type", field: "device_type" },
  ];

  const exportExcel = async (campaign_id) => {
    setLoading(true);
    const res = await clickReportExcel(campaign_id);

    if (res.data) {
    
      setDataImp(res.data);
    }
    setLoading(false);
    const data = res.data;
    const fileName  = 'clickreport';
    const exportType =  exportFromJSON.types.xls
    if(data) {
      exportFromJSON({ data, fileName, exportType })
    }
  }

  useEffect(() => {
    getCmpDetail(campaign_id);
  }, []);

  return (
    <React.Fragment>
      <Head title="Campaign Click Report"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Campaign Click Detail Report</BlockTitle>
              {/* <BlockDes className="text-soft">You have total {data.length}  Campaign </BlockDes> */}
              <BlockDes className="text-soft">Campaign Id : {atob(campaign_id)} </BlockDes>
              {/* <BlockDes className="text-soft">Date : {atob(detail_date)} </BlockDes> */}
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
                      <Button
                        color="primary"
                        onClick={(ev) => {
                          ev.preventDefault();
                          exportExcel(campaign_id);
                        }}
                        // onClick={exportExcel}
                      >
                        <Icon name="download"></Icon>
                        <span>Excel</span>
                      </Button>
                      &nbsp;

                      <Button
                        color="primary"
                        onClick={(ev) => {
                          ev.preventDefault();
                          downloadPdf(campaign_id);
                        }}
                        
                      >
                        <Icon name="download"></Icon>
                        <span>PDF</span>
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
                  <span className="sub-text"> Created on </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Clicks </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Amount </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Advertiser </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Device Type </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Device Os </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Ad Type </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Ip </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text"> Country </span>
                </DataTableRow>

                
                
              </DataTableHead>
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.date}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-product">
                            <span className="title">{item.click_total}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className="tb-product">
                          <span className="title">${item.total}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span className="tb-product">
                            <span className="title">{item.advertiser_code}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.device_type}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span>{item.device_os}</span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className={`badge badge-dim badge-dark`}><span>{item.ad_type}</span></span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className="tb-product">
                            <span className="title">{item.ip_address}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="lg" style={{ width: "5px !important" }}>
                          <span className={`badge badge-dim badge-dark`}><span>{item.country}</span></span>
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
                      <span className="tb-amount">{totals.total_click}</span>
                    </DataTableRow>
                    <DataTableRow className="lg" >
                      <span className="tb-amount">${totals.total_amount}</span>
                    </DataTableRow>
                    {/* <DataTableRow size="lg" className="text-right">
                      <span className="tb-amount">0</span>
                    </DataTableRow> */}

    
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
                  <span className="text-silent">No Detail found</span>
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
export default CampaignClickReportDetail;
