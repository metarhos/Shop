import firebase from "firebase";
import appFirebase from "../config/firebase-sdk";
import {collectionData, docData} from "rxfire/firestore";

import {Observable, of} from "rxjs";
import ErrorTypes from "../util/ErrorTypes";

import {firestore} from "firebase";


import {map, mergeMap} from "rxjs/operators";
import BasketItemServiceObservable from "./BasketItemServiceObservable";
import BasketItem from "../models/BasketItem";
import {UserData} from "./AuthService";
import {serviceBasket} from "../config/server-config";
import {useDispatch, useSelector} from "react-redux";
import {basketsItemAction} from "../store/actions";
import {ReducersType} from "../store/store";


export default class BasketItemServiceFirebase implements BasketItemServiceObservable {

    db: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
    collection: string;

    constructor(collection: string) {
        this.db = appFirebase.firestore().collection(collection);
        this.collection = collection
    }


    exists(id: any): Promise<boolean> {
        let a = this.db.doc(id.toString()).get().then(doc => doc.exists);
        return a
    }


    async removeBasketItem(id: number): Promise<any> {
        debugger
        if (await this.exists(id)) {
            return this.db.doc(id.toString()).delete();
        }
        throw ErrorTypes.SERVER_ERROR;
    }

    async updateBasketItem(id: number, basket: BasketItem): Promise<any> {
        if (await this.exists(id)) {
         //   const baskFire: BasketItem = basket;
         //   return this.db.doc(basket.id.toString()).set(baskFire)
        }
        throw ErrorTypes.SERVER_ERROR;
    }


    getBasket(userData: UserData): Observable<BasketItem> {
        // let a = docData(this.db.doc(userData.uid))

        return docData(this.db.doc(userData.uid))


        // const query = this.db.where('id', '==', userData.uid);
        //for work this need add index in firestore for cllction and id
    }


    async addBasketItem(basket: BasketItem): Promise<any> {

        let id = basket.id.toString()
        const snapshot = await firebase.firestore().collection(this.collection).get() //here we don't use appFirebase. Why need appFirebase. before firebase.firestore()...
        let bb = JSON.parse(JSON.stringify(basket)) //??

        bb = {
            id,
            productsNew:basket.productsNew
        }

        //  добавляем в базу
        await firestore().collection(this.collection).doc(id).set(bb)

        // проверяем что добавилось - можно потом удалить
        let checkIfAdded = snapshot.docs.map(doc => doc.data());

        return await this.db.doc(basket.id.toString()).set(basket)
    }




    async removeOneBasketItem(id: number, basket: BasketItem): Promise<any> {

        // if (await this.exists(id)) {
        //     if (basket.quantity == 1) {
        //         return this.db.doc(id.toString()).delete();
        //     }
        //     const bas = {...basket, quantity: (basket.quantity - 1)}
        //     return this.db.doc(basket.id.toString()).set(bas)
        // }
        return this.db.doc(basket.id.toString()).set(basket)
    }


}
