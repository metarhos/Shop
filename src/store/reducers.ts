import AuthService, {UserData} from "../services/AuthService";
import {
    SET_AUTH_SERVICE, SET_BASKETITEM,
    SET_CARDITEM,
    SET_EMPLOYEES,
    SET_EMPLOYEES_SERVICE,
    SET_USER_DATA,
    SET_WINDOW_WIDTH,
    SET_TAB_INDEX

} from "./actions";
import EmployeeServiceObservable from "../services/EmployeeServiceObservable";
import Employee from "../models/EmployeeType";
import CardItem from "../models/CardItem";
import BasketItem from "../models/BasketItem";
import {useSelector} from "react-redux";
import {ReducersType} from "./store";


export const authServiceReducer =
    (authService: AuthService | null = null,
     action: { type: string, payload: any }): AuthService =>
        action.type === SET_AUTH_SERVICE ? action.payload : authService;
export const employeesServiceReducer =
    (employeesService: EmployeeServiceObservable | null = null,
     action: { type: string, payload: any }): EmployeeServiceObservable =>
        action.type === SET_EMPLOYEES_SERVICE ? action.payload : employeesService;
//да что тут внутри? А в эмплоях?
//Почему редюсеры ничего не делают, возвращают же тоже самое, что получили? -- сперва нулл, а потом объект...
//Зачем мы в стор положили эмплойСервис и юзерСервис? Как это вообще со стором связано
// -- это чтобы передать интерфейс, и если надо поменять реализацию, то все само поменяется

export const employeesReducer = //what are u doing?
    (employees: Employee[] = [], action: { type: string, payload: any }): Employee[] =>
        action.type === SET_EMPLOYEES ? action.payload.slice(0) : employees;
//.slice Return new array with link on obj and copy value of string and number

export const cardItemReducer =
    (cards: CardItem[] = [], action: { type: string, payload: any }): CardItem[] =>
        action.type === SET_CARDITEM ? action.payload.slice(0) : cards;

export const basketItemReducer =
    (basket: BasketItem = {id:'', productsNew:[]}, action: { type: string, payload: any }): BasketItem =>
        action.type === SET_BASKETITEM ? {...action.payload} : basket;



export const userDataReducer =
    (userData: UserData = {isAdmin: false, uid: 'a', user: 'a'}, action: { type: string, payload: any }): UserData =>
        action.type === SET_USER_DATA ? {...action.payload as UserData} : userData;

export const widthReducer = //return new window width, getting in payload from action
    (width: number = window.innerWidth, action: { type: string, payload: any }): number =>
        action.type === SET_WINDOW_WIDTH ? action.payload : width;
export const tabIndexReducer = (index: number = -1,
                                action: { type: string, payload: any }): number =>
    action.type === SET_TAB_INDEX ? action.payload : index;

