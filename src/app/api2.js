import { create } from "apisauce";
const auth_token = localStorage.getItem("accessToken");
const api = create({
  // baseURL: "http://192.168.1.14/7sapp/7searchBackend/public/api/",
  // baseURL: "http://192.168.1.4/7SearchServices/public/api/",
  baseURL: 'https://services.7searchppc.in/api/',
  // baseURL: 'https://services.7searchppc.com/api/',
  headers: {
    "X-API-KEY": "580eca75d1ffbacca33edc3278c092e9",
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

// Ad rate api

const adRateList = async (category_id, country_id, pg, lim) => {
  const res = await api.post("/admin/pub/ratemaster/list", {
    category_id: category_id,
    country_id:country_id,
    page: pg,
    lim: lim,
  });
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const adRateStore = async (data) => {
  const res = await api.post("/admin/pub/ratemaster/store", data);
  //console.log(res.data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const updateAdRate = async (data) => {
  const res = await api.post("/admin/pub/ratemaster/update", data);
  //console.log(res.data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

// Manage Website

const websiteList = async (website_category, website_status, pg, lim, src) => {
  const res = await api.post("/admin/pub/website/list", {
    website_category:website_category,
    website_status:website_status,
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

const websiteReject = async (data) => {
  const res = await api.post("/admin/pub/website/status/rejected", data);
  //console.log(res.data);
  if (res.data.code === 105) {
    sessionLogout();
  } else {
    return res.data;
  }
};

const websiteStatusUpdate = async (id, sts) => {
  const res = await api.post("/admin/pub/website/status/update", {
    id: id,
    status: sts,
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



export {
  loginAdmin,
  loginAsUserApi,
  adRateList,
  adRateStore,
  updateAdRate,
  websiteList,
  websiteReject,
  websiteStatusUpdate,
};
