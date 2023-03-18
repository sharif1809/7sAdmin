import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { FormGroup, Col, Row, Form, Input } from "reactstrap";
// import { setcampdata } from "../../app/api";
import { getSupportClick, impClickCreate } from "../../app/api";
import {
  Button,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Block,
  PreviewCard,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router";

const SupportView = () => {
  const { ticketid } = useParams();
  const [loading, setLoading] = useState(false);
  const [cdata, setCdata] = useState(null);
  const auth_token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    campaign_id: "",
    impressions: "",
    click: "",
    date: "",
  });
  const resetForm = () => {
    setFormData({
      campaign_id: "",
      impressions: "",
      click: "",
      date: "",
    });
  };

  /*  Submit Add New Role Add & Edit Section  */
  const onFormSubmit = async (form) => {
    setLoading(true);
    console.log(formData);
    const res = await impClickCreate(formData);
    console.log(res);
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
      setLoading(false);
    } else if (res.code === 101) {
      toast.error(res.message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
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
    resetForm();
    setLoading(false);
  };
  const getImpression = async () => {
    const res = await getSupportClick(atob(ticketid));
    if (res.code === 200) {
      setCdata(res.data);
    }
  };
  const { errors, register, handleSubmit } = useForm();
  useEffect(() => {
    getImpression();
  }, []);
  return (
    <React.Fragment>
      <Head title="Support : : Message View"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Support Message View </BlockTitle>
              <BlockDes className="text-soft">Support View </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block size="lg">
          <Row className="g-gs">
            <Col lg="12">
              <PreviewCard className="h-100">
                <Form onSubmit={handleSubmit(onFormSubmit)} id="role-permission-form">
                  <Row>
                    <Col lg="8">
                      <Row>
                        <Col lg="12">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="to_date">
                              {" "}
                              Message{" "}
                            </label>
                            <div className="form-control-wrap">
                              <textarea
                                type="text"
                                name="message"
                                placeholder="Please Enter Message"
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="form-control"
                                ref={register({
                                  required: "Message is required",
                                })}
                              />
                            </div>
                            {errors.message && <span className="text-danger">{errors.message.message}</span>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col lg="12">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="to_date">
                              {" "}
                              Upload File{" "}
                            </label>
                            <div className="form-control-wrap">
                              <Input
                                type="file"
                                name="file"
                                placeholder="Please Enter file"
                                onChange={(e) => setFormData({ ...formData, file: e.target.value })}
                                className="form-control"
                              />
                            </div>
                            {errors.file && <span className="text-danger">{errors.file.message}</span>}
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="4">
                      <table className="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col" colSpan={2}>
                              <h4 style={{ color: "#fff" }}>Support Details</h4>{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ background: "#f1f1f1" }}>
                          <tr>
                            <td style={{ width: "30%" }}> User ID </td>
                            <td>
                              : <b>{cdata !== null ? cdata.uid : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Ticket Number </td>
                            <td>
                              : <b>{cdata !== null ? cdata.ticket_no : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Category </td>
                            <td>
                              : <b>{cdata !== null ? cdata.category : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Sub Category </td>
                            <td>
                              : <b>{cdata !== null ? cdata.sub_category : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Subject </td>
                            <td>
                              : <b>{cdata !== null ? cdata.subject : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Message </td>
                            <td>
                              : <b>{cdata !== null ? cdata.message : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "30%" }}> Priority </td>
                            <td>
                              : <b>{cdata !== null ? cdata.priority : "0"}</b>{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col lg="12">
                      <FormGroup className="form-group">
                        <Button color="primary" size="sm">
                          Send
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};
export default SupportView;
