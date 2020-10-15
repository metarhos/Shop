//EmployeesServiceRest там токены кладем

import {Axios} from "axios-observable";
import {map, catchError} from 'rxjs/operators'; //what difference between map rxjs and standart
//это мэп для перебора обсервабла.
import EmployeeServiceObservable from "./EmployeeServiceObservable";
import Employee from "../models/EmployeeType";
import {Observable, of, throwError} from "rxjs";
import {ACCESS_TOKEN} from "./AuthServiceRest";
import {AxiosError} from "axios";
import ErrorTypes from "../util/ErrorTypes";

function errorHandle(error: AxiosError): ErrorTypes {
    if (error.response) {
        return error.response.status === 401 || error.response.status === 403 ?
            ErrorTypes.AUTH_ERROR : ErrorTypes.SERVER_ERROR
    }
    return ErrorTypes.NETWORK_ERROR;
}


export default class EmployeesServiceRest implements EmployeeServiceObservable {
    constructor(private url: string){};
    addEmployee(empl: Employee): Promise<any> {
        return Axios.post<Employee>(this.url, empl, {
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).pipe(catchError(error=>{

            return throwError(errorHandle(error))
        })).toPromise() //промис проще чем обсервабл, так что если нет сабскрайба, то юзают промис
    }

    getAllEmployees(): Observable<Employee[]> {
        const res = Axios.get<Employee[]>(this.url,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).pipe(map(response => {
            const res = response.data;
            res.forEach(empl => empl.birthDate = new Date(empl.birthDate as Date))
            return res;
        }), catchError(error=>{

            return throwError(errorHandle(error))
        }) ); //у обсервабл нет мэп без пайп.
        // В первых версия можно просто мэп без пайп. Сам пайп - это стрим, через зпт включаем методы последовательно

        //гетОллЭмплои вернет обсервабл, внутри которого Аксиос вернет респонс, однако, и-за специального мэп для обсерваблов,
        //мы вместо респонса возвращаем уже конкретный объект, тоесть массив эмплоев.
        //Таким образом будет обсервабл, а внутри требуемый результат (массив эмплоев)
        // У этого типа (обсеррвабл) есть метод сабскрайб, когда мы подписываемся на обсервер
        // подписчики подписываются на получение данных с сервера. Обсервабл - это возможность подписки
        // Можно подписатьс на событие, например нажатие кнопки. Те кто подписались на обсервабл, получают управление, когда произошло это событие
        // Сабскрипшн на любые события.

        return res
    }


    removeEmployee(id: number): Promise<any> {

        return Axios.delete(`${this.url}/${id}`,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).pipe(catchError(error=>{

            return throwError(errorHandle(error))
        })).toPromise();
    }

    updateEmployee(id: number, empl: Employee): Promise<any> {
        return Axios.put(`${this.url}/${id}`, empl,{
            headers: {"Authorization":'Bearer ' + localStorage.getItem(ACCESS_TOKEN)}
        }).pipe(catchError(error=>{

            return throwError(errorHandle(error))
        })).toPromise();
    }

}