import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Paper from "@material-ui/core/Paper";
import Topbar from "../library/Topbar";
import {getDropMenuItems, getMenuItems, getNumberTabs} from "./Home";
import {UserData} from "../../services/AuthService";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import EmployeesSearch from "./EmployeesSearch";
import CardItem from "../../models/CardItem";
import BasketItem from "../../models/BasketItem";
import {Rating} from "@material-ui/lab";
import {authService, serviceBasket} from "../../config/server-config";
import ErrorTypes from "../../util/ErrorTypes";
import SearchBar from "./SearchBar";
import {POLLING_INTERVAL, SAMPLE_PRODUCT_TYPE} from "../../config/consts";
import usePollerRedux from "../../util/poller";
import {basketsItemAction} from "../../store/actions";
import Carousel from "react-elastic-carousel";

type Props = {
    refreshFn?: () => void,
    backPath?: string
}

function errorHandler(error: ErrorTypes) { //Not research yet
    if (error === ErrorTypes.AUTH_ERROR) {
        authService.logout().then();
    }
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));


export default function ShopProgrammer(props: Props) {

    const userData = useSelector((state: ReducersType) => state.userData);
    usePollerRedux<BasketItem>(serviceBasket, serviceBasket.getBasket, userData, basketsItemAction, errorHandler, POLLING_INTERVAL);

    const [cards, setCards] = useState(useSelector((state: ReducersType) => state.cardItems)
        .filter((card: CardItem) => !card.sale && card.product_type === SAMPLE_PRODUCT_TYPE[0]))
    const basket: BasketItem = useSelector((state: ReducersType) => state.basket);

    let cardsAdditional: CardItem[] = useSelector((state: ReducersType) => state.cardItems)
        .filter((card: CardItem) => card.product_type === SAMPLE_PRODUCT_TYPE[1]);


    const width: number = useSelector((state: ReducersType) => state.width);

    function searchedCards(newCards: CardItem[]): any {
        setCards(newCards)
        // return cards = newCards
        return null
    }


    async function addToBasket(card: CardItem):Promise<string> {


        if (!basket.id) { //after render - I take empty basket, and first add - always here
            var basketUpdateN = {
                id: userData.uid,
                //  products: [new Map<string, any>([['barcode', id], ['quantity', 1]])],
                productsNew: [{'barcode': card.id, 'quantity': 0, 'name': card.name, 'description': card.description, 'price': card.price }]
            }
        } else {
            var basketUpdateN = {
                id: userData.uid,
                // products: basket.products,
                productsNew: basket.productsNew
            }
        }

        // теперь добавим товар
        basketUpdateN!.productsNew.forEach(product => {
            if (product.barcode === card.id) {
                product.quantity++
            }
        })

        if (basketUpdateN.productsNew.findIndex(product => product.barcode === card.id) === -1) {
            basketUpdateN.productsNew.push({'barcode': card.id, quantity: 1, 'name': card.name, 'description': card.description, 'price': card.price})
        }





        try {
            await serviceBasket.addBasketItem(basketUpdateN);
            setBackFl(true);
            !!props.refreshFn && props.refreshFn();
            return '';
        } catch (error) {
            return (error as ErrorTypes) ===
            ErrorTypes.SERVER_ERROR ? `Product with id: ${basket.id} already exists` :
                'Server is not available, please repeat later';
        }
    }

    const classes = useStyles();
    const [backFl, setBackFl] = useState<boolean>(false);






    return (
        <React.Fragment>
            <Topbar dropMenu={getDropMenuItems(userData)} menu={getMenuItems(userData)}
                    countNavigator={getNumberTabs(width)}/>
            <CssBaseline/>
            <Grid container spacing={3}>

                <Grid item xs={3}>
                    <main>
                        <Container className={classes.cardGrid} maxWidth="md">
                            <Grid container spacing={3}>
                                <SearchBar
                                    funcSearch={searchedCards}
                                />
                            </Grid>
                            <Grid container spacing={4}>
                                {cardsAdditional.map((card:CardItem) => {


                                    return  <Grid item key={card.id} xs={12} >
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={card.img}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {card.name}
                                                </Typography>
                                                <Typography>
                                                    {card.description}
                                                </Typography>
                                                <Rating name="half-rating-read" defaultValue={card.rating} precision={0.5} readOnly />
                                                <div>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <Typography color={'secondary'} align={'center'} variant={'h5'}>
                                                                <del>  {card.price} $  </del>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography color={'error'} align={'left'} variant={'h4'}>
                                                                {card.priceNew} $
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </div>

                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" fullWidth size="large" color="secondary"
                                                        onClick={() => addToBasket(card).then()}>
                                                    Add To Cart
                                                </Button>

                                            </CardActions>
                                        </Card>
                                    </Grid>

                                })}
                            </Grid>
                        </Container>
                    </main>
                </Grid>
                <Grid item xs={9}>

                    <main>
                        <Container className={classes.cardGrid} maxWidth="md">
                            {/* End hero unit */}
                            <Grid container spacing={4}>
                                {cards.map((card:CardItem) => {


                                    return  <Grid item key={card.id} xs={4} >
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={card.img}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {card.name}
                                                </Typography>
                                                <Typography>
                                                    {card.description}
                                                </Typography>
                                                <Rating name="half-rating-read" defaultValue={card.rating} precision={0.5} readOnly />
                                                <div>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <Typography color={'secondary'} align={'center'} variant={'h5'}>
                                                                <del>  {card.price} $  </del>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography color={'error'} align={'left'} variant={'h4'}>
                                                                {card.priceNew} $
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </div>

                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" fullWidth size="large" color="secondary"
                                                        onClick={() => addToBasket(card).then()}>
                                                    Add To Cart
                                                </Button>

                                            </CardActions>
                                        </Card>
                                    </Grid>

                                })}
                            </Grid>
                        </Container>
                    </main>

                </Grid>
            </Grid>
        </React.Fragment>
    );
}