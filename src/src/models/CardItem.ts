interface CardItem {
    id: number;

    img: string;

    name: string;
    description: string;
    rating?: number;
    price: number;
    priceNew?: number;
    sale: boolean;
    product_type: string
}
export default CardItem;
