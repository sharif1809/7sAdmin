import React, { useState } from "react";
import { Icon, TooltipComponent } from "../../components/Component";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, UncontrolledTooltip } from "reactstrap";

const InboxMessageHeader = ({
setTicket
}) => {
  //const [searchText, setSearchText] = useState("");
  // const [searchToggle, setSearchToggle] = useState(false);

  // // const onSearchChange = (e) => {
  // //   let value = e.target.value;
  // //   setSearchText(value);
  // // };

  // const toggleSearch = () => {
  //   setSearchToggle(!searchToggle);
  // };

  // const nextMessage = () => {
  //   if (msgId === 12) {
  //     setMailId(1);
  //   } else {
  //     setMailId(msgId + 1);
  //   }
  // };

  // const prevMessage = () => {
  //   if (msgId !== 1) {
  //     setMailId(msgId - 1);
  //   } else {
  //     setMailId(12);
  //   }
  // };

  // const changeTagsOnCheck = (checked, label) => {
  //   let defaultData = mailData;
  //   let defaultTags = mailData.message.meta.tags;
  //   if (checked) {
  //     defaultTags.push(label);
  //   } else {
  //     defaultTags = defaultTags.filter((item) => item.text !== label.text);
  //     mailData.message.meta.tags = defaultTags;
  //   }
  //   setMailData({ ...defaultData });
  // };

  return (
    <div className="nk-ibx-head">
      <div className="nk-ibx-head-actions">
        <ul className="nk-ibx-head-tools g-1">
          <li className="ml-n2" onClick={() => { }}>
            <a href="#item" onClick={(ev) => setTicket('')} className="btn btn-icon btn-trigger nk-ibx-hide">
              <Icon name="arrow-left"></Icon>
            </a>
          </li>
        </ul>
      </div>
      <div>
      </div>
    </div>
  );
};

export default InboxMessageHeader;
