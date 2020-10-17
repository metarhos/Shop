import React, {FC, useEffect} from 'react';
import styled from 'styled-components';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableFooter,
    TablePagination, IconButton, Paper, Theme

} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import PopUpTable from "./PopUpTable";

export type HeaderDescription = {
    displayName: string,
    numeric: boolean,
    width?: string
}
type Props = {
    headers: Map<string, HeaderDescription>
    rows: object[],
    innerWidth?: number,
    defaultRowsPerPage?: number;
    isDetails?: boolean;
    actions?: {icon: JSX.Element, actionFn: (obj: object) => any}[] //need to write that [] in end, or it will be no array, but will be tupple

}

const StyledTablePagination = styled(TablePagination)`
.MuiTablePagination-actions {
margin: 0;
}
.MuiTablePagination-selectRoot {
margin-right: 2px;,
margin-left: 0
}
.MuiIconButton-root {
padding: 0;
}
` as typeof TablePagination;
//styled can change basic style

const useStyles = makeStyles((theme: Theme) =>({
    table: (props: any) => ({
        width: props.width
    }),

    container: (props: any) => ({
        [theme.breakpoints.down('sm')]: {width: "80%"},
        [theme.breakpoints.up('sm')]: {width: "90%"},
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {marginLeft: theme.spacing(1)},
        [theme.breakpoints.up('md')]: {marginLeft: theme.spacing(8)},
    }),

    header: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        fontStyle: 'italic'
    },


}));

function getPopUpData(row: object): string[] {
    return Object.entries(row).map(e => `${e[0]}: ${e[1]}`);
}

export const MyTable: FC<Props> = (props: Props) => {

    const defaultRowsPerPage = props.defaultRowsPerPage || 5;
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
    const [page, setPage] = React.useState(0);
    const propsCSS = {width: props.innerWidth && (props.innerWidth < 500 ? 200 :
            530)}
    const classes = useStyles(propsCSS);
    if (rowsPerPage > 0 && props.rows.length / rowsPerPage < page) {
        setPage(0);
    }

    useEffect(()=>{
        setRowsPerPage(defaultRowsPerPage);
    }, [defaultRowsPerPage])

    function getHeaders(): JSX.Element[] {
        //get all headers tabs from props from comp Employees. But additional menu (PopUpMenu) set in getDataCells fn
        const cells: any[] = [];

        props.headers.forEach((value, key) => {
            cells.push(<TableCell className={classes.header}
                                  align={value.numeric ? 'right' : 'left'}
                                  key={key}>{value.displayName}</TableCell>)
        })
        if (props.actions) {
            if( props.actions.find((elem) => elem.actionFn.name === 'clearBasket')) {
                let i = props.actions!.findIndex((elem) => elem.actionFn.name === 'clearBasket')

                cells.push(<TableCell key={'clearBasket'}>
                    <IconButton size={"medium"} onClick={() => {
                        props.actions![i].actionFn({null:'null'})
                    }}>
                        {props.actions![i].icon}
                    </IconButton>
                </TableCell>)


            }

            for (let i = 0; i < props.actions.length; i++) {
                cells.push(<TableCell key={i}/>)
            }
        }
        if (props.isDetails) {
            cells.push(<TableCell key={props.actions ? props.actions.length : 1}/>)
        }

        return cells;
    }


    function getRows(): JSX.Element[] {
        const keys: string[] = [];


        props.headers.forEach((value, key) => {
            keys.push(key);
        })
        const rowsRes = rowsPerPage > 0 ?
            props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [...props.rows];
        return rowsRes.map((row, index) => getRow(row, index, keys));
        //index in map() is optional and get index of element in array
    }

    function getRow(row: object, index: number, keys: string[]): JSX.Element {
        return <TableRow key={index}>
            {getDataCells(row, keys)}
        </TableRow>
    }




    function getActionButtons(row: object): JSX.Element[] {
        let res: JSX.Element[] = [];


        if (props.actions) {

            let actionsRow = props.actions.slice()

            if(actionsRow.find((elem) => elem.actionFn.name === 'clearBasket')){
                let i = props.actions!.findIndex((elem) => elem.actionFn.name === 'clearBasket')
            actionsRow.splice(i,1)
            }

            res = actionsRow.map((a, index) => <TableCell key={index} padding="checkbox">
                <IconButton size={"small"} onClick={() => {
                    a.actionFn(row)
                }
                }>
                    {a.icon}
                </IconButton>
            </TableCell>)
        }

        return res;
    }


    function getDataCells(row: object, keys: string[]): JSX.Element[] {
        const res = keys.map(k => <TableCell key={k} align={props.headers.get(k)?.numeric ? 'right' : 'left'}
                                              style={!!props.headers.get(k)?.width ? {'width': props.headers.get(k)?.width} : undefined}>
            {row[k]}</TableCell>)

        //in all row, for all cells for all headers entered specific value from row:object. And for all row in table add removeButton if he have
        props.isDetails && res.push(<TableCell key={row[keys[0]]} padding="checkbox">
            <PopUpTable data={getPopUpData(row)}/>
        </TableCell>)



        return props.actions ? res.concat(getActionButtons(row)) : res;
        //here finally compile headers
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        //when and by what change newPage -- by click. number of page is a Pagination functional, itself change self
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(+event.target.value);

    };


    return <TableContainer component={Paper} elevation={3} className={classes.container}>
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    {getHeaders()}
                </TableRow>
            </TableHead>
            <TableBody>
                {getRows()}
            </TableBody>
            <TableFooter>
                <TableRow>
                    {props.innerWidth && props.innerWidth < 500 ? <StyledTablePagination
                        labelRowsPerPage={'Rows'}
                        rowsPerPageOptions={[5, 10, 15, {
                            label: 'All',
                            value: -1
                        }]}
                        count={props.rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}


                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}

                    /> : <TablePagination
                        rowsPerPageOptions={[5, 10, 15, {
                            label: 'All',
                            value: -1
                        }]}
                        count={props.rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}


                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}/>}
                </TableRow>
            </TableFooter>
        </Table>
    </TableContainer>
}
