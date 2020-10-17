import React, {useState} from "react";
import Employee from "../../models/EmployeeType";
import { Redirect } from "react-router-dom";
import {menu, PATH_HOME} from "../../config/Menu";
import EmployeeForm from "../EmployeeForm";
import EmployeeServiceObservable from "../../services/EmployeeServiceObservable";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import ErrorTypes from "../../util/ErrorTypes";
import {service} from "../../config/server-config";
type Props = {
    refreshFn?: () => void,
    backPath?: string
}
const NewEmployee: React.FC<Props> = (props: Props) => {
    debugger
    const employees: Employee[] = useSelector((state: ReducersType) => state.employees);
    const [backFl, setBackFl] = useState<boolean>(false);
    async function onSubmit(empl: Employee):Promise<string> { //run when submit in form and check if already have this empl
        try {
            await service.addEmployee(empl);
            setBackFl(true);
            !!props.refreshFn && props.refreshFn();
            return '';
        }catch (error) {
            return (error as ErrorTypes) ===
            ErrorTypes.SERVER_ERROR ? `Employee with id: ${empl.id} already exists` :
                'Server is not available, please repeat later';
        }
    }
    return <React.Fragment>
        <EmployeeForm employees={employees} onSubmit={onSubmit}/>
        {backFl && <Redirect to={props.backPath || PATH_HOME}/>}
    </React.Fragment>
}
export default NewEmployee;
