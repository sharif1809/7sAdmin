import React, { useContext, useState, useEffect } from 'react'
import CampaignContext from '../../context/CampaignContext'
import {
    Row,
    Col,
    Tooltip,
    Button,
    FormGroup,
    Form,
    Spinner
  } from "reactstrap";
import { RSelect, Icon } from '../../components/Component';
import { getUpdateCmpCategoryList, getCountryList, updatePopupCampaign } from '../../app/api';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router";
import { getCampaignInfo } from "../../app/api";
import Loader from '../../app/Loader';
import { Link } from 'react-router-dom';
import popAd from '../../images/popunder-ad1.png';

export default function EditPopupCampaign ({clkFunc}) {

  const {cid} = useParams();
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
    } else if(type == 2) {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    } else if(type == 3) {
      toast.error("Destination & Conversion Url domain should be same.", {
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

  const [loading, setLoading] = useState(false);
  const { errors, register, handleSubmit, getValues } = useForm();

    const [fsave, setFsave] = useState(false);
    const [cnts, setCnts] = useState();

    const stitle = 'Your amazing ad title here';
    const dtitle = 'Start Building Awesome Ads. Impress Your Clients with Screenshots of Great Ads. Highlight Features of Your Service/Product.';
    const durl = 'https://www.7searchppc.com';

    const [txt, setTxt] = useState({
        website_category:'',
        campaign_name:'',
        ad_title:'',
        ad_description:'',
        target_url:'',
        conversion_url:'',
        daily_budget:'',
        device_type:[],
        device_os:[],
        countries:''
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

    const [country, setCountry] = useState();
    
    const getAllCountries = async () => {
      const res = await getCountryList();
      setCountry(res);
    }

    const [cats, setCats] = useState(null);

    const getAllCats = async () => {
      const res = await getUpdateCmpCategoryList();
      setCats(res)
    }
    
    const submitAd = async (data) => {

      if(conchk == true) {
        data['countries'] = 'All';
      } else {
        data['countries'] = txt.countries;
      }

      data['device_type'] =  (txt.device_type.length > 0) ? txt.device_type.join(',') : '';
      data['device_os'] =  (txt.device_os.length > 0) ? txt.device_os.join(',') : '';
      
      if(txt.device_type.length > 0 && txt.device_os.length > 0) {
        setFsave(true)
        data['cid'] = cid;
        data['campaign_type'] = campState.sts.campaign_type;
        data['ad_type'] = campState.sts.ad_type;

        campState.setSts(data);
        clkFunc.next

    }
        
      const res = await updatePopupCampaign(data);

      if(res.code === 200) {
        showToast(1)
      } else {
        showToast(2)
      }
      
      setFsave(false)

    }
  

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
        setTxt(data)
      }
      setLoading(false);
    } 

    useEffect(()=>{
      getCampInfo()
      setConChk(false)
      getAllCountries()
      getAllCats()
    },[])
    return (<Form onSubmit={handleSubmit(submitAd)}>
      <Loader visible={loading} />
      <Row className="gy-3">
        <Col md="6">
          <FormGroup>

            <label className="form-label" htmlFor="fw-token-address">
              Campaign Category
            </label>
            <div className="form-control-wrap mb-3">

              <select className="form-control" name="website_category" ref={register({ required: true })}  >
                <option value="" key={0}>Select Category</option>
                {(cats !== null) ? cats.map((item, key)=> {
                  let sel = (txt.website_category == item.value) ? true : false;
                  return <option key={key} selected={sel} value={item.value}>{item.label}</option>
                }) : ''}
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

            <label className="form-label mt-3" htmlFor="fw-token-address">
            Target URL <Icon name="info-fill" id="adurl" className="text-primary" /> 
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
                  (getValues('target_url') === '') ? setTxt({...txt, target_url:durl }) : setTxt({...txt, target_url:getValues('target_url') })
              }}
              ref={register({ required: true, pattern : /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/})}
              defaultValue={txt.target_url}
              />
              {errors.target_url && <span className="sm-error">Please enter destination url</span>}
            </div> 
   
            <label className="form-label mt-3" htmlFor="fw-token-address">
              Daily Budget <Icon name="info-fill" id="dbuz" className="text-primary" />  
            </label>
            <Tooltip placement="auto"isOpen={tooltipOpen} target="dbuz" toggle={toggle}>
              Set daily budget for your ad campaign.
            </Tooltip>
            <div className="form-control-wrap">
            <input
                type="number"
                className="form-control"
                id="fw-token-address"
                name="daily_budget"
                onChange={( e )=> {
                }}
              ref={register({ required: true, valueAsNumber:true, validate: (val) => val > 0,})}
              defaultValue={txt.daily_budget}
            />
              {errors.daily_budget?.type === 'required' && <span className="sm-error">Please enter daily budget</span>}
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
                    }} 
                    options={country}
                    // value={cnts}
                    value={(txt.countries !== 'All' && txt.countries !== '') ? JSON.parse(txt.countries) : ''}
                    />
                  </div> 
                </div>
              ) : (
                <div></div>
              )}

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
                      setTxt({ ...txt, device_type: dtype })
                      setOs({...os, 
                        windows:1,
                        apple:1
                        })
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
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
                        setTxt({ ...txt, device_type: dtype })
                        
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
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
                        setTxt({ ...txt, device_type: dtype })
                        
                      } else {
                        let data = dtype.filter(item => item !== e.target.value)
                        setTxt({ ...txt, device_type: data })
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
            <div className="form-control-wrap mb-3">
              <div className="custom-control custom-checkbox custom-control-pro custom-control-pro-icon no-control checked">
                    <input type="checkbox" className="custom-control-input" value="android" id="android" 

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
                          setTxt({ ...txt, device_os: dos })
                          
                        } else {
                          let data = dos.filter(item => item !== e.target.value)
                          setTxt({ ...txt, device_os: data })
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

          </FormGroup>
        </Col>
        
        <Col md="6">
        <div className='p-2 pt-4'>
            <p>
            <b>Pop-under ads</b> stands are seamless backdrop displays.
              Pop-under traffic is as good an ad format as pop-ups.
              Pop-under helped many websites to increase subscriptions, leads &amp; traffic upto 160%. 
            </p>
            <div className="form-group">
              <img src={popAd} />
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
      </div>
      </Form>)
}