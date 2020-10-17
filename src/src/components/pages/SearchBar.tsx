import React, {useEffect, useState} from 'react'


import {Button, FormControl, InputLabel, MenuItem, TextField, Select, IconButton} from "@material-ui/core";

import {makeStyles} from "@material-ui/core/styles";

import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import CardItem from "../../models/CardItem";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    div: {
        "padding-bottom": "20px",
        "margin-left": "20px"
    }
}));

type Props = {
    // funcSearch?: () => any;
    funcSearch?:  any;
}

type EnteredValues = {
    Search: string
}

const Search = (props: Props) => {
    const cards: CardItem[] = useSelector((state: ReducersType) => state.cardItems);

    const classes = useStyles();


    const [enteredValues, setValues] = useState<EnteredValues>
    ({Search: ''});


    const onSubmit = (event: any) => {
        event.preventDefault();
        let cardObj: CardItem[] = cards.filter((value: CardItem) => {
            let res: boolean = true;
            res = value.name.includes(enteredValues.Search)
            return res;
        });
        props.funcSearch(cardObj)
    }

    function handleChange(event: any) {
        const fieldName: string = event.target.name
        enteredValues[fieldName] = event.target.type === 'number' ? +event.target.value || NaN : event.target.value || '';
        setValues({...enteredValues});
    }




    return <React.Fragment>

        <form onSubmit={onSubmit}>
            <div className={classes.div}>
                <TextField name={'Search'} label={'Search'} type={'string'} onChange={handleChange} />

                <IconButton color="primary" type='submit'> <SearchIcon /></IconButton>

            </div>
        </form>

    </React.Fragment>
}
export default Search;
