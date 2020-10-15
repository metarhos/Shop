
import React, {useRef, useState} from 'react'
import {headersAll, headersWidth} from "../../config/basket-table-config";
import Topbar from "../library/Topbar";
import DeleteIcon from '@material-ui/icons/Delete';
import {Backdrop, Fade, Modal, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import {UserData} from "../../services/AuthService";
import ErrorTypes from "../../util/ErrorTypes";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {HeaderDescription, MyTable} from "../library/MyTable";
import EditIcon from '@material-ui/icons/Edit';
import ConfirmationDialog from "../library/ConfirmDialog";
import EmployeeForm from "../EmployeeForm";
import EmployeeView from "../../models/EmployeeView";
import Employee from "../../models/EmployeeType";
import {authService, serviceBasket} from "../../config/server-config";
import BasketItem from "../../models/BasketItem";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import usePollerRedux from "../../util/poller";
import {basketsItemAction} from "../../store/actions";
import {POLLING_INTERVAL, REMOVE_ALL_PRODUCTS} from "../../config/consts";
import {log} from "util";
type Props = {
    refreshFn?: () => void;

}
function errorHandler(error: ErrorTypes) { //Not research yet
    if (error === ErrorTypes.AUTH_ERROR) {
        authService.logout().then();
    }
}

const useStyles = makeStyles((theme: Theme) =>
//можно маргинТоп: тема.спэйсинг(20пх) тогда например заложит для всей темы. Ихменение глобальных компонентов
// Тему можно поменять. В апп положить тема: Тема = креатеМуиТема и т.д.
    ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },

    }));

export function getHeaders(width: number, isAdmin: boolean): Map<string, HeaderDescription> {
//Complite
    const headersWidthArray = headersWidth;
     const index = headersWidthArray.findIndex(hw => width > hw[0] );
     return headersWidthArray[index][1];
}


