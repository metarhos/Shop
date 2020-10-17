import {HeaderDescription} from "../components/library/MyTable";
import DeleteIcon from '@material-ui/icons/Delete';
export const headersAll: Map<string, HeaderDescription> = new Map([
    ['barcode',{displayName: 'Barcode', numeric: false}],
    ['name', {displayName: 'Name', numeric: false}],
    ['description', {displayName: 'Description', numeric: true}],
    ['quantity', {displayName: 'Quantity', numeric: false}],
    ['price', {displayName: 'Price', numeric: false}],

]);

const headersXs: Map<string, HeaderDescription> = new Map([
    ['name', {displayName: 'Name', numeric: false}],
    ['quantity', {displayName: 'Quantity', numeric: false}],
    ['price', {displayName: 'Price', numeric: false}],

]);

const headersMd: Map<string, HeaderDescription> = new Map([
    ['id',{displayName: 'ID', numeric: false}],
    ['name', {displayName: 'Name', numeric: false}],
    ['quantity', {displayName: 'Quantity', numeric: false}],
    ['price', {displayName: 'Price', numeric: false}]
]);
export const headersWidth: Array<[number, Map<string, HeaderDescription>]> = [
    [1200, headersAll],
    [500, headersMd],
    [0,headersXs]
];

