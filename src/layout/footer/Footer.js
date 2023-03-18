import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="nk-footer">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            {" "}
            &copy; {new Date().getFullYear()} <a href="#">7SearchPPC</a>
          </div>
          <div className="nk-footer-links">
            <ul className="nav nav-sm">
              <li className="nav-item">
                <Link to={`https://www.7searchppc.com/terms-conditions`} className="nav-link">
                  Terms
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`https://www.7searchppc.com/privacy-policy`} className="nav-link">
                  Privacy
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`https://www.7searchppc.com/faqs`} className="nav-link">
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
