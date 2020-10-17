import Employee from "../models/EmployeeType";
import {Observable} from "rxjs";

export default interface EmployeeServiceObservable {
    addEmployee(empl: Employee):Promise<any>;
    removeEmployee(id: number): Promise<any>;
    getAllEmployees(): Observable<Employee[]>;
    updateEmployee(id: number, empl: Employee): Promise<any>;
}
