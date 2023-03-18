import React, { useEffect, useState, useRef } from "react";
import InboxMessageHeader from "./InboxMessageHeader";
import SimpleBar from "simplebar-react";
import InboxReplyItem from "./InboxReply";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { contacts, formTemplates } from "./InboxData";
import { Button, Icon, TooltipComponent } from "../../components/Component";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import { currentTime, getDateStructured } from "../../utils/Utils";
import { getSupportChat, postSupportChat } from "../../app/api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";

const InboxMessages = ({
  ticket,
  setTicket,
  subject
}) => {

  const mdata = [{
    name:"Support",
    message: 'Hello team,\n I am facing problem as i can not select currency on buy order page.\nCan you guys let me know what i am doing doing wrong?\nPlease check attached files.\n Thank you',
    date:'15 July 2022'
  },{
    name:"Abul Hasan2",
    message: '<p>Hello team,<br> I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.    Thank you</p>',
    date:'15 July 2022'
  }];

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [support, setSupport] = useState(null);
  const [inboxText, setInboxText] = useState('');
  const [attachmentList, setAttachmentList] = useState(null);

  const onAttachmentClick = () => {
    const inputEl = document.getElementById("attachmentInput");
    inputEl.click();
    inputEl.onchange = onAttachmentChange;
  };

  const onAttachmentChange = (ev) => {
    
    setAttachmentList(ev.target.files[0]);
  };

  const removeAttachment = (text) => {
    let defaultData = attachmentList;
    defaultData = defaultData.filter((item) => item.fileName !== text);
    setAttachmentList([...defaultData]);
  };

  const getChatData = async () => {
    setLoading(true);
    let uid = localStorage.getItem('uid');
    let res = await getSupportChat({
      uid:uid,
      ticket_no:ticket
    });
    setMessages(res.data);
    setSupport(res.support);
    setLoading(false);
    // console.log(res.support);
  }

  const sendInbox = async () => {

    let uid = localStorage.getItem('uid');
    
    let form = new FormData()
    
    if(attachmentList != null) {
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
            form.append('ticket_no', ticket)
            form.append('message', inboxText)
            form.append('support_type', 'User')

            let res  = await postSupportChat(form)
            if(res.code == 200) {
              // toggleModal();
              toast.success("Request Created!", {
                position: "top-right",
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });

            setInboxText('')
            setAttachmentList(null);
            getChatData()
                // setSuccess(true);
            }
   

    
  }

  useEffect(()=>{
    getChatData()

  },[])
  
  return (
    <React.Fragment>
    <Loader visible={loading} />  
        <React.Fragment>
          <InboxMessageHeader setTicket={setTicket}  />
          <SimpleBar className="nk-ibx-reply nk-reply">
            <div className="nk-ibx-reply-head">
              <div>
                <h4 className="title"> {(subject) ? subject : '(no subject)' }</h4>
                <span><Icon name="flag-fill" className="text-primary" /> {support && support.category.toUpperCase()}</span>
              </div>
              <ul className="d-flex g-1">
                <li className="d-none d-sm-block">
                  {/* <TooltipComponent
                    tag="a"
                    containerClassName="btn btn-icon btn-trigger btn-tooltip"
                    icon="printer"
                    id="ibx-msg-print"
                    direction="left"
                    text="Print"
                  /> */}
                  {
                  (support) ?
                  (support.status == 1) ?
                    <Badge color="danger">
                      Open
                    </Badge>
                  : (support.status == 2) ? 
                    <Badge color="danger">
                      In Progress
                    </Badge>
                  : (support.status == 3) ? 
                  <Badge color="warning">
                    On Hold
                  </Badge>
                  : (support.status == 4) ? 
                  <Badge color="primary">
                    Customer Action Pending
                  </Badge>
                  : (support.status == 6) ? 
                  <Badge color="info">
                    ReOpen
                  </Badge>
                  :
                    <Badge color="success">
                    Closed
                  </Badge>
                  : ''
                }
                </li>
                <li className="mr-n1">
                  <div className="asterisk">
                    <a
                      href="#item"
                      className={`btn btn-trigger btn-icon btn-tooltip ${
                       "active" 
                      }`}
                      onClick={(ev) => {
                        ev.preventDefault();
                        onFavoriteClick(mailData.id);
                      }}
                    >
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div className="nk-ibx-reply-group">

            {messages != null ? messages.map((item, index) => (
                <InboxReplyItem
                  reply={item}
                  key={index}
                  // deleteMessage={deleteMessage}
                  // replyTo={replyTo}
                  // forwardTo={forwardTo}
                />
              )) : ''}
              
            </div>
            <div className="nk-ibx-reply-form nk-reply-form">
             
              <div className="nk-reply-form-editor">
                <div className="nk-reply-form-field">
                  <textarea
                    className="form-control form-control-simple no-resize"
                    placeholder="Reply"
                    value={inboxText}
                    onChange={(e) => setInboxText(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="nk-reply-form-attachment">
                {attachmentList !== null ?
                  <div
                    className="nk-reply-form-attachment-list p-1 align-center justify-between m-2 d-flex"
                  >
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
                : ''}
              </div>
              <div className="nk-reply-form-tools">
                <ul className="nk-reply-form-actions g-1">
                  <li className="mr-2">
                    <Button color="primary" type="submit" onClick={() => sendInbox()}>
                      Send
                    </Button>
                  </li>
                  <li onClick={() =>  {
                    onAttachmentClick()
                  }}>
                    <TooltipComponent
                      title="Attachment"
                      tag="a"
                      containerClassName="btn btn-icon btn-sm"
                      icon="clip-v"
                      id="ibx-msg-attachment"
                      direction="top"
                      text="Upload Attachment"
                    /> 
                    <input type="file" id="attachmentInput" style={{ display: "none" }}></input>
                  </li>
                  {/* <li onClick={() => onImageClick()}>
                    <TooltipComponent
                      tag="a"
                      containerClassName="btn btn-icon btn-sm"
                      icon="img"
                      id="ibx-msg-images"
                      direction="top"
                      text="Upload Images"
                    />
                  </li> */}
                  <input type="file" id="imageInput" accept=".png, .jpg, .jpeg" style={{ display: "none" }}></input>
                </ul>
              </div>
            </div>
          </SimpleBar>
        </React.Fragment>
      
    </React.Fragment>
  );
};

export default InboxMessages;
