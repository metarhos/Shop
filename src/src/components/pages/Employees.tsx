import React, {useRef, useState} from 'react'

import Topbar from "../library/Topbar";
import {HeaderDescription, MyTable} from "../library/MyTable";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmationDialog from "../library/ConfirmDialog";
import {Backdrop, Fade, Modal, Theme} from "@material-ui/core";
import EmployeeForm from "../EmployeeForm";
import {makeStyles} from "@material-ui/core/styles";
import EmployeeView from "../../models/EmployeeView";
import Employee from "../../models/EmployeeType";

import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import {UserData} from "../../services/AuthService";
import ErrorTypes from "../../util/ErrorTypes";
import {headersAll, headersWidth, headersWidthAdmin} from "../../config/employees-table-config";
import {service} from "../../config/server-config";
type Props = {

    refreshFn?: () => void;

}
function toEmployeeFromEmployeeView(employee: EmployeeView): Employee {
    return {birthDate: new Date(employee.birthDate),
        department: employee.department,
        education: employee.education, id: employee.id,
        name: employee.name, salary: employee.salary};
}
export function toEmployeeViewFromEmployee(employee: Employee): EmployeeView{
    return {birthDate: (employee.birthDate as Date).toLocaleDateString(), //was toLocaleDateString()
        department: employee.department,
        education: employee.education, id: employee.id,
        name: employee.name, salary: employee.salary};
}
export function toEmployeesView(employees: Employee[]): EmployeeView[] {
    return employees.map(toEmployeeViewFromEmployee);
}

const useStyles = makeStyles((theme: Theme) =>
//можно маргинТоп: тема.спэйсинг(20пх) тогда например заложит для всей темы. Ихменение глобальных компонентов
// Тему можно поменять. В апп положить тема: Тема = креатеМуиТема и т.д.
    ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },

    }));

export function getHeaders(width: number, isAdmin: boolean): Map<string, HeaderDescription> {
    const headersWidthArray = isAdmin ? headersWidthAdmin : headersWidth;
    const index = headersWidthArray.findIndex(hw => width > hw[0] );
    return headersWidthArray[index][1];
}


export const Employees: React.FC<Props> = (props: Props) => {
    const classes = useStyles()
    const width: number = useSelector((state: ReducersType) => state.width);
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const employees: Employee[] = useSelector((state: ReducersType) => state.employees);

    const [open, setOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<{open:boolean,
        employee:Employee|undefined}>({open:false,
        employee: undefined});
    const idRef = useRef<number>(0);
    const headers: Map<string, HeaderDescription> = getHeaders(width, userData.isAdmin);

    function removeEmployee(emplObj: object) {
        idRef.current = (emplObj as Employee).id //this casting because this is actionFn(obj: Object)
        //Таблица принимает обжект, так что надо конвертировать так как мы юзаем эмплоя.
        //Тоесть любой объект надо конвертировать в зависимости от родителя. Таблица же универсальная и принимает тока обжект.
        //get id in MyTable in getActionButtons
        setOpen(true)

    }

    async function onClose(res: boolean) { //res get from click in alertDialog
        setOpen(false);
        if (res) {
            try {
                await service.removeEmployee(idRef.current);
                !!props.refreshFn && props.refreshFn()
            } catch(error) {
                const errorEnum: ErrorTypes = error as ErrorTypes;
                const alertMessage = errorEnum === ErrorTypes.SERVER_ERROR ?
                    `Employee with id ${idRef.current} doesn't exist` :
                    ( errorEnum === ErrorTypes.NETWORK_ERROR ?
                        'Server is not available, please repeat later' : 'Auth Error');
                alert(alertMessage);
            }
            //!! конвретирует наличие метода в булеан, тоесть тру или фолс. !! значит тру. Если существует, то делай
        }
    }
    function handleModalClose() {
        modal.open = false;
        setModal({...modal});
    }
    function editEmployee(obj: object) {
        const employeeView = obj as EmployeeView; //why write that? This don't create an object?

        setModal({open:true, employee: toEmployeeFromEmployeeView(employeeView)}); //open EmployeeForm
    }
    async function updateEmployee(employee: Employee): Promise<string> {
        try {
            await service.updateEmployee(employee.id,
                employee);
            !!props.refreshFn && props.refreshFn();
            handleModalClose();
            return '';
        } catch (error) {
            return (error as ErrorTypes) ===
            ErrorTypes.SERVER_ERROR ? `Employee with id: ${employee.id} doesn't exist` :
                'Server is not available, please repeat later';
        }
    }

    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <MyTable defaultRowsPerPage={width > 500 && width < 900 ? 5 : 10}
                 innerWidth={width < 700? width : undefined} isDetails={headers !== headersAll}
                 headers={headers} rows={toEmployeesView(employees)}
                 actions={!userData.isAdmin? [] : [{icon: <DeleteIcon/>, actionFn: removeEmployee},
                     {icon: <EditIcon/>, actionFn: editEmployee}]}/>
        <ConfirmationDialog title={'You are going remove'} open={open}
                            content={`employee with id ${idRef.current}`} onClose={onClose}/>
        <Modal
            className={classes.modal}
            open={modal.open}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={modal.open}>
                <div className={classes.paper}>
                    <EmployeeForm onSubmit={updateEmployee} employee={modal.employee}
                                  onCancel={handleModalClose}/>
                </div>

            </Fade>
        </Modal>
    </React.Fragment>
}
export default Employees;