import React from 'react';
import Employee from "../../models/EmployeeBase";
import Topbar from "../library/Topbar";
import _ from 'lodash';
import {HeaderDescription, MyTable} from "../library/MyTable";
import {UserData} from "../../services/AuthService";
import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";

const DepartmentStatistic: React.FC = () => {
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const employees: Employee[] = useSelector((state: ReducersType) => state.employees);
    const width: number = useSelector((state: ReducersType) => state.width);
    const headers: Map<string, HeaderDescription> = new Map([
        ['department',{displayName: 'Department', numeric: false}],
        ['numOfEmpl', {displayName: 'Number of Employees', numeric: true}],
    ]);

    const stat = _.countBy(employees, 'department');
    const result = Object.keys(stat).map((key) => {
        return {department: key, numOfEmpl: stat[key]}
    });

    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <MyTable defaultRowsPerPage={width > 500 && width < 900 ? 5 : 10}
                 innerWidth={width < 700? width : undefined} headers={headers} rows={result}/>
    </React.Fragment>;
}
export default DepartmentStatistic;
