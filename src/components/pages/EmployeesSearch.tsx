import React, {useEffect, useState} from 'react'

import Topbar from "../library/Topbar";
import {Button, FormControl, InputLabel, MenuItem, TextField, Select} from "@material-ui/core";
import {HeaderDescription, MyTable} from "../library/MyTable";
import {
    SAMPLE_DEPARTMENT,
    ERROR_MESSAGES,
    MIN_MAX_VALUES,
    MIN_SALARY_FIELD,
    MAX_SALARY_FIELD
} from "../../config/consts";
import {makeStyles} from "@material-ui/core/styles";
import {validateNumber, validateSubmit} from "../../util/validation";
import Employee from "../../models/EmployeeType";
import {getHeaders, toEmployeesView} from "./Employees";
import EmployeeView from "../../models/EmployeeView";
import {UserData} from "../../services/AuthService";
import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));



type EnteredValues = {
    department: string,
    minSalary: number,
    maxSalary: number
}

const EmployeesSearch: React.FC = () => {
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const employees: Employee[] = useSelector((state: ReducersType) => state.employees);
    const width: number = useSelector((state: ReducersType) => state.width);
    const headers: Map<string, HeaderDescription> = getHeaders(width, false);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const [rows, setRows] = useState<EmployeeView []>([]);
    const [enteredValues, setValues] = useState<EnteredValues>
    ({department: '', minSalary: NaN, maxSalary: NaN});
    const [isValid, setValid] = useState<boolean>(false);

    const onSubmit = (event: any) => {
        event.preventDefault();
        let employeesObj: Employee[] = employees.filter((value: Employee) => {
            let res: boolean = true;
            if (enteredValues.department && value.department !== enteredValues.department) {
                res = false;
            }
            if (enteredValues.minSalary && value.salary < enteredValues.minSalary) {
                res = false;
            }
            if (enteredValues.maxSalary && value.salary > enteredValues.maxSalary) {
                res = false;
            }


            return res;
        });
        setRows(toEmployeesView(employeesObj));
    }

    function handleChange(event: any) {
        const fieldName: string = event.target.name
        enteredValues[fieldName] = event.target.type === 'number' ? +event.target.value || NaN : event.target.value || '';
        setValues({...enteredValues});
    }

    function validateNumbersRange(fieldName: string): string {
        return validateNumber(fieldName, enteredValues, MIN_MAX_VALUES, ERROR_MESSAGES,MIN_SALARY_FIELD)

    }

    useEffect(() => {
        function validate(): boolean {
            return validateSubmit([MIN_SALARY_FIELD, MAX_SALARY_FIELD],
                MIN_MAX_VALUES, enteredValues);

        }

        setValid(validate());
    }, [enteredValues, rows])



    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <form onSubmit={onSubmit}>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-controlled-open-select-label">Department</InputLabel>
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={enteredValues.department}
                        onChange={handleChange}
                        name={'department'}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {SAMPLE_DEPARTMENT.map(d => <MenuItem value={d} key={d}>{d}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>

            <div>
                <TextField name={MIN_SALARY_FIELD} label={'Set minimal salary'} type={'number'} onChange={handleChange}
                           error={!!validateNumbersRange(MIN_SALARY_FIELD)} helperText={validateNumbersRange('minSalary')}/>
            </div>

            <div>
                <TextField name={MAX_SALARY_FIELD} label={'Set maximal salary'} type={'number'} onChange={handleChange}
                           error={!!validateNumbersRange(MAX_SALARY_FIELD)} helperText={validateNumbersRange('maxSalary')}/>
            </div>

            <div>
                <Button disabled={!isValid} type='submit'>Submit</Button>
                <Button type='reset'>Reset</Button>
            </div>
        </form>
        <MyTable headers={headers} rows={rows} defaultRowsPerPage={5} innerWidth={width < 700? width : undefined}  />
    </React.Fragment>
}
export default EmployeesSearch;
