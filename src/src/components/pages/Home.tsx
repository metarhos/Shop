import React, {useState} from "react";
import Topbar from "../library/Topbar";
import {menu} from "../../config/Menu";
import {UserData} from "../../services/AuthService";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import {tabsWidth} from "../../window-width-config";
import Album from "./AlbumHome";

import {dropMenu} from "../../config/Menu";
import {menuItem} from "../../config/Menu";
import usePollerRedux from "../../util/poller";
import BasketItem from "../../models/BasketItem";
import {authService, serviceBasket} from "../../config/server-config";
import {basketsItemAction} from "../../store/actions";
import {POLLING_INTERVAL} from "../../config/consts";
import ErrorTypes from "../../util/ErrorTypes";


export function getMenuItems(userData: UserData) {
    let a = menu.filter(item => !item.admin || userData.isAdmin); //show only who have permission
    return a
}


export function getNumberTabs(width: number): number {
    const index = tabsWidth.findIndex(tw => width > tw[0]);
    //find true expression for first row in array tabsWidth. tw contain array [width, numOfTabs]
    return tabsWidth[index][1];
    //by end return number of elements who need render
}

const initialStateMenuItem:menuItem = {
    path: '',
    label: '',
    admin: true
}
export const getDropMenuItems = (userData: UserData) => {
    let res:menuItem[][]
    res = [[initialStateMenuItem]]

    dropMenu.map(menu => {
            return Object.entries(menu).forEach(([key, value]) => {
                res.push( value.filter(item => !item.admin || userData.isAdmin))
            })
        }
    )

    return res.splice(1)
}

function errorHandler(error: ErrorTypes) { //Not research yet
    if (error === ErrorTypes.AUTH_ERROR) {
        authService.logout().then();
    }
}





const Home: React.FC = () => {
    const userData = useSelector((state: ReducersType) => state.userData);



    const width: number = useSelector((state: ReducersType) => state.width);
    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <Album userData={userData} />

    </React.Fragment>
}
export default Home;
