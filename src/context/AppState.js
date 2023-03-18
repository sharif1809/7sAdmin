import { useState } from "react";
import AppContext from "./AppContext";

export default function AppState(props) {
    const [sts, setSts] = useState({
        username : ""
    });
    return (
        <AppContext.Provider value={{sts, setSts}}>
            {props.children}
        </AppContext.Provider>
    )
}