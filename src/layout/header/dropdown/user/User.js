import React, { useContext, useEffect, useState } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import AppContext from "../../../../context/AppContext";

const User = () => {
  const apc = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toggle = () => setOpen((prevState) => !prevState);

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  };

  useEffect(()=>{
    const name     = localStorage.getItem('name');
    const username = localStorage.getItem('username');
    const email    = localStorage.getItem('email');
    // console.log(name);

    // if(apc.sts.username == '') {
    //   apc.setSts({
    //     username : username
    //   })
    // }
    setName(name);
    setEmail(email);
  },[])

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">{name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>AD</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{name}</span>
              <span className="sub-text">{email}</span>
            </div>
          </div>
        </div>

        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/change-password`} >
              <Icon name="lock"></Icon>
              <span> Change  Password </span>
            </a>
          </LinkList>
        </div> 
        
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
