//This service for JSON Auth Server
import {Axios} from "axios-observable";
import AuthService, {LoginData, UserData} from "./AuthService";
import {Observable, of} from "rxjs";
import {map} from 'rxjs/operators';
import LoginCodes from "../util/LoginCodes";
import {AxiosError} from "axios";
export const ACCESS_TOKEN ='accessToken';
function toUserData(this: any, accessToken: string): Observable<UserData> {
    //here always run and check accaessToken
    const tokenBody = accessToken.split('.')[1];
    const tokenBodyObj = JSON.parse(atob(tokenBody));//atob - decode base64. What in tokenBodyObj in result?
    //!!!in result email, exp date and etc
    if (tokenBodyObj.exp && Date.now() / 1000 > tokenBodyObj.exp){ //what in .exp? How Date.now / by 1000?
        //In exp and Date.now is numbers of millSec after 1970y.
        this.logout();
        return of({user:'', uid: "uid", isAdmin: false}) //return observable. This зрелище type UserData from interface
    }
   // return of({isAdmin: tokenBodyObj.email === 'admin@tel-ran.co.il', user: tokenBodyObj.email });
    return Axios.get<string[]>(this.url + '/administrators')
        .pipe(map(response => {
            const res: UserData = {user: tokenBodyObj.email,
                uid: "uid",
                isAdmin: response.data.indexOf(tokenBodyObj.email) >= 0};

            return res;
        }))
}

export default class AuthServiceRest implements AuthService {
    constructor(private url: string){

    }
    getUserData(): Observable<UserData> { //this all for get UserData (string, and admin boolean)
        const accessToken: string|null = localStorage.getItem(ACCESS_TOKEN);//What is it?
        return accessToken ? toUserData.call(this,accessToken) : of({isAdmin:false, uid:"", user:''});
    } //Here always check if token expired. If this happens - return empty user Observer. And rerender in APP in login Page
    //if accessToken have, than left handle operation run
    //This - is url of server auth
    login(loginData: LoginData): Promise<LoginCodes> {
        return Axios.post(this.url + '/login', loginData)
            .pipe(map(response => response.data))
            .toPromise().then(token => {
                localStorage.setItem(ACCESS_TOKEN, token.accessToken);
                return LoginCodes.OK;
            }).catch((error) => {
                return (error as AxiosError).response ?
                    LoginCodes.WRONG_CREDENTIALS : LoginCodes.NETWORK_ERROR
            });
    }

    logout(): Promise<boolean> {
        localStorage.removeItem(ACCESS_TOKEN)
        return Promise.resolve(true);
    }

}