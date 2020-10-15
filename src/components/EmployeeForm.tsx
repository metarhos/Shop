import React, {useCallback, useEffect, useState} from "react";
import Employee from "../models/EmployeeType";
import {Button, Container, FormControl, Grid, InputLabel, Select, TextField, MenuItem} from "@material-ui/core";
import {MAX_AGE, MIN_AGE, SAMPLE_DEPARTMENT} from "../config/consts";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';


type Props = {
    employees?: Employee[];
    employee?: Employee;
    onSubmit: (empl: Employee) => Promise<string>;
    onCancel?: () => void
}

/**
 * Gets empty employee record
 */
function getEmptyEmployee(): Employee {
    return {
        salary: NaN,
        name: '',
        id: NaN,
        department: '',
        birthDate: null
    };
}

const EmployeeForm: React.FC<Props> = (props: Props) => {
    const emptyEmployee = useCallback(getEmptyEmployee, []) //why useCallback? For create a new emptyEmpl when need? Why no just call fn getEmpty
//если просто юзать гетЭмптиЭмплои - то она вызывается каждый раз при рендеренинге.
// А юзКоллБэк делается только тогда, когда происходит какое-то изменение (первый раз и при перемене конкретного значения в depth)
    const [employee, setEmployee] = useState<Employee>(props.employee ? props.employee :
        emptyEmployee);
    const validateId = () => { //interesting exception method
        if(props.employee) {
            return 1;
        }
        if (isNaN(employee.id)) return 0;
        if (employee.id <= 0) return -1;
        if (props.employees?.find((e) => e.id === employee.id))
            return -2;

        return 1;
    }
    const validateName = () => {
        return (employee.name === '') || (new RegExp('^[A-Za-z ]+$').test(employee.name));
    }
    const validateNameHook = useCallback(validateName, [employee]); //what does it mean? validateHook?

    const validateIdHook = useCallback(validateId, [employee]);
    const [isValid, setValid] = useState<boolean>(false);

    async function onSubmit(event: any) {
        event.preventDefault();
        const errorMessage = await props.onSubmit(employee); //check if have this empl, check only by id
        if (errorMessage) {
            alert(errorMessage);

        }

    }

    function onReset() {
        setEmployee(emptyEmployee());
    }

    /**
     * converts field value to corresponding strict type
     * @param field
     */
    function getFieldValue(field: any): any {

        return field.type === 'number' ? +field.value : field.value;
    }

    /**
     * Field input handler. Gets field value and puts to corresponding employee field
     * @param event
     */
    const handleInput = (event: any) => { //rerender input value in form
        const name: string = event.target.name;
        employee[name] = getFieldValue(event.target);
        setEmployee({...employee});
        //Спред оператор - он разделяет все элементы объекта или массива на отдельные элементы и можно их брать и всавлять куда там надо
    }


    //region Field validators
    const validateSalary = () => {
        return isNaN(employee.salary) || employee.salary >= 0;
    }


    //region Field error messages
    function getErrorTextSalary() {
        return !validateSalary() ? 'salary can\'t be less than 0' : '';
    }

    function getErrorTextId() {
        const validCode = validateId();
        switch (validCode) {
            case -1:
                return 'ID can\'t be less or equal than 0';
            case -2:
                return 'Employee with such ID already exists';
            default:
                return '';
        }
    }

    function getErrorTextName() {
        return !validateName() ? 'Name can contain only english letters and spaces' : '';
    }


    //endregion

    /**
     *  Validates fields for enabling/disabling Submit button
     */
    useEffect(() => {
        const validate = (): boolean => {
            return employee.salary >= 0
                && employee.department !== '' //&& validateDepartment()
                && employee.name !== '' && validateNameHook()
                && employee.birthDate !== null
                && validateIdHook() > 0;
        }

        setValid(validate());
    }, [employee, validateNameHook, validateIdHook]);

    /**
     * Handler for DatePicker (birth date)
     * @param date
     */
    function handleDateChange(date: Date | null) {

        employee.birthDate = date;
        setEmployee({...employee});
    }

    return <React.Fragment>
        <Container maxWidth="xs">
            <form onSubmit={onSubmit} onReset={onReset}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth label={'ID'} name={'id'} type={'number'}
                                   onInput={handleInput}
                                   error={validateId() < 0} helperText={getErrorTextId()}
                                   value={isNaN(employee.id) ? '' : employee.id}
                                   disabled={!!props.employee}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={'Name'} name={'name'} type={'text'}
                                   onInput={handleInput}
                                   error={!validateName()} helperText={getErrorTextName()}
                                   value={employee.name}/>
                    </Grid>
                    <Grid item xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disabled={!!props.employee}
                                fullWidth
                                // margin="normal"
                                id="date-picker-dialog"
                                label="Birth date"
                                format="dd/MM/yyyy"
                                value={employee.birthDate as Date}
                                onChange={handleDateChange}
                                minDate={new Date(new Date().getFullYear() - MAX_AGE, 1, 1)}
                                maxDate={new Date(new Date().getFullYear() - MIN_AGE, 1, 1)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Department</InputLabel>
                            <Select name={"department"}
                                    value={employee.department}
                                    onChange={handleInput}
                            >
                                {SAMPLE_DEPARTMENT.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={'Salary'} name={'salary'} type={'number'}
                                   onInput={handleInput}
                                   error={!validateSalary()} helperText={getErrorTextSalary()}
                                   value={isNaN(employee.salary) ? '' : employee.salary}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth disabled={!isValid} variant="contained" color="primary"
                                type={'submit'}>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        {props.employee ?
                            <Button fullWidth variant={"contained"} color={"primary"} type={"button"}
                                    onClick={props.onCancel}>Cancel</Button>
                            :
                            <Button fullWidth variant="contained" color="primary"
                                    type={'reset'}>Reset</Button>

                        }
                    </Grid>
                </Grid>

            </form>
        </Container>

    </React.Fragment>
}
export default EmployeeForm;
