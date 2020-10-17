import EmployeesService from "./EmployeesService";
import Employee from "../models/EmployeeType";

export default class EmployeesServiceMapImpl implements EmployeesService {
    private employees: Map<number, Employee>
    constructor() {
        this.employees = new Map<number, Employee>();
    }
    addEmployee(empl: Employee): boolean {
        if (this.employees.get(empl.id)) {
            return false;
        }
        this.employees.set(empl.id, empl);
        return true;

    }

    getAllEmployees(): Employee[] {
        const res: Employee[] = [];
        this.employees.forEach((empl) => {
            res.push(empl)
        })
        return res;
    }

    removeEmployee(id: number): boolean {
        if(this.employees.get(id)) {
            this.employees.delete(id);
            return true;
        }
        return false;
    }

    updateEmployee(id: number, empl: Employee): boolean {
        if(this.employees.get(id)) {
            this.employees.set(id, empl);
            return true
        }
        return false;
    }

}