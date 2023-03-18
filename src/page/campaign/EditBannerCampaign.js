import React, { useContext, useState, useEffect, useCallback } from 'react'
import CampaignContext from '../../context/CampaignContext'
import {
    Row,
    Col,
    Tooltip,
    Button,
    FormGroup,
    Form,
    Spinner,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Popover,
    PopoverBody,
    PopoverHeader,
    Label
} from "reactstrap";
import { RSelect, Icon } from '../../components/Component';
import { getUpdateCmpCategoryList, getCountryList, uploadImage, getCampaignInfo, updateBannerCampaign, getCPCInfo } from '../../app/api';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from "react-toastify";
import Cropper from 'react-easy-crop';

import AdView1 from '../../images/banner-ad-1-1.jpg';
import AdView2 from '../../images/banner-ad-4-3.jpg';
import AdView3 from '../../images/banner-ad-3-1.jpg';

import Loader from '../../app/Loader';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export default function EditBannerCampaign ({clkFunc}) {

  const {cid} = useParams();

const ImageCrop = () => {
  // console.log(cropData)
  let image = new Image();
  image.src = imgs;
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  //  data = '';
  canvas.width = cropData.width;
  canvas.height = cropData.height
  ctx.drawImage(image,cropData.x,cropData.y,cropData.width,cropData.height,0,0,cropData.width,cropData.height)
  
  image.onload = function() {
    
    // if(imgType == 1) {
      //   setResImg(data);
      // } else if(imgType == 2) {
        //   setResImg({...resImg, ad2:data});
        // } else if(imgType == 3) {
    //   setResImg({...resImg, ad3:data});
    // }
    
    // setResImg(data);
    // setIsOpen(false)
  };
  const data = canvas.toDataURL();
    if(imgType === 1) {
        setResImg({...resImg, ad1:data});
    } else if(imgType === 2) {
        setResImg({...resImg, ad2:data});
    } else if(imgType === 3) {
      setResImg({...resImg, ad3:data});
    }

    setIsOpen(false);
    
}


const [isOpen , setIsOpen] = useState(false);
const [loading , setLoading] = useState(false);
const [imgs, setImgs] = useState();
const [cropping, setCropping] = useState(false);
const [crop, onCropChange] = useState({ x: 0, y: 0 })
const modal = () => { setIsOpen(!isOpen) };
const [cropData, setCropData] = useState();

const [resImg, setResImg] = useState({
  ad1:'',
  ad2:'',
  ad3:''
});

const [urlResImg, setUrlResImg] = useState({
  ad1:'',
  ad2:'',
  ad3:''
});

const [imgRatio, setImgRatio] = useState(0);
const [imgType, setImgType] = useState(0);

  const showToast = (type) => {

    if(type == 1) {
      toast.success("Campaign saved successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    } else {
      toast.error("Something went wrong", {
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

  
  const getImgData = (e) => {

    let file = e.target.files[0];
    const img = new FileReader();
    let size = Math.round(file.size/1024);
    let type = file.type.split('/');
    let ext = type[1];

    if(ext == 'png' || ext == 'jpeg' || ext == 'webp') {
      if(size <= 500) {
        img.onload = function(){
          var dataURL = img.result;
          setImgs(dataURL)
          setCropping(true);
          setIsOpen(true);
        };
        img.readAsDataURL(file)
      } else {
        toast.error("Image file size is too large. Maximum file size is 500kb", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      }
    } else {
      toast.error("Image file should be jpeg, png or webp only.", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }

  }
  // useCallback
  const saveImg2Server = async ( ) => {
    cropData.img_data = imgs;
    ImageCrop();
    // uploadImage(cropData) 
  }
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropData(croppedAreaPixels)

  }, []);

  const { errors, register, handleSubmit, getValues } = useForm();

    const [fsave, setFsave] = useState(false);

    const stitle = '';
    const dtitle = '';
    const durl = '';
    const [txt, setTxt] = useState({
        website_category:'',
        campaign_name:'',
        ad_title:stitle,
        ad_description:dtitle,
        target_url:durl,
        conversion_url:'',
        daily_budget:'',
        device_type:[],
        device_os:[]
    });

    const [os, setOs] = useState({
      android:0,
      windows:0,
      apple:0
    })
    
    const [conchk, setConChk] = useState(true);
    const campState = useContext(CampaignContext);

    const [tooltipOpen , setOpen] = useState(false);
    const toggle = () => { setOpen(!tooltipOpen) };

    const [tooltipOpen4 , setOpen4] = useState(false);
    const toggle4 = () => { setOpen4(!tooltipOpen4) };

    const [tooltipOpen5 , setOpen5] = useState(false);
    const toggle5 = () => { setOpen5(!tooltipOpen5) };

    const [country, setCountry] = useState();
    
    const getAllCountries = async () => { 
      const res = await getCountryList();
      setCountry(res);
    } 

    const [cats, setCats] = useState(null);

    const getAllCats = async () => {
      const res = await getUpdateCmpCategoryList();
      // console.log(res);
      setCats(res)
    }
    
      // ================================================== //
     // ===============     Submit API     =============== //    
    // ================================================== //
    const submitAd = async (data) => {

      setLoading(true);

      // if( resImg.ad2 != '' && resImg.ad3 != '' ) {
      data.images = [];

      if(resImg.ad1 !== '') {
        const img1 = await uploadImage(resImg.ad1);
        data.images.push({
          img:img1.image_path,
          type:1
        });
      }

      if(resImg.ad2 !== '') {
        const img2 = await uploadImage(resImg.ad2);
        data.images.push({
          img:img2.image_path,
          type:2
        });
      }
      
      if(resImg.ad3 !== '') {
        const img3 = await uploadImage(resImg.ad3);
        data.images.push({
          img:img3.image_path,
          type:3
        });
      }


      if(conchk == true) {
        data['countries'] = 'All';
      } else {
        data['countries'] = txt.countries;
      }
      
      data['device_type'] =  (txt.device_type.length > 0) ? txt.device_type.join(',') : '';
      data['device_os'] =  (txt.device_os.length > 0) ? txt.device_os.join(',') : '';
      
      if(txt.device_type.length > 0 && txt.device_os.length > 0) {

        if((data.pricing_model === 'CPC' && parseFloat(data.cpc_amt) >= parseFloat(cpcost)) || data.pricing_model === 'CPM') {

          setFsave(true)
      
          data['cid'] = cid;
          data['campaign_type'] = campState.sts.campaign_type;
          data['ad_type'] = campState.sts.ad_type;

          campState.setSts(data);
          const res = await updateBannerCampaign(data)
          console.log(res.code);
          if(res.code === 200) {
            showToast(1)
          } else {
            showToast(2)
          }
        } else {
          toast.error("Error! Invalid Bidding Amount.", {
            position: "top-right",
            autoClose: true,
            closeOnClick: true,
            hideProgressBar: true,
          });
        }
      } else {
        toast.error("Please fill all required fields.", {
          position: "top-right", autoClose: true,  closeOnClick: true, hideProgressBar: true,
        });
      }
        
  
      setFsave(false)
      setLoading(false);

    }
    
    const [dtype, setDtype] = useState({});
    const [ostype, setOsType] = useState();

    const getCampInfo = async ( ) => { 
      setLoading(true);
      let res = await getCampaignInfo(cid);
      
      if(res.code === 200) {
        let data = res.data;
        
        if(data.countries == 'All') {
          setConChk(true);
        }
        data.device_type = (data.device_type.length > 0) ? data.device_type.split(',') : [];
        data.device_os = (data.device_os.length > 0) ? data.device_os.split(',') : [];
        setUrlResImg(res.images);
        setTxt(data)
        setWebCat(data.cat_name);
        setCpinp(data.pricing_model);
        getCmpCost(data.pricing_model, data.cat_name)
        setBidvl(data.cpc_amt)
      }
      setLoading(false);
    } 

    
    const [popoverOpen , setPopoverOpen] = useState(false);

    const [webcat, setWebCat] = useState(null);
    const [cpinp, setCpinp] = useState(null);

    const [cpcost, setCPCost] = useState(0);
    const [cphcost, setCPHCost] = useState(0);
    const [bidvl, setBidvl] = useState(0);

    const getCmpCost = async(type, cat, tp=0) => {
      
      let res = await getCPCInfo(type, cat);
      if(res) {
        // console.log(res.amount);
        setCPCost(res.base_amt);
        setCPHCost(res.high_amt);

        if(tp == 1) {
          setBidvl(res.high_amt);
        }

      } else {
        setCPCost(0);
        setCPHCost(0);
      }

    }

    useEffect(()=>{
      getCampInfo()
      setConChk(false)
      getAllCountries()
      getAllCats()
    },[])

    return (<Form onSubmit={handleSubmit(submitAd)}>
      <Row className="gy-3">
        <Loader visible={loading} />
        <Col md="7">
          <FormGroup>

            <label className="form-label" htmlFor="fw-token-address">
            Campaign Category
            </label>

            <div className="form-control-wrap mb-3">
              <select className="form-control" name="website_category" ref={register({ required: true })} 
                onChange={(e)=> {
                var index = e.target.selectedIndex;
                if(e.target[index].text == 'Select Category') {
                  setWebCat(null);
                } else {
                  setWebCat(e.target[index].text);
                  getCmpCost(cpinp, e.target[index].text)
                }
                }} >
                <option value="" key={0}>Select Category</option>
                {(cats !== null) ? cats.map((item)=> {
                  let sel = (txt.website_category === item.value) ? true : false;
                  return <option key={item.value} selected={sel} value={item.value}>{item.label} </option>
                }
                  // <option key={key} {txt.website_category === item.label && 'selected'}></option>
                  // <option key={key}>{item.label}</option>
                ) : ''}
              </select>
              {errors.website_category && <span className="sm-error">Please select a website category</span>}
            </div>

            <label className="form-label" htmlFor="fw-token-address">
              Campaign Name
            </label>

            <div className="form-control-wrap">
              <input
                type="text"
                className="form-control"
                id="fw-token-address"
                name="campaign_name"
                onChange={( e )=> {
                    // setTxt({...txt, campaign_name:e.target.value})
                }}
                ref={register({ required: true })}
                defaultValue={txt.campaign_name}
              />
              {errors.campaign_name && <span className="sm-error">Please enter a campaign name</span>}
            </div>
            {/* <label className="form-label mt-3" htmlFor="fw-token-address">
            Ad Title <Icon name="info-fill" id="adtitle" className="text-primary" /> 
            </label>
            <div className="form-control-wrap">
            <Tooltip placement="auto"isOpen={tooltipOpen2} target="adtitle" toggle={toggle2}>
            Ad title should be short, punchy, and to catch the attention of your potential customers.
            </Tooltip>
              <input
                type="text"
                className="form-control"
                id="fw-token-address"
                name="ad_title"
                onChange={(e)=> 
                  {
                    (getValues('ad_title') === '') ? setTxt({...txt, ad_title:stitle }) : setTxt({...txt, ad_title:getValues('ad_title') })
                  }
                }
                ref={register({ required: true })}
                defaultValue={campState.sts.ad_title}
              />
              {errors.ad_title && <span className="sm-error">Please enter a ad title</span>}
            </div> */}
                
            {/* <label className="form-label mt-3" htmlFor="fw-token-address">
            Ad Description <Icon name="info-fill" id="addesc" className="text-primary" />  
            </label>
            <Tooltip placement="auto"isOpen={tooltipOpen3} target="addesc" toggle={toggle3}>
            Describe your product/Service in few words.
            </Tooltip>
            <div className="form-control-wrap">
            <input
                type="text"
                className="form-control"
                name="ad_description"
                onChange={( e )=> 
                  {(getValues('ad_description') === '') ? setTxt({...txt, ad_description:stitle }) : setTxt({...txt, ad_description:getValues('ad_description') })
                }}
              ref={register({ required: true })}
              defaultValue={campState.sts.ad_description}
              />
              {errors.ad_description && <span className="sm-error">Please enter ad description</span>}
            </div> */}

            <label className="form-label mt-3" htmlFor="fw-token-address">
            Destination URL <Icon name="info-fill" id="adurl" className="text-primary" /> 
            </label>
            <Tooltip placement="auto"isOpen={tooltipOpen4} target="adurl" toggle={toggle4}>
              Your website, blog or page url.
            </Tooltip>
            <div className="form-control-wrap">
            <input
                type="text"
                className="form-control"
                name="target_url"
                onChange={( e )=> {
                  (getValues('target_url') === '') ? setTxt({...txt, target_url:stitle }) : setTxt({...txt, target_url:getValues('target_url') })
              }}
              ref={register({ required: true, pattern : /^((https?):\/\/)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/ })}
              defaultValue={txt.target_url}
              />
              {errors.target_url && <span className="sm-error">Please enter destination url</span>}
            </div> 
            <label className="form-label mt-3" htmlFor="fw-token-address">
              Conversion URL <Icon name="info-fill" id="adcon" className="text-primary" />  
            </label>
            <Tooltip placement="auto"isOpen={tooltipOpen5} target="adcon" toggle={toggle5}>
              The URL will help us to track your Conversion. Place it on order/enquiry success page.
            </Tooltip>
            <div className="form-control-wrap">
            <input
                type="text"
                className="form-control"
                id="fw-token-address"
                name="conversion_url"
                onChange={( e )=> {
                    setTxt({...txt,
                      conversion_url:e.target.value
                    });
              }}
              ref={register({ required: true, pattern : /^((https?):\/\/)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/})}
              defaultValue={txt.conversion_url}
              />
              {errors.conversion_url && <span className="sm-error">Please enter conversion url</span>}
            </div> 


          <div className='row'>
            <div className='col-4'>
            <label className="form-label mt-3" htmlFor="fw-token-address">
              Pricing Model 
            </label>
              <div className="form-control-wrap">
                <select className="form-control" name="pricing_model" disabled={webcat == null ? true : false} 
                    ref={register({ required: true })} style={{width:200}} onChange={(e) => {
                      getCmpCost(e.target.value, webcat, 1);
                      setCpinp(e.target.value);
                      if(e.target.value == '') {
                        setBidvl(0);
                      }
                    }} >
                    <option value="" key={0} selected={webcat == null ? true : false}  >Select Option</option>
                    <option key={1} selected={cpinp == 'CPM' ? true : false}>CPM</option>
                    <option key={2} selected={cpinp == 'CPC' ? true : false}>CPC</option>
                </select>
                {errors.pricing_model?.type === 'required' && <span className="sm-error">Please select price model</span>}
              
              </div> 
            </div>
            <div className='col-4' style={{display: (cpinp == 'CPM' ) ? 'none' : 'block'}}>
            <label className="form-label mt-3" htmlFor="fw-token-address"> Bidding Price </label>
              <div className="form-control-wrap">
                <div className="input-group">
                <input
                    type="number"
                    className="form-control"
                    name="cpc_amt"
                    onChange={( e )=> { 
                      // let ptrn = '^[0-9]*$';
                      // const val = ptrn.test(e.target.value);
                      // console.log(val)
                      setBidvl(e.target.value)  
                    }}
                    disabled={webcat == null || cpinp == 'CPM' ? true : false} 
                    // readOnly={cpinp == 'CPM' ? true : false}
                    onBlur={() => setPopoverOpen(false)}
                    onFocus={() => setPopoverOpen(true)}
                    ref={register({ valueAsNumber:true, setValueAs: v => parseInt(v) })}
                    value={bidvl} 
                    // disabled={true}
                    // style={{width:200}}
                    id="Popover1"
                />
              </div>



                {errors.cpc_price?.type === 'required' && <span className="sm-error">Please enter your bid amount</span>}
                <Popover isOpen={popoverOpen} target="Popover1" >
                <PopoverHeader>Optimal Rates</PopoverHeader>
                <PopoverBody>
                  <ul>
                    <li>
                      <small>Recommended - &nbsp; <span className='text-success'>${cpcost}</span></small>
                    </li>
                    <li>
                      <small>Highest Bid - <span className='text-info float-right'>${cphcost}</span></small>
                    </li>
                  </ul>
                </PopoverBody>
              </Popover>
              </div> 
            </div>

            <div className='col-4'>
            <label className="form-label mt-3" htmlFor="fw-token-address"> Daily Budget </label>

              <div className="form-control-wrap">
                <input
                    type="number"
                    className="form-control"
                    name="daily_budget"
                    onChange={( e )=> {

                    }}
                    ref={register({ required: true, valueAsNumber:true, setValueAs: v => parseInt(v), min:3 })}
                    // value={cpcost} 
                    // disabled={true}
                    style={{width:200}}
                    defaultValue={txt.daily_budget}
                />
                {errors.daily_budget?.type === 'required' && <span className="sm-error">Please enter daily budget</span>}
              </div> 
            </div>

          </div>
            
            <label className="form-label mt-3" htmlFor="fw-token-address">
              Device Type
            </label>
            <div className="form-control-wrap">
                <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked">
                  <input type="checkbox" className="custom-control-input" id="desktop" value="Desktop" 
                  onChange={(e)=> {

                    let dtype = txt.device_type;
                    if(e.target.checked == true) {

                      dtype.push(e.target.value)
                      console.log(dtype)
                      setTxt({ ...txt, device_type: dtype })
                      setOs({...os, 
                        windows:1,
                        apple:1
                        })
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
                        console.log(data)
                      }
                    }} 
                    checked={txt.device_type.includes('Desktop')}
                  />
                  <label className="custom-control-label" htmlFor="desktop">
                  <Icon name="monitor"></Icon> Desktop &nbsp; 
                  </label>
              </div>

              <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked ml-2">
                  <input type="checkbox" className="custom-control-input" id="tablet" value="Tablet"
                    onClick={(e) => {
                      let dtype = txt.device_type;
                      if(e.target.checked == true) {
  
                        dtype.push(e.target.value)
                        console.log(dtype)
                        setTxt({ ...txt, device_type: dtype })
                        
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
                        console.log(data)
                      }
                    }}
                    checked={txt.device_type.includes('Tablet')}
                  />
                  <label className="custom-control-label" htmlFor="tablet">
                  <Icon name="tablet"></Icon> Tablet &nbsp; 
                  </label>
              </div>

              <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked ml-2">
                  <input type="checkbox" className="custom-control-input" id="mobile" value="Mobile"
                     onClick={(e) => {
                      let dtype = txt.device_type;
                      if(e.target.checked == true) {
  
                        dtype.push(e.target.value)
                        console.log(dtype)
                        setTxt({ ...txt, device_type: dtype })
                        
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
                        console.log(data)
                      }
                    }}
                    checked={txt.device_type.includes('Mobile')}
                  />
                  <label className="custom-control-label" htmlFor="mobile">
                  <Icon name="mobile"></Icon> Mobile &nbsp;
                  </label>
              {txt.device_type.length === 0 && <span className="invalid"  id="fv-com-error"> Please select a device type</span>}
              </div>
              <br/>
            </div>

            <label className="form-label mt-3" htmlFor="fw-token-address">
              Device OS
            </label>
            <div className="form-control-wrap">
              <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked">
                    <input type="checkbox" className="custom-control-input" value="android" id="android" 

                        onClick={(e) => {
                        let dos = txt.device_os;
                        if(e.target.checked == true) {
    
                          dos.push(e.target.value)
                          console.log(dos)
                          setTxt({ ...txt, device_os: dos })
                          
                        } else {
                          let data = dos.filter(item => item !== e.target.value)
                          setTxt({ ...txt, device_os: data })
                          console.log(data)
                        }
                      }}
                      checked={txt.device_os.includes('android')}
                    />
                    <label className="custom-control-label" htmlFor="android">
                    <Icon name="android"></Icon> &nbsp;
                    </label>
                </div>

                <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked ml-2">
                    <input type="checkbox" className="custom-control-input" id="apple" value="apple"
                      onClick={(e) => {
                        let dos = txt.device_os;
                        if(e.target.checked == true) {
    
                          dos.push(e.target.value)
                          console.log(dos)
                          setTxt({ ...txt, device_os: dos })
                          
                        } else {
                          let data = dos.filter(item => item !== e.target.value)
                          setTxt({ ...txt, device_os: data })
                        }
                      }}
                      checked={txt.device_os.includes('apple')}
                    />
                    <label className="custom-control-label" htmlFor="apple">
                    <Icon name="apple"></Icon> &nbsp;
                    </label>
                </div>

                <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked ml-2">
                    <input type="checkbox" className="custom-control-input" id="windows" value="windows"
                      onClick={(e) => {
                        let dos = txt.device_os;
                        if(e.target.checked == true) {
                          dos.push(e.target.value)
                          console.log(dos)
                          setTxt({ ...txt, device_os: dos })
                        } else {
                          let data = dos.filter(item => item !== e.target.value)
                          setTxt({ ...txt, device_os: data })
                          console.log(data)
                        }
                      }} 
                      checked={txt.device_os.includes('windows')}
                    />
                    <label className="custom-control-label" htmlFor="windows">
                    <Icon name="windows"></Icon> &nbsp;
                    </label>
                    {txt.device_os.length === 0 && <span className="invalid"  id="fv-com-error"> Please select a device OS</span>}
                </div>

                <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked ml-2">
                    <input type="checkbox" className="custom-control-input" id="linux" value="linux"
                      onClick={(e) => {
                        let dos = txt.device_os;
                        if(e.target.checked == true) {
                          dos.push(e.target.value)
                          setTxt({ ...txt, device_os: dos })
                        } else {
                          let data = dos.filter(item => item !== e.target.value)
                          setTxt({ ...txt, device_os: data })
                        }
                      }} 
                      checked={txt.device_os.includes('linux')}
                    />
                    <label className="custom-control-label" htmlFor="linux">
                    <Icon name="linux"></Icon> &nbsp;
                    </label>
                    {txt.device_os.length === 0 && <span className="invalid"  id="fv-com-error"> Please select a device OS</span>}
                </div>

            </div>
            
            <div className="form-control-wrap mt-5">
                <div className="custom-control custom-switch">
                  <input type="checkbox" className="custom-control-input form-control" value={1} id="customSwitch2"
                    checked={conchk}
                    onChange={(e) => {
                        setConChk(!conchk)
                        setTxt({...txt,
                          countries: 'All'
                        }) 
                        console.log(conchk)
                      } 
                    }
                  />
                  <label className="custom-control-label" htmlFor="customSwitch2"> All Countries </label>
                </div>
              </div>
              {(conchk == false) ? (
                <div>
                  <label className="form-label mt-3" htmlFor="fw-token-address">
                    Countries
                  </label>
                  <div className="form-control-wrap">
                    <RSelect isMulti onChange={(val) => { 
                      setTxt({...txt,
                        countries: JSON.stringify(val)
                      }) 
                    }} options={country}
                    value={txt.countries}
                    />
                  </div> 
                </div>
              ) : (
                <div></div>
              )}


          </FormGroup>
        </Col>
        
        <Col md="5">
          <div className="form-group">
              <label className="form-label" htmlFor="fw-telegram-username">
              Ad Preview
              </label>

              <div className='form-group'> 
                <div className="mt-2 sm-drop-zone">
                  <img src={(resImg.ad1 != '') ? resImg.ad1 : urlResImg.ad1}  />
                </div>
                <a href='javascript:;' className='btn btn-primary mt-2'>
                  <input type="file" className='sm-input' onChange={(e) => {
                    setImgRatio(1/1);
                    setImgType(1);
                    getImgData(e);
                  }} />
                  Upload Image
                </a>
              </div>
              
              <div className='form-group'> 
                <div className="mt-2 sm-drop-zone2">
                  <img src={(resImg.ad2 != '') ? resImg.ad2 : urlResImg.ad2} />
                </div>
                <a href='javascript:;' className='btn btn-primary mt-2'>
                  <input type="file" className='sm-input' onChange={(e) => {
                    setImgRatio(4/3);
                    setImgType(2);
                    getImgData(e);
                  }} />
                  Upload Image
                </a>
              </div> 

              <div className='form-group'> 
                <div className="mt-2 sm-drop-zone3">
                  <img src={(resImg.ad3 != '') ? resImg.ad3 : urlResImg.ad3} />
                </div>
                <a href='javascript:;' className='btn btn-primary mt-2'>
                  <input type="file" className='sm-input' onChange={(e) => {
                    setImgRatio(3/1);
                    setImgType(3);
                    getImgData(e);
                  }} />
                  Upload Image
                </a>
              </div>


            </div>
        </Col>
      </Row>
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type='subit' disabled={fsave}>
            {(fsave == true) ? <span><Spinner size="sm" /> &nbsp; Saving</span> : 'Submit'}
            </Button>
          </li>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/campaigns`} className='btn btn-lg btn-primary' onClick={clkFunc.prev} disabled={fsave}>
              Back
            </Link>
          </li>
        </ul>
        
        
      <Modal size='md' isOpen={isOpen} toggle={modal}>
        <ModalHeader
          toggle={modal}
          close={
            <button className="close" onClick={modal}>
              <Icon name="cross" />
            </button>
          }
        >
        CROP IMAGE
        </ModalHeader>
        <ModalBody>
          <div className='p-5' style={{height:'320px'}}>
            {/* {cropping === true && */}
            <Cropper
              // image={'https://graphicsfamily.com/wp-content/uploads/2020/11/Professional-Web-Banner-AD-in-Photoshop-scaled.jpg'}
              image={imgs}
              crop={crop}
              // zoom={zoom}
              aspect={imgRatio}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              showGrid={false}
              // onZoomChange={true}
              style={{width:'100%', marginTop:'20px'}}
            />
          </div>
        </ModalBody>
        <ModalFooter className="bg-light">
          <a href='#' color='danger' onClick={modal}><Icon name="cross" /> CANCEL</a>
          &nbsp; &nbsp; &nbsp;
          <a href='#' color='danger' onClick={saveImg2Server}><Icon name="crop" /> CROP IMAGE</a>
          {/* <Button color='primary'>Crop &amp; Save</Button> */}
        </ModalFooter>
      </Modal>

      </div>
      </Form>)
}