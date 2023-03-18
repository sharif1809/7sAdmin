import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { FormGroup, Col, Row, Form } from "reactstrap";
import { saveAdminUserAdd, categoryDropList, countryDropListUser } from "../../app/api";
import {
  Button,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Block,
  PreviewCard,
  RSelect,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
const AddNewUser = () => {
  const [loading, setLoading] = useState(false);
  const [errorList, setError] = useState([]);
  const [udata, setUdata] = useState(null);
  const filterUserType = [
    { value: "1", label: "Advertiser" },
    { value: "2", label: "Publisher" },
    { value: "3", label: "Both" },
  ];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_type: "",
    website_category: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country_list: "",
    phonecode: "",
    password: "",
    verifymailuser: "",
    errorList: [],
  });
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      user_type: "",
      website_category: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country_list: "",
      phonecode: "",
      password: "",
      verifymailuser: "",
      errorList: [],
    });
  };
  const [ucountry, setUcountry] = useState(null);
  const getCountryData = async () => {
    const res = await countryDropListUser();
    // console.log(res.data)
    setUcountry(res.data);
  };

  const getCategoryData = async () => {
    const res = await categoryDropList();
    setUdata(res.data);
  };
  // submit function to add a new item
  const onFormSubmit = async (form) => {
    console.log(formData);
    setLoading(true);
    const res = await saveAdminUserAdd(formData);
    if (res.code === 200) {
      toast.success("User Added Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      document.getElementById("create-course-form").reset();
      setError(false);
      resetForm();
    } else if (res.code === 100) {
      setError(res.error);
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
  useEffect(() => {
    getCategoryData();
    getCountryData();
  }, []);
  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Add : : New Users "></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Add New Users </BlockTitle>
              <BlockDes className="text-soft"> Add New User </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block size="lg">
          <Row className="g-gs">
            <Col lg="12">
              <PreviewCard className="h-100">
                <Form id="create-course-form" onSubmit={handleSubmit(onFormSubmit)}>
                  <Row>
                    <Col lg="12">
                      <Row>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="first_name">
                              {" "}
                              First Name *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="first_name"
                                placeholder="Please Enter First Name !"
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.first_name}</span>
                              {/* {errors.first_name && <span className="invalid">{errors.first_name.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="last_name">
                              {" "}
                              Last Name *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="last_name"
                                placeholder="Please Enter Last Name !"
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.last_name}</span>
                              {/* {errors.last_name && <span className="invalid">{errors.last_name.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="email">
                              {" "}
                              Email *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="email"
                                name="email"
                                placeholder="Please Enter Email !"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.email}</span>
                              {/* {errors.email && <span className="invalid">{errors.email.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col lg="12">
                      <Row>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="phone">
                              Phone No. *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="phone"
                                placeholder="Please Enter Phone No. !"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.phone}</span>
                              {/* {errors.phone && <span className="invalid">{errors.phone.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="type">
                              {" "}
                              Type *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <RSelect
                                options={filterUserType}
                                name="user_type"
                                onChange={(e) => {
                                  //   console.log(e.value)
                                  setFormData({ ...formData, user_type: e.value });
                                }}
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.user_type}</span>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="website_category">
                              {" "}
                              Website Category *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <RSelect
                                options={udata}
                                name="website_category"
                                onChange={(e) => {
                                  // console.log(e.value)
                                  setFormData({ ...formData, website_category: e.value });
                                }}
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.website_category}</span>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col lg="12">
                      <Row>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="adr">
                              {" "}
                              Address Line 1 *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="address_line1"
                                placeholder="Please Enter address !"
                                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.address_line1}</span>
                              {/* {errors.email && <span className="invalid">{errors.email.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="adr">
                              {" "}
                              Address Line 2{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="address_line2"
                                placeholder="Please Enter address line 2 !"
                                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.address_line2}</span>
                              {/* {errors.email && <span className="invalid">{errors.email.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="city">
                              {" "}
                              City *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="city"
                                placeholder="Please Enter city !"
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.city}</span>
                              {/* {errors.email && <span className="invalid">{errors.email.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="state">
                              {" "}
                              State *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="state"
                                placeholder="Please Enter state !"
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.state}</span>
                              {/* {errors.email && <span className="invalid">{errors.email.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="website_category">
                              {" "}
                              Country *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <RSelect
                                options={ucountry}
                                name="country_list"
                                onChange={(e) => {
                                  //console.log(e.label)
                                  setFormData({ ...formData, country_list: e.label, phonecode: e.phonecode });
                                }}
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.country_list}</span>
                            </div>
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <FormGroup className="form-group">
                            <label className="form-label" htmlFor="password">
                              {" "}
                              Password *{" "}
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="text"
                                name="password"
                                placeholder="Please Enter Password !"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="form-control"
                                ref={register({})}
                              />
                              <span className="text-danger">{errorList.password}</span>
                              {/* {errors.password && <span className="invalid">{errors.password.message}</span>} */}
                            </div>
                          </FormGroup>
                        </Col>
                        <br />
                        <br />
                        <br />
                        <br />
                        <Col md="12">
                          <FormGroup className="form-group">
                            <div className="form-control-wrap">
                              <ul className="custom-control-group custom-control-vertical w-70">
                                <li>
                                  <label className="form-label" htmlFor="password">
                                    {" "}
                                    Verification Mail (Optional){" "}
                                  </label>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      Value={"yes"}
                                      onChange={(e) => setFormData({ ...formData, verifymailuser: e.target.value })}
                                      name="verifymailuser"
                                      id="verifymailuser"
                                    />
                                    <label className="custom-control-label" htmlFor="verifymailuser">
                                      <span>Do you want to send verification mail to user</span>
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col lg="12">
                      <FormGroup className="form-group">
                        <Button color="primary" size="sm">
                          {" "}
                          Save Change{" "}
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
export default AddNewUser;
