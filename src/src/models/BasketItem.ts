interface BasketItem {

    id: string;
  //  products: Map<string, any>[];
    productsNew: { 'barcode': number, 'quantity': number, 'name': string, 'description': string, 'price': number }[]


}
export default BasketItem;
