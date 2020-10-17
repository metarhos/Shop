import React, {useCallback, useEffect,  useState} from 'react';
import {withRouter, Link, RouteComponentProps} from 'react-router-dom';
import {Tabs, Tab, TableCell, IconButton} from "@material-ui/core";
import MenuRoutes from "./MenuRotes";
import {ShoppingBasket} from "@material-ui/icons";
import PopUpTable from "./PopUpTable";
import DetailsIcon from "@material-ui/icons/Details";
import PopUpTopBar from "./PopUpTopBar";
import {makeStyles} from "@material-ui/core/styles";
import {dropMenu, PATH_EMPLOYEES} from "../../config/Menu";
import {useDispatch, useSelector} from "react-redux";
import BasketItem from "../../models/BasketItem";
import {ReducersType} from "../../store/store";
import {tabIndexAction} from "../../store/actions";
type Props = {
    menu: {path: string, label: string}[],
    countNavigator?: number,
    dropMenu: any[]
}



const Topbar:React.FC<RouteComponentProps&Props> = (props: RouteComponentProps&Props) => { //React.FC  is special type for checking TS
    //!!! What is it type RouteComponentProps&Props

const dispatch = useDispatch();
    const {menu, countNavigator} = props;
    function current(path: string): number {

        const index = menu.findIndex(item => item.path === path);
        if (countNavigator && index > countNavigator) {
            [menu[countNavigator - 1], menu[index] ]= [menu[index], menu[countNavigator - 1]]
            //if number of tabs elements < current opened tab, it change array menu and set in last element name current opened elem.
            //This show new name for last element of tabs
            return countNavigator - 1;
        }
        return index;
    }
    const currentCallback = useCallback(current, [props.countNavigator]);
    const [value, setValue] = useState<number>(current(props.location.pathname));
    //this set value of current opened component. rerender if open new component
    //const because here just link on obj
    useEffect(() => {

        setValue(currentCallback(props.location.pathname))
        dispatch(tabIndexAction(currentCallback(props.location.pathname)))
    },[props.countNavigator, props.location.pathname, currentCallback])
    const handleChange = (event: any, tabValue: number) => {
        setValue(tabValue);
        //set new tab value (number of new opened component) and rerender
    }
    function getNavItems(): {path: string, label: string}[] {
        if (!countNavigator || countNavigator >= menu.length) {
            //if can show all, than this fn showing all
            return menu;
        }
        return menu.filter((item, index) => index < countNavigator);
        //he return menu with only tabs, who can be shown
    }
    function getPopupItems(): {path: string, label: string}[] {
        return menu.filter((item, index) => index >= (countNavigator as number));
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [flOpen, setFlOpen] = React.useState<boolean>(false);
    function getPopUpData(row: object): string[] {
        return Object.entries(row).map(e => `${e[0]}: ${e[1]}`);
    }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setFlOpen(true)
    };
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {

        setFlOpen(true)
    };

    function setSubMenuValue(index: number) {
        dispatch(tabIndexAction(index))
        setValue(index);
    }

    return <React.Fragment>
        <Tabs onChange={handleChange} value={value}>
            {/*Tabs is function who take value and active*/}
            {/*value is numbers of tab in tabs. Tab = view of concrete MENU by massive of Tabs*/}
            {getNavItems().map((item, index) =>  {

                //forEach tab add additionalMenu

               if(item.label=="Basket") { //send in config Menu icon={<ShoppingBasket />

                   return  (
                       <Tab key={item.path}
                            component={Link} to={item.path} icon={<ShoppingBasket />}>
                       </Tab>

                   )
               }

               if(item.label == 'Employees') {

                   return (
                       <PopUpTopBar index={index} itemPath={item.path} setIndexFn={setSubMenuValue} name={'Employees'} data={props.dropMenu[0]!}/>
                   )
               }
               //here comment for git
                if(item.label == 'Statistics') {

                    return <PopUpTopBar itemPath={item.path} index={index} setIndexFn={setSubMenuValue}  name={'Statistics'} data={props.dropMenu[1]!}/>
                }
                if(item.label == 'Shop'){

                    return <PopUpTopBar itemPath={item.path} index={index} setIndexFn={setSubMenuValue}  name={'Shop'} data={props.dropMenu[2]!}/>
                }

                return <Tab key={item.path} component={Link} to={item.path} label={item.label}>
                </Tab>
            })}

            {(!!countNavigator && countNavigator < menu.length) && <MenuRoutes menu={getPopupItems()}/>}
            {/*if this 2 args true, than show detail menu (hamburger)*/}



        </Tabs>
    </React.Fragment>

}
export default  withRouter(Topbar); //withRouter
