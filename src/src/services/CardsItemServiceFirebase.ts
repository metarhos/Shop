import firebase from "firebase";
import appFirebase from "../config/firebase-sdk";
import CardsItemServiceObservable from "./CardsItemServiceObservable";
import {collectionData} from "rxfire/firestore";
import CardItem from "../models/CardItem";
import {Observable} from "rxjs";
import ErrorTypes from "../util/ErrorTypes";


import {map} from "rxjs/operators";


export default class CardsItemServiceFirebase implements CardsItemServiceObservable {
    db: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

    constructor(collection: string) {
        this.db = appFirebase.firestore().collection(collection);

    }

    exists(id: number): Promise<boolean> {
        return this.db.doc(id.toString()).get().then(doc => doc.exists);
    }

    async addCard(card: CardItem): Promise<any> {
        if (await this.exists(card.id)) {
            throw ErrorTypes.SERVER_ERROR
        }
        return this.db.doc(card.id.toString()).set(card)
    }



    async removeCard(id: number): Promise<any> {
        if (await this.exists(id)) {
            return this.db.doc(id.toString()).delete();
        }
        throw ErrorTypes.SERVER_ERROR;
    }

    async updateCard(id: number, card: CardItem): Promise<any> {
        if (await this.exists(id)) {
            return this.db.doc(card.id.toString()).set(card)
        }
        throw ErrorTypes.SERVER_ERROR;
    }


    getAllCardsItem(): Observable<CardItem[]> {
        return collectionData<CardItem>(this.db)
            .pipe(map((cards) => {
                return cards;
            }));



    }
}
