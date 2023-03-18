import React, { useEffect, useState } from "react";
import { contacts, inboxList } from "./InboxData";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Form, Modal, UncontrolledDropdown } from "reactstrap";
import { Icon, RSelect, TooltipComponent } from "../../components/Component";
import { postSupportReq } from "../../app/api";
import { toast, ToastContainer } from "react-toastify";

const InboxBodyHead = ({
  allData,
  setData,
  currentTab,
  toggleRefresh,
  itemPerPage,
  totalItems,
  paginate,
  currentPage,
  loadData
}) => {

  const [composeModal, setComposeModal] = useState(false);
  const [opt, setOpt] = useState('');
  const [opt2, setOpt2] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');

  const [file, setFile] = useState(null);


  const toggleModal = () => { setComposeModal(!composeModal) };

  const data = [
    { value: "complaint", label: "Complaint" },
    { value: "feedback", label: "Feedback" },
    { value: "suggestion", label: "Suggestion" },
  ]

  const data2 = [
    { value: "billing & payment", label: "Billing & Payment" },
    { value: "campaign issue", label: "Campaign Issue" },
    { value: "other", label: "Other" },
  ]


  useEffect(() => {

        setData(inboxList);
      
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  const nextPage = () => {
    let pgs = currentPage + 1;
    paginate(pgs);
    loadData(pgs);
  };

  const prevPage = () => {
    let pgs = currentPage - 1;
    paginate(pgs);
    loadData(pgs);

  };


  const submitForm = async (e) => {
    e.preventDefault()
    let uid = localStorage.getItem('uid');
    
    let form = new FormData()
    
    if(attachmentList !== null) {

      let ext = attachmentList.type.split('/')[1].toLowerCase(); 
      let size = Math.round(attachmentList.size/1024);
      
      if(ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'pdf') {
        if(size <= 500) {
          form.append('file',attachmentList, attachmentList.name);

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
          toast.error("You can upload jpg, png or pdf file only.", {
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


            form.append('uid', uid)
            form.append('category', opt)
            form.append('sub_category', opt2)
            form.append('subject', subject)
            form.append('message', msg)
            form.append('support_type', 'User')

            let res  = await postSupportReq(form)
            if(res.code == 200) {
              toggleModal();
              toast.success("Request Created!", {
                position: "top-right",
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
            loadData()
                // setSuccess(true);
          }

  }

  
  const [attachmentList, setAttachmentList] = useState(null);

  const onAttachmentClick = () => {
    const inputEl = document.getElementById("attachmentInput");
    inputEl.click();
    inputEl.onchange = onAttachmentChange;
  };

  const onAttachmentChange = (ev) => {
    if (ev.target.files.length > 0) {
      setAttachmentList(ev.target.files[0]);
      // setAttachmentList(ev.target.files[0]);
    }
  };

  // const removeAttachment = () => {
  //   setAttachmentList(null);
  // };


  return (
    <>
    <div className="nk-ibx-head">
      <div className="nk-ibx-head-actions">
       
        <ul className="nk-ibx-head-tools g-1">
          <li>
          <h5 className="mb-0">
            <Icon name="account-setting-fill" style={{fontSize:22}} /> Support Center</h5>
          </li>
       
        </ul>
      </div>
      <div>
        <ul className="nk-ibx-head-tools g-1">
          <li style={{borderRight:'1px solid #ddd'}}>
            <a
            href="#toggle"
            onClick={(ev) => {
              ev.preventDefault();
              // setComposeMail("");
              setComposeModal(true);
            }}
            className="link link-primary mr-3"
          >
            <Icon name="plus"></Icon><span>New Request</span>
          </a>
          </li>
        <li>
            <a
              href="#item"
              onClick={(ev) => {
                ev.preventDefault();
                loadData(1);
                paginate(1)
              }}
              className="btn btn-icon btn-trigger"
            >
              <Icon name="undo"></Icon>
            </a>
          </li>
          <li>
            <a
              href="#item"
              onClick={(ev) => {
                ev.preventDefault();
                prevPage();
              }}
              className={`btn btn-trigger btn-icon btn-tooltip ${currentPage - 1 === 0 ? "disabled" : ""}`}
            >
              <Icon name="arrow-left"></Icon>
            </a>
          </li>
          <li>
            <a
              href="#item"
              onClick={(ev) => {
                ev.preventDefault();
                nextPage();
              }}
              className={`btn btn-trigger btn-icon btn-tooltip ${
                pageNumbers[pageNumbers.length - 1] === currentPage || pageNumbers.length === 0 ? "disabled" : ""
              }`}
            >
              <Icon name="arrow-right"></Icon>
            </a>
          </li>
  
        </ul>
      </div>

    
    <Modal isOpen={composeModal} className="modal-lg" toggle={() => toggleModal()}>
      <div className="modal-header">
        <h6 className="modal-title">Create New Request</h6>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault();
            toggleModal();
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>
      </div>
      <Form onSubmit={submitForm} >
        <div className="modal-body p-0">
          <div className="nk-reply-form-header">
            <div className="nk-reply-form-group">
              <div className="nk-reply-form-title d-sm-none">Reply</div>
              <div className="nk-reply-form-input-group">
                <div className="row">
                  <div className="col-md-6 pl-0">
                    <RSelect  options={data} onChange={(ev)=>{
                      setOpt(ev.value);
                    }}/>
                  </div>
                  <div className="col-md-6 pr-0">
                    {opt == 'complaint' && <RSelect  options={data2} onChange={(ev)=>{
                      setOpt2(ev.value);
                    }} />}
                  </div>
                </div>
                  {/*x <label className="label">To</label> */}
                {/* <div className="nk-reply-form-input nk-reply-form-input-to">
                  
                </div> */}
              </div>
            </div>
          </div>
          <div className="nk-reply-form-editor">
            <div className="nk-reply-form-field">
              <input
                type="text"
                className="form-control form-control-simple"
                placeholder="Subject"
                value={subject}
                name="subject"
                onChange={(e) => {
                  setSubject(e.target.value)
                }}
              />
            </div>
            <div className="nk-reply-form-field">
              <textarea
                className="form-control form-control-simple no-resize ex-large"
                placeholder="Your Message"
                value={msg}
                name="message"
                onChange={(e) => setMsg(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="nk-reply-form-attachment">
          {attachmentList != null ?
            <div className="nk-reply-form-attachment-list p-1 align-center justify-between m-2 d-flex">
              <span>{attachmentList.name}</span>
              <a
                className="toggle-opt"
                href="remove"
                onClick={(ev) => {
                  ev.preventDefault();
                  setAttachmentList(null);
                }}
              >
                <Icon name="cross"></Icon>
              </a>
            </div>
            :
            ''
          }
        </div>
          <div className="nk-reply-form-tools">
            <ul className="nk-reply-form-actions g-1">
              <li className="mr-2">
                <Button color="primary" type="submit" >
                  Send
                </Button>
              </li>
              <li onClick={() => onAttachmentClick()}>
                <TooltipComponent
                  title="Attachment"
                  tag="a"
                  containerClassName="btn btn-icon btn-sm"
                  icon="clip-v"
                  id="ibx-msg-attachment"
                  direction="top"
                  text="Upload Attachment"
                />
                <input type="file" id="attachmentInput" multiple style={{ display: "none" }}></input>
              </li>
            </ul>
          </div>
        </div>
      </Form>
    </Modal>
    </div>
  
    </>
  );
};

export default InboxBodyHead;
