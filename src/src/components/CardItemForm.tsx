import React, {useCallback, useEffect, useState} from "react";
import {Button, Container, FormControl, Grid, InputLabel, Select, TextField, MenuItem} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';
import CardItem from "../models/CardItem";
import Checkbox from "@material-ui/core/Checkbox";
import {storage} from "../config/firebase-sdk";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fade from "@material-ui/core/Fade";
import {SAMPLE_DEPARTMENT, SAMPLE_PRODUCT_TYPE} from "../config/consts";
import {makeStyles} from "@material-ui/core/styles";
//import UploadImg from "./pages/UploadImg";

type Props = {
    cardItems?: CardItem[];
    cardItem?: CardItem;
    onSubmit: (card: CardItem) => Promise<string>;
    onCancel?: () => void
}

type EnteredValues = {
    product_type: string;
}

/**
 * Gets empty CardView record
 */
function getEmptyCardItem(): CardItem {
    return {
        id: NaN,
        img: '',
        name: '',
        description: '',
        rating: NaN,
        price: NaN,
        priceNew: NaN,
        sale: false,
        product_type: ''
    };
}
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));
const CardItemForm: React.FC<Props> = (props: Props) => {
    const [enteredValues, setValues] = useState<EnteredValues>({product_type:''});
    const emptyCardItem = useCallback(getEmptyCardItem, []) //why useCallback? For create a new emptyEmpl when need? Why no just call fn getEmpty
//если просто юзать гетЭмптиЭмплои - то она вызывается каждый раз при рендеренинге.
// А юзКоллБэк делается только тогда, когда происходит какое-то изменение (первый раз и при перемене конкретного значения в depth)
    const [cardItem, setCardItem] = useState<CardItem>(props.cardItem ? props.cardItem :
        emptyCardItem);
    const classes = useStyles();
    const validateId = () => { //interesting exception method
        if (props.cardItem) {
            return 1;
        }
        if (isNaN(cardItem.id)) return 0;
        if (cardItem.id <= 0) return -1;
        if (props.cardItems?.find((e) => e.id === cardItem.id))
            return -2;
        return 1;
    }
    const validateName = () => {
        return (cardItem.name === '') || (new RegExp('^[A-Za-z ]+$').test(cardItem.name));
    }
    const validateNameHook = useCallback(validateName, [cardItem]); //what does it mean? validateHook?

    const validateIdHook = useCallback(validateId, [cardItem]);
    const [isValid, setValid] = useState<boolean>(false);

    async function onSubmit(event: any) {
        event.preventDefault();
        // const errorMessage = await props.onSubmit(cardItem); //check if have this empl, check only by id

        if(image != null){
          return  storage
                .ref(`images/${image!['name']}`)
                .put(image!)
                .then(res => {
                        debugger
                        storage
                            .ref(`images/${image!['name']}`)
                            .getDownloadURL()
                            .then(url => {

                                setImgValue(url)
//                            alert(url);
                                props.onSubmit(cardItem).then(res => {
                                    alert(res)
                                }).catch(error => {
                                    console.log('er', error)
                                })
                            })
                    }
                )
        }

debugger
            props.onSubmit(cardItem).then(res => {
                alert(res)
            }).catch(error => {
                console.log('er', error)
            })



    }

    function onReset() {
        setCardItem(emptyCardItem());
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
        cardItem[name] = getFieldValue(event.target);
        setCardItem({...cardItem});
    }


//region Field validators
    const validatePrice = () => {
        return isNaN(cardItem.price) || cardItem.price >= 0;
    }


//region Field error messages
    function getErrorTextPrice() {
        return !validatePrice() ? 'salary can\'t be less than 0' : '';
    }

    function getErrorTextId() {
        const validCode = validateId();
        switch (validCode) {
            case -1:
                return 'ID can\'t be less or equal than 0';
            case -2:
                return 'CardView with such ID already exists';
            default:
                return '';
        }
    }

    function getErrorTextName() {
        return !validateName() ? 'Name can contain only english letters and spaces' : '';
    }


//endregion

    /**
     * Validates fields for enabling/disabling Submit button
     */
    useEffect(() => {
        const validate = (): boolean => {
            return cardItem.price >= 0
                //&& cardItem.sale == true || false //&& validateDepartment()
                && cardItem.name !== '' && validateNameHook()
                && validateIdHook() > 0;
        }

        setValid(validate());
    }, [cardItem, validateNameHook, validateIdHook]);

    const [checked, setChecked] = React.useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        const name: string = event.target.name;
        cardItem[name] = event.target.checked;
        setCardItem({...cardItem});
    };

    const setImgValue = (img: string) => {
        cardItem.img = img;
        setCardItem({...cardItem});
    }

    const [image, setImage] = useState(null);

    const handleChangeImg = async (event: any) => {
        event.preventDefault()
        if (event.target.files.length > 0) {
            let img = event.target.files[0]
            setImage(img);
        }
    };



    const [checkedSwitch, setCheckedSwitch] = React.useState(false);
    const handleChangeSwitcher = () => {
        setCheckedSwitch((prev) => !prev);
    };
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    function handleChangeProduct(event: any) {
        const fieldName: string = event.target.name
        enteredValues[fieldName] = event.target.type === 'number' ? +event.target.value || NaN : event.target.value || '';
        setValues({...enteredValues});
        cardItem.product_type = enteredValues.product_type
    }


    return <React.Fragment>
        <Container maxWidth="xs">
            <form onSubmit={onSubmit} onReset={onReset}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth label={'ID'} name={'id'} type={'number'}
                                   onInput={handleInput}
                                   error={validateId() < 0} helperText={getErrorTextId()}
                                   value={isNaN(cardItem.id) ? '' : cardItem.id}
                                   disabled={!!props.cardItem}/>
                    </Grid>
                    <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={checkedSwitch} onChange={handleChangeSwitcher} />}
                                label="Upload image from computer"
                            />
                        <Fade in={checkedSwitch}>
                            <input type="file" onChange={handleChangeImg}/>
                        </Fade>
                        <Fade in={!checkedSwitch}>
                            <TextField fullWidth label={'Enter img link'} name={'img'} type={'text'}
                                       onInput={handleInput}
                                       value={cardItem.img}
                                       />
                        </Fade>

                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label={'Name'} name={'name'} type={'text'}
                                   onInput={handleInput}
                                   error={!validateName()} helperText={getErrorTextName()}
                                   value={cardItem.name}/>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="product_type">Product type</InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={enteredValues.product_type}
                                onChange={handleChangeProduct}
                                name={'product_type'}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {SAMPLE_PRODUCT_TYPE.map(d => <MenuItem value={d} key={d}>{d}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label={'Price'} name={'price'} type={'number'}
                                   onInput={handleInput}
                                   error={!validatePrice()} helperText={getErrorTextPrice()}
                                   value={isNaN(cardItem.price) ? '' : cardItem.price}/>
                    </Grid>
                    <Grid item xs={12}>
                        <text>sale?</text>
                        <Checkbox
                            name={'sale'}
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{'aria-label': 'primary checkbox'}
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth disabled={!isValid} variant="contained" color="primary"
                                type={'submit'}>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        {props.cardItem ?
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
export default CardItemForm;
