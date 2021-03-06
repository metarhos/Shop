import AuthService, {LoginData, UserData} from "./AuthService";
import {Observable, of} from "rxjs";
import LoginCodes from "../util/LoginCodes";
import {authState} from "rxfire/auth";
import appFirebase from "../config/firebase-sdk";
import {map, mergeMap} from "rxjs/operators";
import {docData} from "rxfire/firestore";
import firebase from "firebase";

export default class AuthServiceFirebase implements AuthService {

    constructor(private adminCollection: string) {
    }
    getUserData(): Observable<UserData> {
        return authState(appFirebase.auth())
            .pipe(mergeMap<firebase.User, Observable<UserData>>(user => {
                if (user && user.email ) {
                    return docData(appFirebase.firestore().collection(this.adminCollection)
                        .doc(user.email)).pipe(map(admin => {
                        return {user: user.email as string, uid: user.uid, isAdmin: !!admin && !!(admin as any).uid}
                    }))
                }
                return of({user: '', uid: user.uid, isAdmin: false})
            }))
    }

    login(loginData: LoginData): Promise<LoginCodes> {
        if (!loginData.password) {
            return this.socialNetworkAuth(loginData.email);
        }
        return appFirebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
            .then(() => LoginCodes.OK).catch(() => LoginCodes.WRONG_CREDENTIALS);
    }

    signUp(loginData: LoginData): Promise<LoginCodes> {
        return appFirebase.auth().createUserWithEmailAndPassword(loginData.email, loginData.password)
            .then(() => LoginCodes.OK).catch(() => LoginCodes.WRONG_CREDENTIALS);
    }

    logout(): Promise<boolean> {
        return appFirebase.auth().signOut().then(()=>true);
    }

    private socialNetworkAuth(providerName: string): Promise<LoginCodes> {
        const authProvider = AuthServiceFirebase.getProvider(providerName);
        if (!authProvider) {
            return Promise.resolve(LoginCodes.WRONG_CREDENTIALS);
        }
        return appFirebase.auth().signInWithPopup(authProvider)
            .then(() => LoginCodes.OK).catch(() => LoginCodes.WRONG_CREDENTIALS);
    }

    private static getProvider(providerName: string): firebase.auth.AuthProvider | undefined {
        let res: firebase.auth.AuthProvider | undefined
        switch(providerName) {
            case 'google':
                res = new firebase.auth.GoogleAuthProvider();
                break;
            case 'twitter':
                res = new firebase.auth.TwitterAuthProvider();
                break;
            case 'facebook':
                res = new firebase.auth.FacebookAuthProvider();
                break;
            default:
                res = undefined;
        }
        return res;
    }
}
