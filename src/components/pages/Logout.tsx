import React from "react";
import {Button} from "@material-ui/core";
import {authService} from "../../config/server-config";
const Logout: React.FC = () => {
    const logout = () => {
        authService.logout().then();

    }
    return <React.Fragment>
        <Button onClick={logout}>Logout</Button>
    </React.Fragment>
}
export default Logout;
