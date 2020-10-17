import {Observable} from "rxjs";
import BasketItem from "../models/BasketItem";
import {UserData} from "./AuthService";



export default interface BasketItemServiceObservable {
    addBasketItem(basket: BasketItem):Promise<any>;
    removeBasketItem(id: number): Promise<any>;
    getBasket(userData: UserData): Observable<BasketItem>;
    updateBasketItem(id: number, basket: BasketItem): Promise<any>;
    removeOneBasketItem(id: number, basket: BasketItem):Promise<any>;
}
