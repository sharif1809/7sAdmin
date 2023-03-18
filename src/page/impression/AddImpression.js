import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { FormGroup, Col, Row, Form } from "reactstrap";
import { useRef } from "react";

// import { setcampdata } from "../../app/api";
import { getImpressionClick, impClickCreate } from "../../app/api";
import {
  Button,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Block,
  PreviewCard,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  RSelect,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router";

const AddImpression = () => {
  const { campid } = useParams();
  const [loading, setLoading] = useState(false);
  const [cdata, setCdata] = useState(null);
  const [adType, setadType] = useState("");
  const [campidget, setcamp] = useState(atob(campid));
  const [formSave, setformSave] = useState(false);
  const auth_token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    campaign_id: atob(campid),
    impression_amt: 0,
    click_amt: "0",
    impressions: "",
    click: "",
    date: "",
  });
  const resetForm = () => {
    setFormData({
      campaign_id: atob(campid),
      impression_amt: cdata.cpc_amt,
      click_amt: "",
      impressions: "",
      click: "",
      date: "",
    });
  };

  /*  Submit Add New Role Add & Edit Section  */
  const onFormSubmit = async (form) => {
    setLoading(true);
    setformSave(true);
    if (adType == "popup") {
      form["click"] = 0;
      form["click_amt"] = 0;
    }
    form["campaign_id"] = formData.campaign_id;
    // console.log(form);
    const res = await impClickCreate(form);
    //  console.log(res);
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
    setformSave(false);
    resetForm();
    setLoading(false);
  };
  const getImpression = async () => {
    const res = await getImpressionClick(atob(campid));
    if (res.code === 200) {
      setCdata(res.data);
      console.log(res.data);
      setadType(res.data.ad_type);
      // if(res.data.ad_type == 'popup')
      // {
      //   setFormData({ ...formData, click: 0, click_amt: 0 })
      // }
    }
  };
  const { errors, register, handleSubmit } = useForm();
  useEffect(() => {
    getImpression();
  }, []);
  return (
    <React.Fragment>
      <Head title="Add : : Impression And Click"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Add New Impression And Click </BlockTitle>
              <BlockDes className="text-soft"> Impression & Click </BlockDes>
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
                        <Col lg="6">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="country">
                              {" "}
                              Select Country{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                value={cdata !== null ? cdata.country_name : "All"}
                                readOnly={true}
                                placeholder="Please Enter country"
                                className="form-control"
                              />
                            </div>
                            {errors.country_name && <span className="text-danger">{errors.country_name.message}</span>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="country">
                              {" "}
                              Campaign ID{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                readOnly={true}
                                name="campaign_id"
                                defaultValue={campidget}
                                placeholder="Please Enter campaign"
                                className="form-control"
                              />
                            </div>
                            {errors.campaign_id && <span className="text-danger">{errors.campaign_id.message}</span>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col lg="6">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="impression">
                              {" "}
                              Impressions{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="number"
                                name="impressions"
                                value={formData.impressions}
                                placeholder="Please Enter Impressions"
                                onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                                className="form-control"
                                ref={register({
                                  required: "Impressions is required",
                                })}
                              />
                            </div>
                            {errors.impressions && <span className="text-danger">{errors.impressions.message}</span>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="click">
                              {" "}
                              Impressions Rate{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="impression_amt"
                                id="impression_amt"
                                Value={cdata !== null ? cdata.cpm : "0"}
                                // defaultValue={formData.impression_amt}
                                placeholder="Please Enter Impression Amount"
                                onChange={(e) => setFormData({ ...formData, impression_amt: e.target.value })}
                                className="form-control"
                                ref={register({
                                  required: "Click Imperssion is required",
                                })}
                              />
                            </div>
                            {errors.impression_amt && (
                              <span className="text-danger">{errors.impression_amt.message}</span>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      {adType !== "popup" ? (
                        <Row>
                          <Col lg="6">
                            <FormGroup className="form-group">
                              <label className="form-label" htmlFor="click">
                                {" "}
                                Clicks{" "}
                              </label>
                              <div className="form-control-wrap">
                                <input
                                  type="number"
                                  name="click"
                                  id="click"
                                  value={formData.click}
                                  placeholder="Please Enter Click"
                                  onChange={(e) => setFormData({ ...formData, click: e.target.value })}
                                  className="form-control"
                                  ref={register({
                                    required: "Click is required",
                                  })}
                                />
                              </div>
                              {errors.click && <span className="text-danger">{errors.click.message}</span>}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup className="form-group">
                              <label className="form-label" htmlFor="click">
                                {" "}
                                Clicks Rate{" "}
                              </label>
                              <div className="form-control-wrap">
                                <input
                                  type="text"
                                  name="click_amt"
                                  id="click_amt"
                                  Value={cdata !== null ? cdata.cpc : "0"}
                                  // defaultValue={formData.click_amt}
                                  placeholder="Please Enter Click Amount"
                                  onChange={(e) => setFormData({ ...formData, click_amt: e.target.value })}
                                  className="form-control"
                                  ref={register({
                                    required: "Click Amount is required",
                                  })}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                      <br />
                      <Row>
                        <Col lg="6">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="to_date">
                              {" "}
                              Date
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="date"
                                name="date"
                                value={formData.date}
                                placeholder="Please Enter Date"
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="form-control"
                                ref={register({
                                  required: "Date is required",
                                })}
                              />
                            </div>
                            {errors.date && <span className="text-danger">{errors.date.message}</span>}
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="4">
                      <table className="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col" colSpan={2}>
                              <h4 style={{ color: "#fff" }}>Campaigns Details</h4>{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ width: "30%" }}>Wallet Balance -</td>
                            <td>
                              {" "}
                              <b>${cdata !== null ? cdata.wallet : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Daily Budget - </td>
                            <td>
                              {" "}
                              <b>${cdata !== null ? cdata.daily_budget : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Today Spent Amount - </td>
                            <td>
                              {" "}
                              <b>${cdata !== null ? (cdata.clickamt + cdata.imprsamt).toFixed(2) : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "40%" }}> Default Impression Rate - </td>
                            <td>
                              {" "}
                              <b>${cdata !== null ? cdata.cpm : "0"}</b>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Default Click Rate - </td>
                            <td>
                              {" "}
                              <b>${cdata !== null ? cdata.cpc : "0"}</b>{" "}
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
                        <Button color="primary" size="lg">
                          Save Change
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
export default AddImpression;
