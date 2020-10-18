import React, {useState} from "react";
import {Button} from "@material-ui/core";
import {authService} from "../../config/server-config";
import {BrowserRouter, NavLink, Redirect, Route} from "react-router-dom";
import Home from "./Home";
import {PATH_HOME, PATH_LOGIN} from "../../config/Menu";
import { useHistory } from "react-router-dom";



const Logout: React.FC = () => {
    const [backFl, setBackFl] = useState<boolean>(false);
    async function logout () {
       await authService.logout().then();
    setBackFl(true)

    }

    return <React.Fragment>
        <Button onClick={logout}>Logout</Button>
        {backFl && <Redirect to={'/login'}/>}
    </React.Fragment>
}
export default Logout;
