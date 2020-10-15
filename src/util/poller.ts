//this universal poller for server if don't use subscribtion, and if server support description - don't make polling
//getDate start in mount
//Нужен для того, чтобы мониторить изменение како-го то объекта
//if you need fix html debugger (no rerender) - comment this getData();
import React, {useEffect, useState} from 'react'
//this custom hook. All custom hook if Function who start from word use____ and using inside standart hook
import {Observable, Subscription} from "rxjs";
import {useDispatch} from "react-redux";
import ErrorTypes from "./ErrorTypes";

export default function usePollerRedux<T>(service: any, dataFn: (param: any)=>Observable<T>, param: any,
                                          action: (data: T) => {type: string, payload: any},
                                          errorHandler: (error: ErrorTypes)=>void,
                                          pollingInterval?: number){
    const dispatch = useDispatch();
    useEffect(()=>{
        let intervalId: any;
        let subscription: Subscription;
        function poller() { //Это как раз часть на тот случай, если нет сервера с автоподпиской. Тоесть обновляет данные вучную по интервалу. ПРоверка в ИФ есть полписка или нет
            if(!subscription || subscription.closed){ //what different between closed and unsubscribe
                //клоз это булеан, а ансабскрайб отменяет подписку (функция) и ставит клозед в тру
                getData();
                //if you need fix html debugger (no rerender) - comment this getData();
            }
        }
        intervalId = setInterval(poller, pollingInterval || 1000) //no subscribtion in server
        function getData(){
            subscription = dataFn.call(service, param) //and if server have subscription - autorerender with subscribe
                .subscribe(data => dispatch(action(data)),  (error) => errorHandler(error)); //что конкретно посылаем в стор?

            //what in dataFn and what in service. What in subscription before subscribe in 23str
            //!!!in service interface EmployeeServiceObservable with method add, update, remove, getAll
            //возвращает обсервабл с сервисом, а точнее датаФН - это метод гетОллэмплои который вызывается у сервис(интерфейс). И для каждого дата делается сет и подписывается.
        }
        getData();




        return () => {
            if (subscription && !subscription.closed) {
                subscription.unsubscribe();
                //ретурн принято делать на случай типа конект отвалился, браузер закрыл...
                // написав тут консоль.лог мы сюда не попадем, не увидим этого. Но принято так писать на случай отключений.
                //Когда компонента размонтируется. Тогда этот ретурн.
                // Так как нет надобности в поллере пока мы не пользуемся этой компонентой.
            }
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [dataFn, pollingInterval, service, dispatch, action, errorHandler, param]) //Пустой массив в депс, знчмит только один раз при монтировании!!!

}