import AuthService, {UserData} from "../services/AuthService";
import EmployeeServiceObservable from "../services/EmployeeServiceObservable";
import Employee from "../models/EmployeeType";
import {combineReducers, createStore} from "redux";
import {
    authServiceReducer, basketItemReducer,
    cardItemReducer,
    employeesReducer,
    employeesServiceReducer,
    userDataReducer,
    widthReducer
} from "./reducers";
import CardItem from "../models/CardItem";
import BasketItem from "../models/BasketItem";

export type ReducersType = {
    authService: AuthService,
    employeesService: EmployeeServiceObservable,
    employees: Employee[],
    userData: UserData,
    width: number,
    cardItems: CardItem[],
    basket: BasketItem
}
const allReducers = combineReducers<ReducersType>({
    authService: authServiceReducer,
    employees: employeesReducer,
    employeesService: employeesServiceReducer,
    userData: userDataReducer,
    width: widthReducer,
    cardItems: cardItemReducer,
    basket: basketItemReducer
})
export const store = createStore(allReducers, (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__());
