import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon, UserAvatar, TooltipComponent } from "../../components/Component";
import { findUpper } from "../../utils/Utils";
import { contacts } from "./InboxData";

const InboxReplyItem = ({ reply, replyTo, forwardTo, deleteMessage }) => {
  const [user, setUser] = useState();
  //const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    // let defaultUser = contacts.find((item) => item.id === reply.userId);
    // setUser(defaultUser);
  }, [reply]);

  // const toggleCollapse = () => {
  //   //setCollapse(!collapse);
  // };

  const downloadAttachments = (at) => {
    // attachments.forEach((at) => {
      var link = document.createElement("a");
      link.download = 'true';
      link.target = '_blank';
      link.href = 'http://192.168.18.166/7sapp/7searchBackend/public/images/support/'+at;
      link.click();
    // });
  };

  return (
    <div className="nk-ibx-reply-item nk-reply-item">
  
        <React.Fragment>
          <div className={`nk-reply-header nk-ibx-reply-header`}>
            <div className="nk-reply-desc">
              <UserAvatar className="nk-reply-avatar" text={findUpper(reply.user_name)} theme={reply.theme} image={reply.img} />
              <div className="nk-reply-info">
                <div className="nk-reply-author lead-text">
                  {reply.user_name} <span className="date d-sm-none">{reply.created_at}</span>
                </div>Support Team

                {/* <div className="nk-reply-msg-excerpt">
                  I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am
                  doing doing wrong? Please check attached files.
                </div> */}
              </div>
            </div>
            <ul className="nk-reply-tools g-1">
              {reply.attachment && (
                <li className="attach-msg">
                  <Icon name="clip-h"></Icon>
                </li>
              )}
              <li className="date-msg">
                <span className="date">
                  <Moment fromNow>
                    {reply.created_at}
                  </Moment>

                </span>
              </li>
              {/* <li className="more-actions">
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="a"
                    href="#toggle"
                    onClick={(ev) => ev.preventDefault()}
                    className="dropdown-toggle btn btn-trigger btn-icon"
                  >
                    <Icon name="more-v"></Icon>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <ul className="link-list-opt no-bdr">
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#item"
                          onClick={(ev) => {
                            ev.preventDefault();
                            // replyTo(user.mail);
                          }}
                        >
                          <Icon name="reply-fill"></Icon>
                          <span>Reply to</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#item"
                          onClick={(ev) => {
                            ev.preventDefault();
                            forwardTo();
                          }}
                        >
                          <Icon name="forward-arrow-fill"></Icon>
                          <span>Forward</span>
                        </DropdownItem>
                      </li>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#item"
                          onClick={(ev) => {
                            ev.preventDefault();
                            // deleteMessage(reply.replyId);
                          }}
                        >
                          <Icon name="trash-fill"></Icon>
                          <span>Delete this</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li> */}
            </ul>
          </div>
          <div className={`nk-reply-body nk-ibx-reply-body is-shown`}>
            <div className="nk-reply-entry entry">
              
              {reply.message.split('\n').map((msgItem, index) => (
                <p key={index}>{msgItem}</p>
              ))}
              {/* {reply.message} */}
            </div>
            {reply.file && (
              <div className="attach-files">
                <ul className="attach-list">
                    <li className="attach-item" onClick={() => downloadAttachments([att])}>
                      <a className="download" href="#item" onClick={(ev) => ev.preventDefault()}>
                        <Icon name="img"></Icon>
                        <span>{reply.file}</span>
                      </a>
                    </li>
                </ul>
                <div className="attach-foot">
                  <span className="attach-info">1 files attached</span>
                  <a
                    className="attach-download link"
                    href="#item"
                    onClick={(ev) => {
                      ev.preventDefault();
                      downloadAttachments(reply.file);
                    }}
                  >
                    <Icon name="download"></Icon>
                    <span>Download All</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </React.Fragment>
   
    </div>
  );
};

export default InboxReplyItem;
