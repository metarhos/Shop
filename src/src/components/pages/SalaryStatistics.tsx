import React, {useState, useRef, useEffect} from 'react';
import Employee from "../../models/EmployeeBase";
import Topbar from "../library/Topbar";
import Grid from "@material-ui/core/Grid";
import {Button, Container, TextField} from "@material-ui/core";
import _ from 'lodash';
import {MyTable, HeaderDescription} from "../library/MyTable";
import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {UserData} from "../../services/AuthService";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";


const SalaryStatistic: React.FC = () => {
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const employees: Employee[] = useSelector((state: ReducersType) => state.employees);
    const width: number = useSelector((state: ReducersType) => state.width);
    const [intervalCurrent, setIntervalCurrent] = useState<number>(1000);
    const [interval, setInterval] = useState<number>(1000);

    const headers: Map<string, HeaderDescription> = new Map([
        ['min',{displayName: 'Min salary', numeric: true}],
        ['max', {displayName: 'Max salary', numeric: true}],
        ['amount', {displayName: 'Amount', numeric: true}],
    ]);

    function groupBySalary(arr:Employee[], interval: number): {min: number, max: number, amount: number}[] {
        let res = _.chain(arr).map(o => (Math.floor(o.salary / interval))).countBy().entries()
            .map(o => {
                return {
                    min: +o[0] * interval,
                    max: +o[0] * interval + interval - 1,
                    amount: o[1]
                }
            })
            .value();
        return res;
    }

    function onChange(event: any) {
        setIntervalCurrent(+event.target.value);
    }

    function onSubmit(event: any){
        setInterval(intervalCurrent);
    }

    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <Container maxWidth="xs">
            <form onSubmit={onSubmit} >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth value={intervalCurrent} onChange={onChange}
                                   label="Interval of salary" type="number"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant={"contained"} color={"primary"} type="submit">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
        <MyTable defaultRowsPerPage={width > 500 && width < 900 ? 5 : 10}
                 innerWidth={width < 700? width : undefined} headers={headers} rows={groupBySalary(employees, interval)}/>
    </React.Fragment>
}

export default SalaryStatistic;