export const Basket: React.FC<Props> = (props: Props) => {


    const classes = useStyles()
    const width: number = useSelector((state: ReducersType) => state.width);
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const basket: BasketItem = useSelector((state: ReducersType) => state.basket);

    usePollerRedux<BasketItem>(serviceBasket, serviceBasket.getBasket, userData, basketsItemAction, errorHandler, POLLING_INTERVAL);

    const [openRemoveProducts, setOpenRemoveProducts] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<{open:boolean,
        basket:BasketItem|undefined}>({open:false,
        basket: undefined});
    const idRef = useRef<number>(0);
    const headers: Map<string, HeaderDescription> = getHeaders(width, userData.isAdmin);

    let totalPrice = 0;

    async function removeProducts(baskObj: object) {
        let product = JSON.parse(JSON.stringify(baskObj))
        idRef.current = product.barcode
        setOpenRemoveProducts(true)
    }

    async function clearBasket(baskObj: object) {

        setOpen(true)

    }

    async function addProduct(baskObj: object) {
        let product = JSON.parse(JSON.stringify(baskObj))

        var basketUpdateN : { id: any; productsNew: { 'barcode': number, 'quantity': number, 'name': string, 'description': string, 'price': number }[] } = {
            id: basket!.id,
            productsNew: basket!.productsNew
        }

            basketUpdateN!.productsNew.forEach(bproduct => {
                if (bproduct.barcode === product.barcode) {
                    bproduct.quantity++
                }
            })

        await serviceBasket.addBasketItem(basketUpdateN);
        !!props.refreshFn && props.refreshFn()
    }

    async function removeOneProduct(baskObj: object) {
        let product = JSON.parse(JSON.stringify(baskObj))

        var basketUpdateN : { id: any; productsNew: { 'barcode': number, 'quantity': number, 'name': string, 'description': string, 'price': number}[] } = {
            id: basket!.id,
            productsNew: basket!.productsNew
        }

        basketUpdateN!.productsNew.forEach(bproduct => {
            if (bproduct.barcode === product.barcode) {
                bproduct.quantity--
            }
        })

        await serviceBasket.addBasketItem(basketUpdateN);
        !!props.refreshFn && props.refreshFn()
    }


    async function onClose(res: boolean) { //res get from click in alertDialog
        setOpen(false);
        if (res) {
            try {
                var basketUpdateN : { id: any; productsNew: { 'barcode': number, 'quantity': number, 'name': string, 'description': string, 'price': number }[] } = {
                    id: basket!.id,
                    productsNew: basket!.productsNew
                }

                basketUpdateN.productsNew = []


                await serviceBasket.addBasketItem(basketUpdateN);
                !!props.refreshFn && props.refreshFn()
            } catch(error) {
                const errorEnum: ErrorTypes = error as ErrorTypes;
                const alertMessage = errorEnum === ErrorTypes.SERVER_ERROR ?
                    `Product with id ${idRef.current} doesn't exist` :
                    ( errorEnum === ErrorTypes.NETWORK_ERROR ?
                        'Server is not available, please repeat later' : 'Auth Error');
                alert(alertMessage);
            }
            //!! конвретирует наличие метода в булеан, тоесть тру или фолс. !! значит тру. Если существует, то делай
        }
    }

    async function onCloseRemoveProducts(res: boolean) { //res get from click in alertDialog
        setOpenRemoveProducts(false);
        if (res) {
            try {
                var basketUpdateN : { id: any; productsNew: { 'barcode': number, 'quantity': number, 'name': string, 'description': string, 'price': number }[] } = {
                    id: basket!.id,
                    productsNew: basket!.productsNew
                }

                let ind = basketUpdateN.productsNew.findIndex(bproduct => bproduct.barcode === idRef.current);
                basketUpdateN.productsNew.splice(ind,1)
                await serviceBasket.addBasketItem(basketUpdateN);
                !!props.refreshFn && props.refreshFn()

            } catch(error) {
                const errorEnum: ErrorTypes = error as ErrorTypes;
                const alertMessage = errorEnum === ErrorTypes.SERVER_ERROR ?
                    `Product with id ${idRef.current} doesn't exist` :
                    ( errorEnum === ErrorTypes.NETWORK_ERROR ?
                        'Server is not available, please repeat later' : 'Auth Error');
                alert(alertMessage);
            }
        }
    }
    function handleModalClose() {
        modal.open = false;
        setModal({...modal});
    }

    function getProducts() {
        if(!basket.id){
            return []
        }else{
                totalPrice = basket.productsNew.reduce(function (p, c) {
                    return p + c.price*c.quantity;
                }, 0)

            return basket.productsNew
        }

    }

    return <React.Fragment>
        <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)} countNavigator={getNumberTabs(width)}/>
        <MyTable defaultRowsPerPage={width > 500 && width < 900 ? 5 : 10}
                 innerWidth={width < 700? width : undefined} isDetails={headers !== headersAll}
                 headers={headers}
                 rows={getProducts()} //array need
                 actions={[
                      {icon: <AddCircleIcon/>, actionFn: addProduct},
                      {icon: <RemoveCircleIcon/>, actionFn: removeOneProduct},
                      {icon: <DeleteIcon/>, actionFn: removeProducts},
                     {icon: <DeleteIcon/>, actionFn: clearBasket}
                     ]}/>
                     <div style={ { 'textAlign': 'right', 'marginRight': '200px', 'marginTop':'20px'} }>{'Total cost is: ' + totalPrice}</div>
        {/*{} -- это делает объект из строк и прочего. И объект надо воткнуть в стили, они только объект едят*/}
        <ConfirmationDialog title={'You are going remove'} open={openRemoveProducts}
                            content={`product with barcode ${idRef.current}`} onClose={onCloseRemoveProducts}/>
        <ConfirmationDialog title={'You are going clear basket'} open={open}
                            content={`all products will be remove`} onClose={onClose}/>

    </React.Fragment>
}
export default Basket;
