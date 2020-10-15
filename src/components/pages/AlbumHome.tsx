import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import CardItem from "../../models/CardItem";
import Carousel from "react-elastic-carousel";
import {authService, serviceBasket} from "../../config/server-config";
import ErrorTypes from "../../util/ErrorTypes";
import BasketItem from "../../models/BasketItem";
import CardItemForm from "../CardItemForm";
import NewCardItem from "./NewCardItem";
import {Rating} from "@material-ui/lab";
import Paper from "@material-ui/core/Paper";
import Timer from "../library/Timer";
import usePollerRedux from "../../util/poller";
import {basketsItemAction} from "../../store/actions";
import {POLLING_INTERVAL} from "../../config/consts";
import {UserData} from "../../services/AuthService";
import {firestore} from "firebase";
import appFirebase from "../../config/firebase-sdk";



type Props = {
    refreshFn?: () => void,
    backPath?: string,
    userData: UserData
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        background: '#ffff'
    },
    card: {
        padding: '20px',
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
    block: {
        width:'100%'
        },
    img: {
        display:'block',
        margin: 'auto',
        'max-width':'100%',
         height:'auto',

    },
    header: {
        display:'block',
        width:'600px',
        'max-width':'100%',
        margin: 'auto',
    }
}));

const CarouselStyle = styled(Carousel)`
button.brcpxa {
background-color: '#ffff'
}
`

//const cards = [1, 2, 3, 4];

function errorHandler(error: ErrorTypes) { //Not research yet
    if (error === ErrorTypes.AUTH_ERROR) {
        authService.logout().then();
    }
}

export default function Album(props: Props) {
    const userData = useSelector((state: ReducersType) => state.userData);
    usePollerRedux<BasketItem>(serviceBasket, serviceBasket.getBasket, userData, basketsItemAction, errorHandler, POLLING_INTERVAL);

    const cards: CardItem[] = useSelector((state: ReducersType) => state.cardItems)
        .filter((card: CardItem) => card.sale);
     const basket: BasketItem = useSelector((state: ReducersType) => state.basket);

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 450, itemsToShow: 2, itemsToScroll: 2 },
        { width: 960, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 }
    ];

    const classes = useStyles();
    const [backFl, setBackFl] = useState<boolean>(false);


    async function addToBasket(card: CardItem):Promise<string> {

        console.log(basket)

        if (!basket.id) { //after render - I take empty basket, and first add - always here
            var basketUpdateN = {
                id: props.userData.uid,
              //  products: [new Map<string, any>([['barcode', id], ['quantity', 1]])],
                productsNew: [{'barcode': card.id, 'quantity': 0, 'name': card.name, 'description': card.description, 'price': card.price }]
            }
        } else {
            var basketUpdateN = {
                id: props.userData.uid,
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

    return (
        <React.Fragment>
            <CssBaseline />
                <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <img className={classes.header} src={'https://firebasestorage.googleapis.com/v0/b/employees-9f99f.appspot.com/o/Label.png?alt=media&token=9c079970-a014-4ebd-b843-5eadd9da7806'}/>
                    <Container maxWidth="lg" >
                        <Carousel >
                        <div className={classes.block}>
                          <div>
                            <a href="https://ya.ru/" >
                                <img alt={'TopSale'} className={classes.img} src={'https://firebasestorage.googleapis.com/v0/b/employees-9f99f.appspot.com/o/SalePicture%2F01_salePage_Monin.jpg?alt=media&token=81b60caa-225f-43aa-a049-183ee6a85114'}/>
                            </a>
                          </div>
                            <Timer />

                        </div>
                            <div className={classes.block}>
                                <a href="https://ya.ru/" >
                                    <img alt={'TopSale'} className={classes.img} src={'https://cdn3.automobilesreview.com/img/bmw-i3-concept/bmw-i3-concept-22.jpg'}/>
                                </a>
                            </div>
                        </Carousel>

                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button onClick={()=>{alert('No no No! I don\'t think so')}} variant="contained" color="primary" >
                                        Add new stock
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>

                <Container className={classes.cardGrid} maxWidth="xl">

                    {/* End hero unit */}
                    <Grid container spacing={4} >
                        {/*sm={6} md={4}*/}
                        <Carousel breakPoints={breakPoints}>
                        {cards.map((card:CardItem) => {


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
                        </Carousel>
                    </Grid>

                </Container>

            </main>
            <footer className={classes.footer}>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                <Button variant="contained" color="primary" href={'http://localhost:3000/#/product'}>Add new product</Button>
                <Copyright />
                    </Grid>
                </Grid>
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}
