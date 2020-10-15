import EmployeesServiceRest from "../services/EmployeesServiceRest";
import AuthServiceRest from "../services/AuthServiceRest";
import EmployeesServiceFirebase from "../services/EmployeesServiceFirebase";
import AuthServiceFirebase from "../services/AuthServiceFirebase";
import CardsItemServiceFirebase from "../services/CardsItemServiceFirebase";
import BasketItemServiceFirebase from "../services/BasketItemServiceFirebase";

export const SERVER_URL = 'http://localhost:3500/employees'
export const AUTH_SERVER_URL = 'http://localhost:3500'
// export const service = new EmployeesServiceRest(SERVER_URL);
// export const authService = new AuthServiceRest(AUTH_SERVER_URL);


export const COLLECTION = 'employees'
export const ADMIN_COLLECTION = 'administrators'
export const CARDS_COLLECTION = 'cards'
export const BASKET_COLLECTION = 'basket'
export const service = new EmployeesServiceFirebase(COLLECTION);
export const authService = new AuthServiceFirebase(ADMIN_COLLECTION);
export const serviceCard = new CardsItemServiceFirebase(CARDS_COLLECTION);
export const serviceBasket = new BasketItemServiceFirebase(BASKET_COLLECTION);



