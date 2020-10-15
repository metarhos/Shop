import React from "react";
import {Link} from "react-router-dom";
import {IconButton, Menu, Tab} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
type Props = {
    menu: {path: string, label: string}[]
}
const MenuRoutes: React.FC<Props> =
    (props) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };
        return <React.Fragment>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MenuIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <div style={{display:'flex', flexDirection:'column'}}>
                    {props.menu.map(item => <Tab key={item.path}
                                                 component={Link} to={item.path} label={item.label}/>)}
                </div>

            </Menu>
        </React.Fragment>
}
export default MenuRoutes
