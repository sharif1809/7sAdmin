import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";

import { FormGroup, Col, Row, Form } from "reactstrap";
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
import { advchangepassword } from "../../app/api";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";

const ChangePassword = () => { 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const cancelCourse = () => { 
    document.getElementById("change-password-form").reset();
  }
  const auth_token = localStorage.getItem('accessToken');
  const onFormSubmit = async (formData) => {
    setLoading(true);
    const res = await advchangepassword(auth_token, formData.current_password, formData.new_password, formData.confirm_password);
    if(res.code === 200)
    {
      toast.success("Password Change  Successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
    else if(res.code === 102)
    {
      toast.error("Not Match New Password & Confirm Password", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
    else if(res.code === 103)
    {
      toast.error("Current Password Not Matched", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
    else
    {
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
    cancelCourse();
    setLoading(false);
  };
  const { errors, register, handleSubmit } = useForm();
  return (
    <React.Fragment>
      <Head title="Change Password"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Change Password</BlockTitle>
              <BlockDes className="text-soft">Change Password</BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block size="lg">
          <Row className="g-gs">
            <Col lg="6">
              <PreviewCard className="h-100">
                <Form onSubmit={handleSubmit(onFormSubmit)} id="change-password-form"  >
                  <FormGroup className="form-group">
                    <label className="form-label" htmlFor="current-password">
                      Current Password
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="password"
                        name="current_password"
                        placeholder="Enter Current Password"
                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Current password is required",
                        })}
                      />
                    </div>
                    {errors.current_password && <span className="text-danger">{errors.current_password.message}</span>}
                  </FormGroup>
                  <FormGroup className="form-group">
                    <label className="form-label" htmlFor="new-password">
                      New Password
                    </label>
                    <div className="form-control-wrap">
                    <input
                        type="password"
                        name="new_password"
                        placeholder="Enter New Password"
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "New password is required",
                        })}
                      />
                    </div>
                    {errors.new_password && <span className="text-danger">{errors.new_password.message}</span>}
                  </FormGroup>
                  <FormGroup className="form-group">
                    <label className="form-label" htmlFor="confirm-password">
                      Confirm Password
                    </label>
                    <div className="form-control-wrap">
                     <input
                        type="password"
                        name="confirm_password"
                        placeholder="Enter Confirm Password"
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        className="form-control"
                        ref={register({
                          required: "Confirm password is required",
                        })}
                      />
                    </div>
                    {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                  </FormGroup>
                  <FormGroup className="form-group">
                    <Button color="primary" size="lg">
                      Save Change
                    </Button>
                  </FormGroup>
                </Form>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
        <ToastContainer/>
      </Content>
    </React.Fragment>
  );
  
};
export default ChangePassword;