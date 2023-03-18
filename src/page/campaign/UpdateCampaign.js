import React, { useState, useRef, useContext, useEffect } from "react";
 import '../../assets/css/smart-ui.css';
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";


import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BackTo,
  PreviewCard,
} from "../../components/Component";

import { toast, ToastContainer } from "react-toastify";
import { Steps, Step } from "react-step-builder";
import CampaignState from "../../context/CampaignState";
import CampaignContext from "../../context/CampaignContext";
import { useParams } from "react-router";
import { getCampaignInfo } from "../../app/api";
import EditTextCampaign from "./EditTextCampaign";
import EditBannerCampaign from "./EditBannerCampaign";
import EditSocialBarCampaign from "./EditSocialBarCampaign";
import Loader from "../../app/Loader";
import EditNativeCampaign from "./EditNativeCampaign";
import EditPopupCampaign from "./EditPopupCampaign";

const AdSetup = (props) => {

  const camState = useContext(CampaignContext);

  let {type, cid} = useParams(); 
  
  const getCampInfo = async ( ) => { 
    let uid = localStorage.getItem('uid');
    let res = await getCampaignInfo(uid, cid);
    if(res.code === 200) {
      let data = res.data;
      camState.setSts(data)
      // console.log(data)
    }
    // console.log(camState.sts)
  }

  useEffect(()=>{
    // getCampInfo();
    // console.log(this.props.params.cid);
  },[])

  return (
    <>
    
    {(type === 'text') ? 
      <EditTextCampaign clkFunc={props} />
      : (type === 'banner') ?
      <EditBannerCampaign clkFunc={props} />
      : (type === 'social') ?
      <EditSocialBarCampaign clkFunc={props} />
      : (type === 'native') ?
      <EditNativeCampaign clkFunc={props} />
      : (type === 'popup') ?
      <EditPopupCampaign clkFunc={props} />
      : ''
    }
    </>
  );
};

const Header = (props) => {
  return (
    <div className="steps clearfix">
      <ul>
        <li className={props.current >= 1 ? "first done" : "first"}>
          <a href="#wizard-01-h-0" onClick={(ev) => ev.preventDefault()}>
             <h5>Campaign Setting</h5>
          </a>
        </li>
        <li className={props.current >= 2 ? "done" : ""}>
          <a href="#wizard-01-h-1" onClick={(ev) => ev.preventDefault()}>
            {/* <span className="number">02</span>  */}
            <h5>Ad Type</h5>
          </a>
        </li>
        <li className={props.current >= 3 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <h5>Create Ad</h5>
          </a>
        </li>
      </ul>
    </div>
  );
};

const Success = (props) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <BlockTitle tag="h6" className="text-center">
        Thank you for submitting form
      </BlockTitle>
    </div>
  );
};

const config = {
  before: Header,
};

const UpdateCampaign = () => {
  
  return (
    <CampaignState>
      <React.Fragment>
        <Head title="Update Campaign" />
        <Content >
          <BlockHead size="lg" wide="sm" className="pb-3">
            <BlockHeadContent>
              <BackTo link="/campaign-list" icon="arrow-left">
                Campaign 
              </BackTo>
            </BlockHeadContent>
          </BlockHead>

          <Block size="lg">
            <PreviewCard>
              <div className="nk-wizard nk-wizard-simple is-alter wizard clearfix">
                <Steps >
                  <Step component={AdSetup} />
                  <Step component={Success} />
                </Steps>
              </div>
            </PreviewCard>
          </Block>
        </Content>
        <ToastContainer />
      </React.Fragment>
    </CampaignState>
  );
};

export default UpdateCampaign;
