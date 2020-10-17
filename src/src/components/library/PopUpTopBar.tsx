import React, {useEffect} from "react";
import { Tab, Theme} from "@material-ui/core";
import {Link} from "react-router-dom";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
type Props = {
    data: any[],
    name: string,
    index: number,
    setIndexFn: (index: number) => void,
    itemPath: string

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
    const tabIndex: number = useSelector((state: ReducersType) => state.tabIndex);
useEffect(() => {
    if (tabIndex !== props.index){
        setAnchorEl(null)
        setFlOpen(false);
    }

}, [tabIndex])
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
                 component={Link} to={props.itemPath}
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
