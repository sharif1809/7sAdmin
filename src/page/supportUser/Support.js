import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import InboxAside from "./InboxAside";
import InboxBody from "./InboxBody";
import { navData, inboxLabels, contacts, inboxList } from "./InboxData";
import { getSupportData } from "../../app/api";
import { ToastContainer } from "react-toastify";
import Loader from "../../app/Loader";

const Support = () => {
  const [currentTab, setCurrentTab] = useState("Inbox");
  const [mailId, setMailId] = useState(1);
  const [messageView, setMessageView] = useState(false);
  const [data, setData] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [rows, setRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const getSupportList = async (pg) =>  {
      setLoading(true)
      let uid = localStorage.getItem('uid');
      
      let res = await getSupportData({
          uid:uid,
          page:(pg) ? pg : currentPage,
          lim:itemPerPage
        });
        console.log(res.data);
        if(res.code == 200) {
          setData(res.data);
          setRows(res.row);
        }
        
      setLoading(false)
    }

  // Filters mail list according to tabs
  useEffect(() => {

    getSupportList();
    setCurrentPage(1);
  }, []); 

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => {
    console.log(pageNumber);
    setCurrentPage(pageNumber)}
    ;

  return (
    <React.Fragment>
      <Head title="Inbox"></Head>
      <Content>
        <div className="nk-ibx">
        <Loader visible={loading} />
          <InboxBody
            data={data}
            currentTab={currentTab}
            setTabData={setTabData}
            setMailId={setMailId}
            itemPerPage={itemPerPage}
            totalItems={rows}
            paginate={paginate}
            currentPage={currentPage}
            loadData={getSupportList}
          />
        </div>
        <ToastContainer />
      </Content>
    </React.Fragment>
  );
};

export default Support;
