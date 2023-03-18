import React, { useState, useEffect } from "react";
import Logo from "../../images/logo1.png";
import LogoDark from "../../images/logo1.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard, Icon  } from "../../components/Component";

import { FormGroup, Col, Row, Form, Alert, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { chagepassword } from "../../app/api";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const {linkid} = useParams();
    const [errorVal, setError] = useState("");
    const [errorVals, setErrors] = useState("");
    const [formData, setFormData] = useState({
        new_pass: "",
        conf_pass: "",
        authkey:linkid,
      }); 
      const resetForm = () => {
        setFormData({
            new_pass: "",
            conf_pass: "",
            authkey:linkid,
        });
      };
    const onFormSubmit = async (formData) => {
        console.log(formData);
        setLoading(true);
      // const res = await chagepassword(formData);
       const res = await chagepassword(formData.new_pass, formData.conf_pass, formData.authkey);
        console.log(res);
        if (res.code === 200) {
            resetForm();
            setTimeout(() => {
                setError(res.message);
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
      <Head title="Change-Password" />
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
                <BlockTitle tag="h5">Change Password </BlockTitle>
                <BlockDes>
                 
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <Form onSubmit={handleSubmit(onFormSubmit)} id="role-permission-form" >
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="newpass-01"> New Password </label>
                </div>
                <input
                    type="text"
                    name="new_pass"
                    value={formData.new_pass}
                    placeholder="Please Enter New Password"
                    onChange={(e) => setFormData({ ...formData, new_pass: e.target.value })}
                    className="form-control"
                    ref={register({
                        required: "New Password is required",
                    })}
                />
                  {errors.new_pass && <span className="text-danger">{errors.new_pass.message}</span>}
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="Confirm-01"> Confirm Password </label>
                </div>
                <input
                    type="text"
                    name="conf_pass"
                    value={formData.conf_pass}
                    placeholder="Please Enter Confirm Password"
                    onChange={(e) => setFormData({ ...formData, conf_pass: e.target.value })}
                    className="form-control"
                    ref={register({
                        required: "Confirm Password is required",
                    })}
                />
                 {errors.conf_pass && <span className="text-danger">{errors.conf_pass.message}</span>}

              </FormGroup>
              
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="Confirm-01">   </label>
                </div>
                <input
                    type="hidden"
                    name="authkey"
                    value={linkid}
                    readOnly={true}
                    onChange={(e) => setFormData({ ...formData, authkey: e.target.value })}
                    className="form-control"
                    ref={register({ })}
                />
              </FormGroup>

              {/* <Row>
                 <Col  lg="12">
                  <FormGroup className="form-group">
                    <Button color="primary" size="lg">
                      Save Change
                    </Button>
                  </FormGroup>
                  </Col>
            </Row> */}
            <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Change Password"}
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
export default ResetPassword;
