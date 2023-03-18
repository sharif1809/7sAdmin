import { create } from "apisauce";
const auth_token = localStorage.getItem("accessToken");
const api = create({
  // baseURL: "http://192.168.1.14/7sapp/7searchBackend/public/api/",
  // baseURL: "http://192.168.1.4/7SearchServices/public/api/",
  baseURL: 'https://services.7searchppc.in/api/',
  // baseURL: 'https://services.7searchppc.com/api/',
  headers: {
    "X-API-KEY": "7SAPI321",
    "X-AUTH-TOKEN": auth_token,
    "Access-Control-Allow-Origin": true,
  },
});

const sessionLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
};
const loginAdmin = async (username, password) => {
  const res = await api.post("/login", {
    username: username,
    password: password,
  });
  // console.log(res);
  return res.data;
};

/* category api routes */
const saveCategory = async (data) => {
  const res = await api.post("/admin/category/insert", data);
  return res.data;
};

const updateCategory = async (cid, cname, cpm, cpc) => {
  const res = await api.post("/admin/category/update", {
    cid: cid,
    cat_name: cname,
    cpm: cpm,
    cpc: cpc,
  });
  return res.data;
};

const getCmpListCategoryList = async () => {
  // const res = await api.get('/admin/category/getcategorylist');
  const res = await api.post("/admin/category/getcampcategorylist");

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getCategoryList = async (src) => {
  const res = await api.post("/admin/category/getcategorylist", {
    // const res = await api.post('/admin/category/getcampcategorylist', {
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getUpdateCmpCategoryList = async (src) => {
  const res = await api.post("/admin/category/getcampcategorylist", {
    // const res = await api.post('/admin/category/getcampcategorylist', {
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateCategoryStatus = async (uid, sts) => {
  const res = await api.post("/admin/category/categorystatusupdate", {
    uid: uid,
    status: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteCategory = async (id) => {
  const res = await api.post("/admin/category/delete", {
    id: id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* country api routes */

const saveCountry = async (data) => {
  const res = await api.post("/admin/country/store", data);
  //console.log(res.data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateCountryup = async (cid, name, nicename, iso, iso3, numcode, phonecode, currency_code) => {
  const res = await api.post("/admin/country/update", {
    cid: cid,
    name: name,
    nicename: nicename,
    iso: iso,
    iso3: iso3,
    numcode: numcode,
    phonecode: phonecode,
    currency_code: currency_code,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getCountryList = async (src) => {
  const res = await api.post("/admin/country/getcountrydropdownlist", {
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const getCountryIndex = async (pg, lim, src) => {
  const res = await api.post("/admin/country/getcountrylist", {
    page: pg,
    lim: lim,
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteCountry = async (id) => {
  const res = await api.post("/admin/country/delete", {
    id: id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateCountryStatus = async (uid, sts) => {
  const res = await api.post("/admin/country/countrystatusupdate", {
    uid: uid,
    status: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const countryUpdateStatus = async () => {
  const res = await api.post("/admin/country/countrystatusupdate");
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* User api routes */

const userDetailList = async (uid, pg, lim) => {
  // console.log(uid);
  const res = await api.post("/admin/user/detail", {
    uid: uid,
    page: pg,
    lim: lim,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getInhouseUsersList = async (cat, type, acnt_type, src, usertype) => {
  const res = await api.post("/admin/user/list", {
    cat: cat,
    acnt_type: acnt_type,
    status_type: type,
    src: src,
    usertype: usertype,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteInhouseUser = async (uid) => {
  const res = await api.post("/admin/user/delete", {
    uid: uid,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getClientList = async (cat, sts, acnt_type, src, usertype) => {
  const res = await api.post("/admin/user/list", {
    cat: cat,
    acnt_type: acnt_type,
    status_type: sts,
    src: src,
    usertype: usertype,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteClients = async (uid) => {
  const res = await api.post("/admin/user/delete", {
    uid: uid,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateUserStatus = async (uid, sts) => {
  const res = await api.post("/admin/user/statusupdate", {
    uid: uid,
    status: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateUserAcountType = async (uid, acount_type) => {
  const res = await api.post("/admin/user/updateacount", {
    uid: uid,
    acount_type: acount_type,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const loginAsUserApi = async (uid) => {
  const res = await api.post("/admin/userlogin", {
    uid: uid,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* Campaign api routes */

// const getCampaignList = async (cat, type, status, usertype, pg, lim, src) => {

//     const res = await api.post('/admin/campaign/campaignlist', {
//         type:type,
//         cat:cat,
//         status:status,
//         usertype:usertype,
//         page:pg,
//         lim:lim,
//         src:src,
//     });
//     if(res.data.code === 105) {
//         sessionLogout();
//     } else {

//         return res.data;
//     }
// }
const getCampaignList = async (cat, type, status, pg, lim, src) => {
  const res = await api.post("/admin/campaign/campaignlist", {
    type: type,
    cat: cat,
    status: status,
    page: pg,
    lim: lim,
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getDeletdCampaignsList = async (type, pg, lim) => {
  const res = await api.post("/admin/campaign/deletedcmplist", {
    type: type,
    page: pg,
    lim: lim,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteCampaign = async (cid) => {
  const res = await api.post("/admin/campaign/deletecampaign", {
    cid: cid,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateCampaignStatus = async (cid, sts) => {
  const res = await api.post("/admin/campaign/campaignupdatestatus", {
    cid: cid,
    status: sts,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const loginUserapi = async (uid) => {
  const res = await api.post("/admin/userlogin", {
    uid: uid,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateAllCampaign = async (data) => {
  const res = await api.post("/admin/campaign/action", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* Notification api routes */

const notificationList = async (type, pg, lim, src, startDate, endDate) => {
  const res = await api.post("/admin/notification/list", {
    type: type,
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const notificationStatusUpdate = async (id, sts) => {
  const res = await api.post("/admin/notification/changestatus", {
    id: id,
    sts: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getNotiUserData = async (noti_for) => {
  const res = await api.post("/admin/notification/type_to_user", {
    noti_for: noti_for,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const notificationCreate = async (data) => {
  const res = await api.post("/admin/notification", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const trashNotification = async (id) => {
  const res = await api.post("/admin/notification/trash", {
    id: id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* Block api routes */

const blockIpList = async (type, pg, lim, src) => {
  const res = await api.post("/admin/ip/list", {
    type: type,
    page: pg,
    lim: lim,
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const blockIpStatusUpdate = async (id, sts) => {
  const res = await api.post("/admin/ip/statusupdate", {
    id: id,
    sts: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const blockIpCreate = async (data) => {
  const res = await api.post("/admin/ip/store", data);

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const ipInfo = async (ip) => {
  const res = await api.post("/admin/ip/info", {
    ip: ip,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* Coupon api routes */

const couponUserList = async () => {
  const res = await api.get("/admin/coupon/user/list");
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const couponGetList = async (type, pg, lim, src) => {
  const res = await api.post("/admin/coupon/list", {
    type: type,
    page: pg,
    lim: lim,
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const couponCreate = async (data) => {
  const res = await api.post("/admin/coupon/create", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

// const couponupdate = async (coupon_id, title, coupon_code,coupon_type,min_bil_amt, coupon_value, max_disc, start_date, end_date) => {
//     const res = await api.post('/admin/coupon/update',{
//         coupon_id:coupon_id,
//         title:title,
//         coupon_code:coupon_code,
//         coupon_type:coupon_type,
//         min_bil_amt:min_bil_amt,
//         coupon_value:coupon_value,
//         max_disc:max_disc,
//         start_date:start_date,
//         end_date:end_date
//     });
//     if(res.data.code === 105) {
//         sessionLogout();
//     } else {
//         return res.data;
//     }
// }

const couponupdate = async (data) => {
  const res = await api.post("/admin/coupon/update", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const couponStatusUpdate = async (id, sts) => {
  const res = await api.post("/admin/coupon/statusupdate", {
    id: id,
    sts: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const couponDelete = async (id) => {
  const res = await api.post("/admin/coupon/delete", {
    id: id,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* AdFund api routes */

const addFundToUser = async (data) => {
  console.log(data);
  const res = await api.post("admin/adfund", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

/* Transaction api routes */

const transactionList = async (uid, pg, lim) => {
  const res = await api.post("/admin/transactions/list", {
    uid: uid,
    page: pg,
    lim: lim,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const transactionReport = async (type, pg, lim, src, startDate, endDate) => {
  const res = await api.post("/admin/transactions/report", {
    type: type,
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const transactionReportImportExcelReport = async (startDate, endDate) => {
const res = await api.post("/admin/transactions/txnimportexcelreport", {
    startDate: startDate,
    endDate: endDate,
});
if (res.data.code === 105) {
    sessionLogout();
} else {
    return res.data;
}
};

const getTransactionUserInfo = async (uid) => {
  const res = await api.post("/admin/transactions/user/info", {
    uid: uid,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const transactionReportView = async (transaction_id) => {
  const res = await api.post("/admin/transactions/view", {
    transaction_id: transaction_id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getImpressionClick = async (campaign_id) => {
  const res = await api.post("/admin/campaign/impression/get", {
    campaign_id: campaign_id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const impClickCreate = async (data) => {
  const res = await api.post("/admin/campaign/impression/add", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const supportGetList = async (data) => {
  const res = await api.post("/admin/support/list", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const getSupportClick = async (ticket_no) => {
  const res = await api.post("/admin/support/view", {
    ticket_no: ticket_no,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const advchangepassword = async (auth_token, current_password, new_password, confirm_password) => {
  const res = await api.post("/advertiser/changepassword", {
    userid: auth_token,
    current_password: current_password,
    new_password: new_password,
    confirm_password: confirm_password,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const campaignReportGet = async (cat, camptype, type, pg, lim, src, startDate, endDate) => {
  const res = await api.post("/admin/campaign/report", {
    cat: cat,
    camptype: camptype,
    type: type,
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const campaignImportExcelReportGet = async (startDate, endDate) => {
  const res = await api.post("/admin/campaign/importexcelreport", {
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

// const campaignReportGet = async (data) => {

//     const res = await api.post('/admin/campaign/report', data);
//     if(res.data.code === 105) {
//         sessionLogout();
//     } else {

//         return res.data;
//     }
// }

const cmpImpReport = async (cmp_id, pg, lim, startDate, endDate) => {
  // console.log(uid);
  const res = await api.post("/admin/campaign/imprreport", {
    cmp_id: cmp_id,
    page: pg,
    lim: lim,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const impReportExcel = async (cmp_id) => {
  const res = await api.post("/admin/campaign/imprexportexcel", {
    cmp_id: cmp_id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const clickReportExcel = async (cmp_id) => {
  const res = await api.post("/admin/campaign/clickexportexcel", {
    cmp_id: cmp_id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const impCmpReportExcel = async (startDate, endDate) => {
  const res = await api.post("/admin/campaign/imprcmpexportexcel", {
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const cmpImpDetail = async (cmp_id, pg, lim, startDate, endDate) => {
  // console.log(uid);
  const res = await api.post("/admin/campaign/imprdetail", {
    cmp_id: cmp_id,
    page: pg,
    lim: lim,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

// const cmpImpDetail = async (data) => {
//     // console.log(uid);
//     const res = await api.post('/admin/campaign/imprdetail', data);
//     if(res.data.code === 105) {
//         sessionLogout();
//     } else {

//         return res.data;
//     }
// }

const cmpClickDetail = async (cmp_id, pg, lim, startDate, endDate) => {
  // console.log(uid);
  const res = await api.post("/admin/campaign/clickdetail", {
    cmp_id: cmp_id,
    page: pg,
    lim: lim,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getCampaignDetail = async (campaign_id) => {
  const res = await api.post("/admin/campaign/detail", {
    campaign_id: campaign_id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const userReportGet = async (type, acttype, pg, lim, src, startDate, endDate) => {
  const res = await api.post("/admin/user/report", {
    user_type: type,
    acttype: acttype,
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const saveRolePermission = async (data) => {
  const res = await api.post("/admin/role/create", data);
  return res.data;
};

const getrole = async () => {
  const res = await api.get("/admin/role/list");

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const getroledrop = async () => {
  const res = await api.get("/admin/role/get");
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const staffGetList = async (pg, lim) => {
  const res = await api.post("/admin/staff/list", {
    page: pg,
    lim: lim,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const staffCreate = async (data) => {
  const res = await api.post("/admin/staff/create", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const staffUpdate = async (data) => {
  const res = await api.post("/admin/staff/update", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const updateStaffStatus = async (id, sts) => {
  const res = await api.post("/admin/staff/statusupdate", {
    id: id,
    sts: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getSupportChat = async (data) => {
  const res = await api.post("/admin/support/info", data);
  return res.data;
};

const postSupportChat = async (data) => {
  const res = await api.post("/admin/support/chat", data);
  return res.data;
};

const userReportExport = async () => {
  const res = await api.get("/admin/genrate/pdf/user", {});
};

const getDashboardAmin = async () => {
  const res = await api.post("/admin/dashboard/new", {});
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

// const chagepassword = async (data) => {
//     const res = await api.post('/../forgetpassword/admin/submit', data);
//     return res.data;

//     // const res = await api.post('../forgetpassword/admin/submit', {
//     //     new_pass:new_pass,
//     //     conf_pass:conf_pass,
//     //     authkey:authkey
//     // });
//     // return res.data;
//   }

const chagepassword = async (new_pass, conf_pass, authkey) => {
  const res = await api.post("/forgetpassword/admin/submit", {
    new_pass: new_pass,
    conf_pass: conf_pass,
    authkey: authkey,
  });
  //  console.log(res);
  return res.data;
};
const sendLinkpassword = async (email) => {
  const res = await api.post("/forget/admin/password", {
    email: email,
  });
  //  console.log(res);
  return res.data;
};

const getAcountActivity = async (pg, lim, src, startDate, endDate) => {
  const res = await api.post("admin/activity/list", {
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const getAcountActivityImportExcelReport = async (startDate, endDate) => {
    const res = await api.post("/admin/activity/exporttoexcelactivity", {
        startDate: startDate,
        endDate: endDate,
    });
    if (res.data.code === 105) {
        sessionLogout();
    } else {
        return res.data;
    }
    };

/* Notice api routes */

const noticeList = async (pg, lim, src) => {
  const res = await api.post("/admin/notice/list", {
    page: pg,
    lim: lim,
    src: src,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const allTransactionList = async (pg, lim, src, startDate, endDate) => {
  const res = await api.post("/admin/all_transaction/list", {
    page: pg,
    lim: lim,
    src: src,
    startDate: startDate,
    endDate: endDate,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const transactionViews = async (transaction) => {
  const res = await api.post("/admin/transaction/views", {
    transaction: transaction,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const transactionAproved = async (txnid, uid) => {
  const res = await api.post("/admin/transactions/aproved", {
    txnid: txnid,
    uid: uid,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const noticeStatusUpdate = async (id, sts) => {
  const res = await api.post("/admin/notice/statusupdate", {
    id: id,
    sts: sts,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const noticeCreate = async (data) => {
  const res = await api.post("/admin/notice/insert", data);

  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const noticeUpdate = async (data) => {
  const res = await api.post("/admin/notice/update", data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const deleteNotice = async (id) => {
  const res = await api.post("/admin/notice/delete", {
    id: id,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};
const updateCampaign = async (data) => {
  const res = await api.post("/admin/campaign/updatetextad ", data);
  return res.data;
};

const getCampaignInfo = async (cid) => {
  const res = await api.post("/admin/campaign/showtextads", {
    cid: cid,
  });
  return res.data;
};
const uploadImage = async (data) => {
  const res = await api.post("/admin/campaign/imageupload", { img: data });
  return res.data;
};
const updateBannerCampaign = async (data) => {
  const res = await api.post("/admin/campaign/updatebannerad", data);
  return res.data;
};
/* Admin Add New User API Routes */
const saveAdminUserAdd = async (data) => {
  const res = await api.post("/admin/user/add", data);
  return res.data;
};
const categoryDropList = async () => {
  const res = await api.get("/admin/category/drop/list");
  return res.data;
};

const countryDropListUser = async () => {
  const res = await api.post("/admin/country/getcountryuserlist");
  return res.data;
};

const getCPCInfo = async (type, cat) => {
  // let uid = localStorage.getItem('uid');
  const res = await api.post("/admin/onchagecpc", {
    type: type,
    cat_name: cat,
  });
  return res.data;
};

const updateSocialCampaign = async (data) => {
  const res = await api.post("/admin/campaign/updatesocialad", data);
  return res.data;
};
const updateNativeCampaign = async (data) => {
  const res = await api.post("/admin/campaign/updatenativead", data);
  return res.data;
};
const updatePopupCampaign = async (data) => {
  const res = await api.post("/admin/campaign/updatepopunderad", data);
  return res.data;
};

export {
  loginAdmin,
  saveCategory,
  updateCategory,
  getCategoryList,
  getCmpListCategoryList,
  getUpdateCmpCategoryList,
  updateCategoryStatus,
  deleteCategory,
  saveCountry,
  updateCountryup,
  getCountryList,
  getCountryIndex,
  updateCountryStatus,
  countryUpdateStatus,
  deleteCountry,
  userDetailList,
  getInhouseUsersList,
  deleteInhouseUser,
  getClientList,
  deleteClients,
  updateUserStatus,
  updateUserAcountType,
  getCampaignList,
  getDeletdCampaignsList,
  deleteCampaign,
  updateCampaignStatus,
  updateAllCampaign,
  getCampaignDetail,
  notificationList,
  notificationStatusUpdate,
  getNotiUserData,
  notificationCreate,
  trashNotification,
  blockIpList,
  blockIpStatusUpdate,
  blockIpCreate,
  ipInfo,
  couponGetList,
  couponCreate,
  couponStatusUpdate,
  couponUserList,
  couponupdate,
  couponDelete,
  addFundToUser,
  transactionList,
  transactionReport,
  transactionReportImportExcelReport,
  advchangepassword,
  getTransactionUserInfo,
  getImpressionClick,
  impClickCreate,
  supportGetList,
  getSupportClick,
  campaignReportGet,
  campaignImportExcelReportGet,
  cmpImpReport,
  impReportExcel,
  clickReportExcel,
  impCmpReportExcel,
  cmpImpDetail,
  cmpClickDetail,
  userReportGet,
  userReportExport,
  transactionReportView,
  saveRolePermission,
  getSupportChat,
  postSupportChat,
  getrole,
  staffGetList,
  staffCreate,
  staffUpdate,
  updateStaffStatus,
  getroledrop,
  getDashboardAmin,
  chagepassword,
  sendLinkpassword,
  getAcountActivity,
  getAcountActivityImportExcelReport,
  noticeList,
  noticeStatusUpdate,
  noticeCreate,
  noticeUpdate,
  deleteNotice,
  loginUserapi,
  updateCampaign,
  getCampaignInfo,
  uploadImage,
  updateBannerCampaign,
  getCPCInfo,
  updateSocialCampaign,
  updateNativeCampaign,
  updatePopupCampaign,
  saveAdminUserAdd,
  categoryDropList,
  countryDropListUser,
  allTransactionList,
  transactionViews,
  transactionAproved,
  loginAsUserApi,
};
