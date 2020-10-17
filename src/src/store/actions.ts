import Employee from "../models/EmployeeType";
import {UserData} from "../services/AuthService";
import CardItem from "../models/CardItem";
import BasketItem from "../models/BasketItem";

export const SET_TAB_INDEX = 'set-tab-index';

export const SET_EMPLOYEES = 'set-employees';
export const SET_CARDITEM = 'set-cards';
export const SET_BASKETITEM = 'set-baskets';
export const SET_USER_DATA = 'set-user-data';
export const SET_AUTH_SERVICE = 'set-auth-service';
export const SET_EMPLOYEES_SERVICE = 'set-employees-service';
export const SET_WINDOW_WIDTH = 'set-window-width'

export const employeesAction = (employees: Employee[]): {type: string, payload: any} =>
    ({type: SET_EMPLOYEES, payload: employees});

export const cardsItemAction = (cards: CardItem[]): {type: string, payload: any} =>
    ({type: SET_CARDITEM, payload: cards});

export const basketsItemAction = (basket: BasketItem): {type: string, payload: any} =>
    ({type: SET_BASKETITEM, payload: basket});

export const userDataAction = (userData: UserData): {type: string, payload: any} =>
    ({type: SET_USER_DATA, payload: userData})
export const widthAction = (width: number):{type: string, payload: any} =>
    ({type: SET_WINDOW_WIDTH, payload: width})
export const tabIndexAction = (index: number):{type: string, payload: any} =>
    ({type: SET_TAB_INDEX, payload: index})
