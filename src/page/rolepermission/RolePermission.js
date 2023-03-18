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
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,

} from "../../components/Component";
import { useForm } from "react-hook-form";
import Loader from "../../app/Loader";
import { toast, ToastContainer } from "react-toastify";
import data from "./PermissionData";
import { saveRolePermission } from "../../app/api";


const RolePermission = () => { 
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const auth_token = localStorage.getItem('accessToken');
  const [formData, setFormData] = useState({
    role_name: "",
  });
  const [pdata, setPdata] = useState({
    country: {
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    category: {
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    campaign: {
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    notifications:{
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    ip:{
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    coupon:{
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    payment:{
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    },
    transaction:{
      Add:false,
      Edit:false,
      View:false,
      Delete:false
    }
  });
  
  /*  Submit Add New Role Add & Edit Section  */
  const onFormSubmit = async (form) => {
    form['permission'] = JSON.stringify( pdata);
    const res = await saveRolePermission(form);
      if(res.code === 200)
      {
        toast.success("Added Successfully", {
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
  };

  const { errors, register, handleSubmit } = useForm();
  useEffect(()=>{
   data
  },[]);
  return (
    <React.Fragment>
      <Head title="Add : : Role And Permission"></Head>
      <Content>
        <Loader visible={loading} />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Add New Role And Permission </BlockTitle>
              <BlockDes className="text-soft">Role & Permission - Assign </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block size="lg">
          <Row className="g-gs">
            <Col  lg="6"    >
              <PreviewCard className="h-100">
                <Form onSubmit={handleSubmit(onFormSubmit)} id="role-permission-form" >
                  <FormGroup className="form-group">
                    <label className="form-label" htmlFor="role">
                      Role Name 
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="role_name"
                        placeholder="Enter Role Name"
                        onChange={(e) => setFormData({ ...formData, role_name: e.value })}
                        className="form-control"
                        ref={register({
                          required: "Role Name is required",
                        })}
                      />
                    </div>
                    {errors.role_name && <span className="text-danger">{errors.role_name.message}</span>}
                  </FormGroup>   

                  <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow size="lg">
                  <span className="sub-text"> Feature </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Capabilities </span>
                </DataTableRow>
              </DataTableHead>
             
              {data.length > 0
                ? data.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <div className="project-info">
                             <h6 className="title">{item.title}</h6>
                          </div>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <span>  
                          { item.action.map((itema) => { 
                            return (
                              <DataTableRow> 
                                     <div className="custom-control custom-control-sm custom-checkbox custom-control-pro">
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          name="btnCheckControl"
                                          id={itema.id}
                                          value={isSubscribed}
                                          onChange={(e)=> {
                                         
                                            let pdts = pdata;
                                            if(e.target.checked == true) {
                                              pdts[item.name][itema.title] = true;
                                            } else {
                                              pdts[item.name][itema.title] = false;
                                            }
                                              setPdata(pdts)
                                              console.log(pdata);

                                          }}

                                    />
                                          <label className="custom-control-label" htmlFor={itema.id}>
                                          {itema.title}
                                          </label>
                                      </div>
                            </DataTableRow>
                             );
                          })
                          }
                          </span>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
          </DataTable>
        </Block> <br />
                  <FormGroup className="text-right form-group">
                    <Button color="primary" size="md"> Save Change </Button>
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
export default RolePermission;