import EmployeeBase from "./EmployeeBase";

export default interface Employee extends EmployeeBase {
    birthDate: Date|null
}
