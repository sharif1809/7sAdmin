const menu = [
  // {
  //   heading: "Pre-built Pages",
  // },

  // {
  //   icon: "user-alt",
  //   text: "Manage Admin",
  //   active: false,
  //   subMenu: [
  //     {
  //       icon: "user-alt",
  //       text: "Profile",
  //       link: "/user-list-regular",
  //     },
  //     {
  //       icon: "signout",
  //       text: "Logout",
  //       link: "/user-list-compact",
  //     },
      
  //   ],
  // },
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  
  {
    heading: "Advertiser Panel",
  },
  {
    icon: "users",
    text: "Add New Users",
    link: "/add-new-user",
  },
  
  {
    icon: "users",
    text: "Manage Advertiser",
    active: false,
    subMenu: [
      {
        icon: "home",
        text: "Inhouse",
        link: "/inhouse-advertiser-list",
      },
      {
        icon: "users",
        text: "Clients",
        link: "/clients-advertiser-list",
      },
      
      
    ],
  },
  

  // {
  //   icon: "home",
  //   text: "Manage Inhouse Users",
  //   link: "/inhouse-user-list",
  // },

  // {
  //   icon: "users",
  //   text: "Manage Clients",
  //   link: "/clients-list",
  // },

  // {
  //   icon: "users",
  //   text: "Manage Staff",
  //   link: "/staff-list",
  // },
  
  {
    icon: "globe",
    text: "Manage Country",
    link: "/country-list",
  },
  {
    icon: "list",
    text: "Manage Category",
    link: "/category-list",
  },

  {
    icon: "tile-thumb",
    text: "Campaigns List",
    link: "/campaign-list",
    active: false,
    
  },
  {
    icon: "file-docs",
    text: "Manage Report",
    active: false,
    subMenu: [
      {
        icon: "file-docs",
        text: "Campaign Report",
        link: "/campaign-report",
      },  
      {
        icon: "file-docs",
        text: "User Wallet Report",
        link: "/user-report",
      },   
      {
        icon: "icon ni ni-activity-round-fill",
        text: "Activity Log",
        link: "/activity-log",
      },  
      
    ],
  },

  {
    icon: "bell",
    text: "Manage Notification",
    link: "/notification-list",
  },

  // {
  //   icon: "na",
  //   text: "Manage Block IP",
  //   link: "/blockip-list",
  // },
  {
    icon: "offer",
    text: "Manage Coupon",
    link: "/coupon-list",
  },

  {
    icon: "icon ni ni-tranx",
    text: "Payment Report",
    link: "/payment-report",
  },

  // {
  //   icon: "icon ni ni-setting",
  //   text: "Role & Permission",
  //   link: "/role-permission-list",
  // },

  

  {
    icon: "icon ni ni-setting",
    text: "Manage Notice",
    link: "/notice-list",
  },

  {
    icon: "icon ni ni-tranx",
    text: "Transaction History",
    link: "/payment-log-section",
  },
  {
    icon: "tile-thumb",
    text: "Deleted Campaigns List",
    link: "/deleted-campaign-list",
    active: false,
    
  },  

  {
    heading: "Publisher Panel",
  },
  {
    icon: "users",
    text: "Manage Publisher",
    active: false,
    subMenu: [
      {
        icon: "home",
        text: "Inhouse",
        link: "/inhouse-publisher-list",
      },
      {
        icon: "users",
        text: "Clients",
        link: "/clients-publisher-list",
      },
      
      
    ],
  },
  {
    icon: "sign-brl-alt",
    text: "Manage Ad Rates",
    link: "/ad-rates-list",
  },
  {
    icon: "globe",
    text: "Website List",
    link: "/website-list",
  },
  {
    icon: "globe",
    text: "AdUnit List",
    link: "/adunit-list",
  },
  {
    heading: "Others",
  },
  {
    icon: "icon ni ni-setting",
    text: "Manage Support",
    link: "/support-list",
  },
];
export default menu;
