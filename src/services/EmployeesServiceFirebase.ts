import firebase from "firebase";
import appFirebase from "../config/firebase-sdk";
import EmployeeServiceObservable from "./EmployeeServiceObservable";
import {collectionData} from "rxfire/firestore";
import Employee from "../models/EmployeeType";
import {Observable} from "rxjs";
import ErrorTypes from "../util/ErrorTypes";
import EmployeeView from "../models/EmployeeView";
import {toEmployeeViewFromEmployee} from "../components/pages/Employees";
import {map} from "rxjs/operators";

function toEmployeeFire(empl: Employee): EmployeeView {
    return {...empl, birthDate: (empl.birthDate as Date).toISOString().substr(0, 10) };
}

export default class EmployeesServiceFirebase implements EmployeeServiceObservable {
    db: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
    constructor(collection: string) {
        this.db = appFirebase.firestore().collection(collection);
    }
    exists(id: number) : Promise<boolean> {
        return this.db.doc(id.toString()).get().then(doc => doc.exists);
    }
    async addEmployee(empl: Employee): Promise<any> {
        if (await this.exists(empl.id)) {
            throw ErrorTypes.SERVER_ERROR
        }
        const emplFire: EmployeeView = toEmployeeFire(empl);
        return this.db.doc(empl.id.toString()).set(emplFire)

    }

    getAllEmployees(): Observable<Employee[]> {
        let a =
         collectionData<Employee>(this.db)
            .pipe(map((employees) => {
                 employees.forEach((empl) => empl.birthDate = new Date(empl.birthDate as Date));

                 return employees;
            }));


        return a;
    }

    async removeEmployee(id: number): Promise<any> {
        if (await this.exists(id)) {
            return this.db.doc(id.toString()).delete();
        }
        throw ErrorTypes.SERVER_ERROR;
    }

    async updateEmployee(id: number, empl: Employee): Promise<any> {
        if (await this.exists(id)) {
            const emplFire: EmployeeView = toEmployeeFire(empl);
            return this.db.doc(empl.id.toString()).set(emplFire)
        }
        throw ErrorTypes.SERVER_ERROR;
    }

}
