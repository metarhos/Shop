import {HeaderDescription} from "../components/library/MyTable";

export const headersAll: Map<string, HeaderDescription> = new Map([
     ['id',{displayName: 'ID', numeric: false}],
    ['name', {displayName: 'Name', numeric: false}],
     ['salary', {displayName: 'Salary', numeric: true}],
       ['department', {displayName: 'Department', numeric: false}],
      ['birthDate', {displayName: 'Birth Date', numeric: true}],
]);
const headersXsAdmin: Map<string, HeaderDescription> = new Map([
    ['name', {displayName: 'Name', numeric: false}],

]);
const headersXs: Map<string, HeaderDescription> = new Map([
    ['name', {displayName: 'Name', numeric: false}],
    ['department', {displayName: 'Department', numeric: false}],

]);
const headersMdAdmin: Map<string, HeaderDescription> = new Map([

    ['name', {displayName: 'Name', numeric: false}],
    ['birthDate', {displayName: 'Birth Date', numeric: true}],
]);
const headersMd: Map<string, HeaderDescription> = new Map([
    ['id',{displayName: 'ID', numeric: false}],
    ['name', {displayName: 'Name', numeric: false}],
    ['salary', {displayName: 'Salary', numeric: true}],
    ['department', {displayName: 'Department', numeric: false}],
]);
export const headersWidth: Array<[number, Map<string, HeaderDescription>]> = [
    [1000, headersAll],
    [500, headersMd],
    [0,headersXs]
];
export const headersWidthAdmin: Array<[number, Map<string, HeaderDescription>]> = [
    [1200, headersAll],
    [500, headersMdAdmin],
    [0,headersXsAdmin]
]
