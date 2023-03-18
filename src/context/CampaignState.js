import { useState } from "react";
import CampaignContext from "./CampaignContext";

export default function CampaignState(props) {
    const [sts, setSts] = useState({
        campaign_type       : "",
        ad_type             : "",
        ad_title            : "",
        ad_description      : "",
        website_category    : "",
        target_url          : "",
        conversion_url      : "",
        daily_budget        : "",
        device_os           : "",
        device_type         : "",
        countries           : "All",
        success             : false
    });
    return (
        <CampaignContext.Provider value={{sts, setSts}}>
            {props.children}
        </CampaignContext.Provider>
    )
}