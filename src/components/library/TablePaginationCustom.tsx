import React from "react";
import {TablePagination, TableRow, Theme} from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import {PaginationItem} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
type Props = {
    defaultRowsPerPage: number,
    rows: object[],
    rowsPerPage: number,
    page: number,
    handleChangePage: any,
    handleChangeRowsPerPage: any,
    width: number
}
const useStyles = makeStyles((theme: Theme) =>({
    pagination: {

        marginLeft: '1200px'
    }
}))

export const TablePaginationCustom: React.FC<Props> = (props) => {
    const classes = useStyles();
   if(props.width > 500){
       return <React.Fragment>
           <div style={{paddingLeft:props.width*0.87-395}}>
           <TablePagination className={classes.pagination}
               rowsPerPageOptions={[props.defaultRowsPerPage, props.defaultRowsPerPage * 2, props.defaultRowsPerPage * 3, {
                   label: 'All',
                   value: -1
               }]}

               count={props.rows.length}
               rowsPerPage={props.rowsPerPage}
               page={props.page}
               onChangePage={props.handleChangePage}
               onChangeRowsPerPage={props.handleChangeRowsPerPage}

           />
           </div>
       </React.Fragment>
   }

    return <React.Fragment>
        <div >
       <Pagination count={props.rows.length} showFirstButton showLastButton/>
        </div>
   </React.Fragment>


}