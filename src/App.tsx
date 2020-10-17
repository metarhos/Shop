//Before work need instal client-server: npm -i rxjs, npm i axios, npm i axios-observable
//Install material UI: npm install @material-ui/core
//For change materialUi style install: npm i styled-components @types/styled-components
//For firebase instal: npm i rxfire firebase
//Access Token located in Chrome-Debugger-Application-Storage-LocalStorage


import React, {useEffect} from 'react';
import Employee from "./models/EmployeeType";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import {
    PATH_ADD_EMPLOYEE, PATH_ADD_PRODUCT, PATH_BASKET, PATH_DEPARTMENT_STATISTICS,
    PATH_EMPLOYEES,
    PATH_GENERATION,
    PATH_HOME, PATH_LOGIN, PATH_LOGOUT,
    PATH_SALARY_STATISTICS, PATH_SEARCH, PATH_SHOP, PATH_TESTERS
} from "./config/Menu";
import Home from "./components/pages/Home";
import {Employees} from "./components/pages/Employees";
import NewEmployee from "./components/pages/NewEmployee";
import EmployeesGeneration from "./components/pages/EmployeesGeneration";
import SalaryStatistics from "./components/pages/SalaryStatistics";
import DepartmentStatistics from "./components/pages/DepartmentStatistics";
import EmployeesSearch from "./components/pages/EmployeesSearch";
import EmployeeServiceObservable from "./services/EmployeeServiceObservable";
import EmployeesServiceRest from "./services/EmployeesServiceRest";
import {AUTH_SERVER_URL, SERVER_URL, serviceBasket, serviceCard} from "./config/server-config";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import AuthService, {UserData} from "./services/AuthService";
import AuthServiceRest from "./services/AuthServiceRest";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import {
    basketsItemAction,
    cardsItemAction,
    employeesAction,
    SET_AUTH_SERVICE,
    SET_EMPLOYEES_SERVICE,
    userDataAction,
    widthAction
} from "./store/actions";
import {authService, service} from "./config/server-config";
import usePollerRedux from "./util/poller";
import {useDispatch, useSelector} from "react-redux";
import {ReducersType} from "./store/store";
import ErrorTypes from "./util/ErrorTypes";
import {POLLING_INTERVAL} from "./config/consts";
import CardItem from "./models/CardItem";

import Basket from "./components/pages/Basket";
import BasketItem from "./models/BasketItem";
import NewCardItem from "./components/pages/NewCardItem";
import ShopProgrammers from "./components/pages/ShopProgrammers";



function errorHandler(error: ErrorTypes) { //Not research yet
    if (error === ErrorTypes.AUTH_ERROR) {
        authService.logout().then();
    }
}

function App(): JSX.Element {

    let userData = useSelector((state: ReducersType) => state.userData);

    usePollerRedux<Employee[]>(service, service.getAllEmployees, undefined, employeesAction, errorHandler, POLLING_INTERVAL);
    //This is tupple with 1 elements. And this is customHook, he deal rerender App when employees changed.

    usePollerRedux<CardItem[]>(serviceCard, serviceCard.getAllCardsItem, undefined, cardsItemAction, errorHandler, POLLING_INTERVAL);

    usePollerRedux<UserData>(authService, authService.getUserData, undefined, userDataAction, errorHandler);

    //usePollerRedux<BasketItem>(serviceBasket, serviceBasket.getBasket, userData, basketsItemAction, errorHandler, POLLING_INTERVAL);

    const dispatch = useDispatch();
    //This hook returns a reference to the dispatch function from the Redux store.


    useEffect(() => window.addEventListener('resize', () => dispatch(widthAction(window.innerWidth))), [dispatch])
    //useEffect deal action after render if he have dependencies in [], or 1 time after mount
    //addEventListener attaches(now) an event handler to the window, who have param innerWidth. addEventListener have different type of action like 'resize' and 'click'. Second param - is function
    // You may use it to dispatch (send) actions as needed and automatically after render


    //useSelector allows you to extract data from the Redux store state. He will also subscribe to the Redux store, and run your selector whenever an action is dispatched.
    //ReducersType - look this type from store. With his reducer function, this selector return userData. Need for authorization
    const theme: Theme = createMuiTheme({
        spacing: 8
    })

    return <ThemeProvider theme={theme}>
        {/*<BasketProvider dataProvider={new MyBasketDataProvider()}>*/}
        <HashRouter>
            <Redirect to={!!userData.user ? PATH_HOME : PATH_LOGIN}/>
            <Switch>
                <Route path={PATH_HOME} exact render={() => {
                    return !!userData.user && <Home/>
                }}/>
                <Route path={PATH_SHOP} exact render={() => {
                    return !!userData.user && <ShopProgrammers />
                }}/>
                {/*<Route path={PATH_TESTERS} exact render={() => {*/}
                {/*    return !!userData.user && <ShopTesters />*/}
                {/*}}/>*/}
                <Route path={PATH_LOGIN} exact render={() => {
                    return <Login/>
                }}/>
                <Route path={PATH_LOGOUT} exact render={() => {
                    return !!userData.user && <Logout/>
                }}/>
                <Route path={PATH_EMPLOYEES} exact render={() =>
                    !!userData.user && <Employees />}/>
                <Route path={PATH_ADD_PRODUCT} exact render={() =>
                    !!userData.user && <NewCardItem
                        backPath={PATH_HOME}/>}/>
                <Route path={PATH_ADD_EMPLOYEE} exact render={() =>
                    // userData.isAdmin && <NewEmployee
                    userData.user && <NewEmployee
                        backPath={PATH_EMPLOYEES}/>}/>
                <Route path={PATH_BASKET} exact render={() =>
                    !!userData.user && <Basket />}/>
                <Route path={PATH_GENERATION} exact render={() => userData.isAdmin && <EmployeesGeneration
                />}/>
                <Route path={PATH_SALARY_STATISTICS} exact render={
                    () => !!userData.user && <SalaryStatistics
                    />}/>
                <Route path={PATH_DEPARTMENT_STATISTICS} exact render={
                    () => !!userData.user && <DepartmentStatistics
                    />}/>
                <Route path={PATH_SEARCH} exact render={
                    () => !!userData.user && <EmployeesSearch
                    />}/>
            </Switch>
        </HashRouter>
        {/*</BasketProvider>*/}
    </ThemeProvider>

}

export default App;