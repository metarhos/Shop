import React from "react";
import {IconButton, Menu, MenuItem, Tab, Theme} from "@material-ui/core";
import DetailsIcon from "@material-ui/icons/Details";
import {Link} from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {PATH_ADD_EMPLOYEE, PATH_BASKET} from "../../config/Menu";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
type Props = {
    data: any[],
    name: string

}
const useStyles = makeStyles((theme: Theme) =>
    ({
        direction: {
            flexDirection: "row-reverse",
            width: "auto",
            padding: 0

        },
        root: {
            flexGrow: 1,
            maxWidth: 700
        },
    }));
const PopUpTopBar: React.FC<Props> = (props) => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [flOpen, setFlOpen] = React.useState<boolean>(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setFlOpen(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setFlOpen(false)
    };


    return <React.Fragment>



        <IconButton size="small" aria-controls="simple-menu" aria-haspopup="true" onMouseEnter={handleClick}

                    onClick={()=>{window.open("http://ya.ru")}}>

            <Tab key={props.data[0].path} className={classes.direction}
                 component={Link} to={props.data[0].path} label={props.name} icon={<ArrowDropDownIcon />}>
            </Tab>

        </IconButton>

        <Menu
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={flOpen}
            onClose={handleClose}
        > <div onMouseLeave={handleClose}>
            {props.data.map(item =>
                <div>
                    <Tab key={item.path} component={Link} to={item.path} label={item.label}>
                    </Tab>
                </div>
            )}
        </div>


        </Menu>

    </React.Fragment>
}
export default PopUpTopBar;
