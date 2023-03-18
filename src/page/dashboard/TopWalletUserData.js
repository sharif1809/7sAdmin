import React, { useEffect, useState } from "react";
import { DataTableRow, DataTableHead, DataTableItem, Icon, Progress } from "../../components/Component";
const TopWalletUserData = ({TopWalletUserData}) => {
  return (
    <React.Fragment>
      <div className="card-inner mb-n2">
        <div className="card-title-group">
          <div className="card-title card-title-sm">
            <h6 className="title"> Top 5  Advertisers (Wallet) </h6>
          </div>
        </div>
      </div>
      <div className="nk-tb-list is-loose">
        <DataTableHead>
          <DataTableRow>
            <span>Advertiser ID</span>
          </DataTableRow>
          <DataTableRow className="text-left">
            <span> Email </span>
          </DataTableRow>
          <DataTableRow className="text-left">
            <span>Amount </span>
          </DataTableRow>
        </DataTableHead>
    {TopWalletUserData ? TopWalletUserData.map((item, key) => {
    return (
      <DataTableItem key={key}>
        <DataTableRow>
          {/* <div className="icon-text">
            <span className="tb-lead">{item.user_name}</span>
          </div> */}
            <small className="tb-lead text-primary">{item.uid}</small>
        </DataTableRow>
        <DataTableRow className="text-left">
          <span className="tb-sub tb-amount">
            <span>{item.email}</span>
          </span>
        </DataTableRow>
        <DataTableRow className="text-left">
          <span className="tb-sub tb-amount">
            <span><strong>${item.wallet}</strong></span>
          </span>
        </DataTableRow>
      </DataTableItem>
    );
     }) : ''}
      </div>
    </React.Fragment>
  );
};
export default TopWalletUserData;
