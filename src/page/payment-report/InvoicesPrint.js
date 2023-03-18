import React, { useState, useEffect } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import LogoDark from "../../images/logo1.png";
import { toast, ToastContainer } from "react-toastify";
import { Icon, Block } from "../../components/Component";
import { transactionReportView } from "../../app/api";
import { useParams } from "react-router";
import Moment from "react-moment";

const InvoicesPrint = () => {
  const { transactionid } = useParams();
  const [cdata, setData] = useState(null);
  const getReport = async () => {
    const res = await transactionReportView(atob(transactionid));
    console.log(res);
    if (res.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getReport();
    setTimeout(() => window.print(), 500);
  }, []);
  return (
    <body className="bg-white">
      <Head title="Invoice Print"></Head>
      <Content>
        <div style={{ background: "#fff", padding: 20 }}>
          <table
            style={{
              width: "100%",
              margin: "auto",
              color: "#666",
              fontFamily: "sans-serif",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: "1.6em",
              background: "#ffffff",
              borderCollapse: "collapse",
            }}
            border="0"
          >
            <tr>
              <td>
                <table
                  style={{
                    width: "100%",
                    padding: 0,
                    margin: 0,
                    color: "#666",
                    fontFamily: "sans-serif",
                    fontSize: 14,
                    fontWeight: "400",
                    lineHeight: "1.6em",
                    borderCollapse: "collapse",
                  }}
                  border="0"
                >
                  <tr>
                    <td>
                      <div class="tm_logo">
                        <img src="https://www.7searchppc.com/assets/images/logo/logo.png" alt="Logo" />
                      </div>
                    </td>
                    <td
                      style={{
                        position: "relative",
                        textAlign: "right",
                        background: "#fff",
                        minHeight: 18,
                        paddingTop: 25,
                        paddingLeft: 30,
                        color: "#fff",
                        textTransform: "uppercase",
                        fontSize: 50,
                        lineHeight: "1em",
                        backgroundImage: "url(https://services.7searchppc.com/public/images/mail/topbg.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right",
                        backgroundSize: "100%, 100%",
                      }}
                    >
                      {" "}
                      Invoice
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style={{ height: 10 }}>
                      {" "}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <b style={{ color: "#000" }}>Payment Method: </b> {cdata !== null ? cdata.payment_mode : "0"}
                    </td>
                    <td
                      style={{
                        position: "relative",
                        textAlign: "right",
                        background: "#fff",
                        minHeight: 18,
                        paddingTop: 5,
                        paddingLeft: 20,
                        backgroundImage: "url(https://services.7searchppc.com/public/images/mail/topbg.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right",
                      }}
                    >
                      <span style={{ color: "#fff" }}>
                        Invoice No: <b>{cdata !== null ? cdata.transaction_id : "0"}</b> Date:{" "}
                        <b>{cdata !== null && <Moment format="DD MMM YYYY">{cdata.created_at}</Moment>} </b>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", paddingTop: 20 }}>
                      <p>
                        <b style={{ color: "#000" }}>Invoice To:</b>
                        <br />
                        <h6 style={{ marginTop: 8 }}>{cdata !== null ? cdata.name : "0"} </h6>
                        {cdata !== null ? cdata.address_line1 : ""}
                        <br />
                        {cdata !== null ? cdata.address_line2 : ""}
                        {cdata !== null ? cdata.city : ""}
                        <br />
                        {cdata !== null ? cdata.state + ", " : ""}
                        {cdata !== null ? cdata.country : ""}
                        <br />
                        <br />
                        Phone No. : {cdata !== null ? cdata.phone : "0"}
                        <br />
                        Email : {cdata !== null ? cdata.email : "0"}
                        <br />
                        <br />
                      </p>
                    </td>
                    <td style={{ textAlign: "right", paddingTop: 20 }}>
                      <p>
                        <b style={{ color: "#000" }}>Pay To:</b>
                        <br />
                        7SearchPPC.com <br />
                        contact@7searchppc.com
                      </p>
                      <p>
                        <b style={{ color: "#000" }}>GSTIN:</b>
                        09AAECL2613D1ZW <br />
                        (LOGELITE PRIVATE LIMITED)
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <table style={{ width: "100%", borderCollapse: "collapse" }} border="0">
                        <thead>
                          <tr
                            style={{
                              background: "#d15555",
                              color: "#fff",
                              fontWeight: "600",
                              textAlign: "left",
                            }}
                          >
                            <th
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                              }}
                            >
                              DESCRIPTION
                            </th>
                            <th
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                              }}
                            >
                              QUANTITY
                            </th>
                            <th
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                              }}
                            >
                              SAC
                            </th>
                            <th
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                              }}
                            >
                              PRICE
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              {cdata !== null ? cdata.remark : ""}
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              1
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                background: "#f5f6fa",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              998365
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                background: "#f5f6fa",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              ${cdata !== null ? cdata.amount : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            ></td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                background: "#f5f6fa",
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                                fontWeight: "700",
                              }}
                            >
                              Subtoal
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                background: "#f5f6fa",
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                                fontWeight: "700",
                              }}
                            >
                              ${cdata !== null ? cdata.amount : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                color: "#666",
                              }}
                            ></td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                background: "#f5f6fa",
                                color: "#666",
                              }}
                            >
                              Processing fee
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                background: "#f5f6fa",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              ${cdata !== null ? cdata.fee : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                color: "#666",
                              }}
                            ></td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                background: "#f5f6fa",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              Tax
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                background: "#f5f6fa",
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#666",
                              }}
                            >
                              ${cdata !== null ? cdata.gst : "0"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colspan="2"
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                color: "#666",
                              }}
                            ></td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#fff",
                                background: "#d15555",
                              }}
                            >
                              <b>Grand Total</b>
                            </td>
                            <td
                              style={{
                                paddingTop: 10,
                                paddingLeft: 15,
                                lineHeight: "1.55em",
                                captionSide: "bottom",
                                borderCollapse: "collapse",
                                borderTop: "1px solid #dbdfea",
                                color: "#fff",
                                background: "#d15555",
                              }}
                            >
                              <b>${cdata !== null ? cdata.payble_amt : "0"}</b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" style={{ height: 30 }}>
                      {" "}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="2"
                      style={{
                        color: "#111",
                        marginTop: 30,
                        textAlign: "left",
                        fontStyle: "normal",
                      }}
                    >
                      <hr />
                      <p>
                        <b>Terms &amp; Conditions:</b>
                      </p>
                      <ul>
                        <li>
                          This transaction is governed by the terms and conditions agreed upon by the user at the time
                          of making the payment.{" "}
                        </li>
                        <li>The amount, once added, can only be used for running ad campaigns on 7SearchPPC. </li>
                        <li>
                          The amount, once added, cannot be refunded to the user’s bank account or any other personal
                          wallet.{" "}
                        </li>
                        <li>
                          In case some amount of money has been debited from the wallet accidentally without the user’s
                          consent, it will be transferred back to the wallet within a few hours of a claim.
                        </li>
                        <li>Users will never be charged more than the required amount to run the campaign.</li>
                        <li>The amount added to the wallet will be calculated as per the USD.</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <ToastContainer />
      </Content>
    </body>
  );
};

export default InvoicesPrint;
