import React, { useState, useEffect } from "react";
import Logo from "../../images/logo1.png";
import LogoDark from "../../images/logo1.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard, Icon } from "../../components/Component";
import { FormGroup, Col, Row, Form, Alert,Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { sendLinkpassword } from "../../app/api";

const ForgotPassword = () => {

   const [loading, setLoading] = useState(false);
    const {linkid} = useParams();
    const [errorVal, setError] = useState("");
    const [errorVals, setErrors] = useState("");
    const [formData, setFormData] = useState({
      email: ""
      }); 
      const resetForm = () => {
        setFormData({
          email: ""
        });
      };

  const onFormSubmit = async (formData) => {
    console.log(formData);
    setLoading(true);
  // const res = await chagepassword(formData);
   const res = await sendLinkpassword(formData.email);
    console.log(res);
    if (res.code === 200) {
        resetForm();
        setTimeout(() => {
          setError(res.msg);
            setLoading(false);
          });
    } else if(res.code === 101) {
      //  resetForm();
        setTimeout(() => {
            setError(res.message);
            setLoading(false);
          });
    }
    else {
        resetForm();  
        setTimeout(() => {
            setError("Cannot login with credentials");
            setLoading(false);
          });
    }
  };
const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Forgot-Password" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> {errorVal}  {" "}
                </Alert>
              </div>
            )}
             {errorVals && (
              <div className="mb-3">
                <Alert color="success" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> {errorVals}  {" "}
                </Alert>
              </div>
            )}
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h5">Reset Password</BlockTitle>
                <BlockDes>
                 
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <Form onSubmit={handleSubmit(onFormSubmit)} id="role-permission-form" >
            <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="newpass-01"> Email </label>
                </div>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    placeholder="Please Enter Email Address"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                    ref={register({
                        required: "Email Address is required",
                    })}
                />
                 {errors.email && <span className="text-danger">{errors.email.message}</span>}
              </FormGroup>
              {/* <Row>
                 <Col  lg="12">
                  <FormGroup className="form-group">
                    <Button color="primary" size="lg">
                      Send Link
                    </Button>
                  </FormGroup>
                  </Col>
            </Row> */}

              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Send Link"}
                </Button>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Return to login</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
      </PageContainer>
    </React.Fragment>
  );
};
export default ForgotPassword;
