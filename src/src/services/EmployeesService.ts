import Employee from "../models/EmployeeType";


export default interface EmployeesService {
    addEmployee(empl: Employee):boolean;
    removeEmployee(id: number): boolean;
    getAllEmployees(): Employee[];
    updateEmployee(id: number, empl: Employee): boolean;
}
