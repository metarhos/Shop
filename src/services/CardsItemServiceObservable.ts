import {Observable} from "rxjs";
import CardItem from "../models/CardItem";

export default interface CardsServiceObservable {
    addCard(card: CardItem):Promise<any>;
    removeCard(id: number): Promise<any>;
    getAllCardsItem(): Observable<CardItem[]>;
    updateCard(id: number, card: CardItem): Promise<any>;
}
