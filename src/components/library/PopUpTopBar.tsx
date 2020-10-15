import React from "react";
import {IconButton, Menu, MenuItem, Tab, Theme} from "@material-ui/core";
import DetailsIcon from "@material-ui/icons/Details";
import {Link} from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {PATH_ADD_EMPLOYEE, PATH_BASKET} from "../../config/Menu";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
type Props = {
    data: any[],
    name: string,
    index: number,
    setIndexFn: (index: number) => void

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

    const handleChange = (event: any) => {
        props.setIndexFn(props.index);
        setAnchorEl(event.currentTarget);
        setFlOpen(true)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setFlOpen(false)
    };

    return <React.Fragment>


            <Tab key={props.data[0].path} className={classes.direction} onMouseEnter={handleChange}
                label={props.name} icon={<ArrowDropDownIcon /> }>
            </Tab>



        <Popper

            anchorEl={anchorEl}
            open={flOpen}>
           <Paper style={{display:"flex", flexDirection:"column"}}>

            {props.data.map(item =>

                    <Tab onClick={handleClose} key={item.path} component={Link} to={item.path} label={item.label}>
                    </Tab>

            )}
           </Paper>


        </Popper>

    </React.Fragment>
}
export default PopUpTopBar;
