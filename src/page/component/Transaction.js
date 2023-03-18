import React, { useEffect, useState } from "react";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Button, Modal, ModalBody, Row, Col } from "reactstrap";
import { useParams } from "react-router";
import {
  Block,
  BlockHead,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  Icon,
  PaginationComponent,
} from "../../components/Component";
import Loader from "../../app/Loader";
import { transactionList } from "../../app/api";
import Moment from "react-moment";
import { Link } from "react-router-dom";

const Transactions = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [trasac, setTransac] = useState(null);
  const [pgtn, setPgtn] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const getTransactionList = async (adv, pg = 1) => {
    setLoading(true);
    const res = await transactionList(atob(adv), pg, itemPerPage);
    if (res.data) {
      setTransac(res.data);
      setPgtn(res.row);
    }
    setLoading(false);
  };

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      getTransactionList(uid, pageNumber);
    }
  };
  useEffect(() => {
    getTransactionList(uid);
  }, []);
  return (
    <div className="card-inner">
      <Loader visible={loading} />
      <Block>
        <BlockHead>
          <p>Total {pgtn} Transactions.</p>
        </BlockHead>
        <Card className="card-bordered">
          <div className="card-inner-group">
            <div className="card-inner p-0">
              <DataTableBody>
                <DataTableHead>
                  <DataTableRow>
                    <span className="sub-text">Advertiser</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <span className="sub-text">Amount</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <span className="sub-text">Remark</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <span className="sub-text">Payment Mode</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Payment Id</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Payment Type</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Created</span>
                  </DataTableRow>
                  {/* <DataTableRow size="md">
                    <span className="sub-text">Action</span>
                  </DataTableRow> */}
                </DataTableHead>
                {trasac != null
                  ? trasac.map((item) => {
                      return (
                        <DataTableItem key={item.id}>
                          <DataTableRow>
                            <div className="user-info">
                              <span className="tb-lead">{item.advertiser_code} </span>
                              <span>{item.transaction_id}</span>
                            </div>
                          </DataTableRow>

                          <DataTableRow size="lg">
                            <span className="tb-product">
                              <span className="title">${item.amount}</span>
                            </span>
                          </DataTableRow>
                          <DataTableRow size="lg">
                            <span className="title">{item.remark}</span>
                          </DataTableRow>
                          <DataTableRow size="lg">
                            <span className={`badge badge-dim badge-dark`}>
                              <span>{item.payment_mode}</span>
                            </span>
                          </DataTableRow>

                          <DataTableRow size="md">
                            <span>{item.payment_id}</span>
                          </DataTableRow>

                          <DataTableRow size="lg">
                            {item.pay_type == "credit" && (
                              <span
                                className={`badge badge-sm badge-dim badge-outline-success d-none d-md-inline-flex`}
                              >
                                <span>
                                  <em class="icon ni ni-arrow-down-left"></em> Credit
                                </span>
                              </span>
                            )}
                            {item.pay_type == "debit" && (
                              <span className={`badge badge-sm badge-dim badge-outline-danger d-none d-md-inline-flex`}>
                                <span>
                                  <em class="icon ni ni-arrow-up-right"></em> Debit
                                </span>
                              </span>
                            )}
                          </DataTableRow>

                          <DataTableRow size="md">
                            <span className="tb-product">
                              <span className="title">
                                <Moment format="DD-MM-YYYY HH:mm:ss A">{item.created_at}</Moment>
                              </span>
                            </span>
                          </DataTableRow>
                          {/* <DataTableRow className="nk-tb-col-tools text-right">
                            <ul className="nk-tb-actions gx-1">
                              <li>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="a"
                                    className="text-soft dropdown-toggle btn btn-icon btn-trigger"
                                  >
                                    <Icon name="more-h"></Icon>
                                  </DropdownToggle>
                                  <DropdownMenu right>
                                    <ul className="link-list-opt no-bdr">
                                      <li>
                                        <Link
                                          to={`${process.env.PUBLIC_URL}/transactions-view/${btoa(
                                            item.transaction_id
                                          )}`}
                                        >
                                          <Icon name="file-text"></Icon>
                                          <span> Generate Invoice </span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </li>
                            </ul>
                          </DataTableRow> */}
                        </DataTableItem>
                      );
                    })
                  : null}
              </DataTableBody>
              <div className="card-inner">
                {trasac != null ? (
                  <PaginationComponent
                    itemPerPage={itemPerPage}
                    totalItems={pgtn}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-silent">No Transactions found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Block>
      <div className="nk-divider divider md"></div>
    </div>
  );
};
export default Transactions;
