import React, {useState} from 'react'
import {Redirect} from 'react-router-dom';
import {
    MAX_AGE,
    MIN_AGE,
    SAMPLE_DEPARTMENT,
    MAX_SALARY,
    MIN_SALARY,
    SAMPLE_EDUCATION,
    SAMPLE_NAMES
} from "../../config/consts";
import {TextField} from "@material-ui/core";

import {service} from "../../config/server-config";
const DEF_VALUE = 5;
type Props = {

    refreshFn?: () => void
}

const EmployeesGeneration: React.FC<Props> = (props: Props) => {
    const [backFl, setBackFl] = useState(false);
    const [emplNumber, setEmplNumber] = useState<number>(DEF_VALUE)

    async function generation() {
        const minDate = new Date(new Date().getFullYear() - MAX_AGE, 1, 1)
        const maxDate = new Date(new Date().getFullYear() - MIN_AGE, 1, 1)
        for (let i = 0; i < emplNumber; i++) {
            try {
                await service.addEmployee({
                    id: Math.round(Math.random() * 100000)
                    , birthDate: new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()))
                    , name: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)]
                    , salary: Math.round(Math.random() * (MAX_SALARY - MIN_SALARY) + MIN_SALARY)
                    , department: SAMPLE_DEPARTMENT[Math.floor(Math.random() * SAMPLE_DEPARTMENT.length)]
                    , education: SAMPLE_EDUCATION[Math.floor(Math.random() * SAMPLE_EDUCATION.length)]
                })
            }catch (error){

            }
        }
    }


    const validateInput = () => {
        return new RegExp('^[0-9]+$').test(emplNumber.toString());
    }

    function getErrorTextInput() {
        return !validateInput() ? 'Number of employees should be integer above 0' : '';
    }

    const handleInput = (event: any) => {
        const emplNumber: number = event.target.value;
        setEmplNumber(emplNumber);
    }



    return <React.Fragment>
        <br/><br/>
        <form style={{'width': "30%"}}>
            <TextField fullWidth label={'Number of employees'} type={'number'} defaultValue={DEF_VALUE}
                       onInput={handleInput}
                       error={!validateInput()} helperText={getErrorTextInput()}
            />
        </form>
        <br/>
        <button disabled={!validateInput()} onClick={async () => {
            await generation();
            !!props.refreshFn && props.refreshFn(); //this rerender for allEmployees in table
            setBackFl(true);
            // сетБэкФлаг ререндерит саму компоненту где он есть. Поэтому отдельно рендер пропса.рефреш
            // Рефреш нужен чтобы сгенерированные данные вошли в данные других компонент.
            // Емплои должны получить новые эмплои, мы должны вызвать чтобы внутри компоненты Эмплои появились новые сгенерированные эмплои.
            // Мы должны сказать, что эмплоис измененились. А дальше уже сам рефреш в АПП производит сетЭмплои, тоесть меняет эмплоев.
        }
        }>Done
        </button>

        <button onClick={() => {

            setBackFl(true);
        }
        }>Cancel
        </button>
        {backFl && <Redirect to={'/'}/>}
    </React.Fragment>
}
export default EmployeesGeneration;
