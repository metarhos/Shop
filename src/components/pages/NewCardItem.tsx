import React, {useState} from "react";
import { Redirect } from "react-router-dom";
import {menu, PATH_HOME} from "../../config/Menu";
import {useSelector} from "react-redux";
import {ReducersType} from "../../store/store";
import ErrorTypes from "../../util/ErrorTypes";

import {serviceCard} from "../../config/server-config";
import CardItem from "../../models/CardItem";
import CardItemForm from "../CardItemForm";

type Props = {
    refreshFn?: () => void,
    backPath?: string
}
const NewCardItem: React.FC<Props> = (props: Props) => {
    const cardItems: CardItem[] = useSelector((state: ReducersType) => state.cardItems);

    const [backFl, setBackFl] = useState<boolean>(false);
    async function onSubmit(card: CardItem):Promise<string> { //run when submit in form and check if already have this card
        try {
            await serviceCard.addCard(card);
            setBackFl(true);
            !!props.refreshFn && props.refreshFn();
            return 'Added';
        }catch (error) {
            return (error as ErrorTypes) ===
            ErrorTypes.SERVER_ERROR ? `Card with id: ${card.id} already exists` :
                'Server is not available, please repeat later';
        }
    }
    return <React.Fragment>
        <CardItemForm cardItems={cardItems} onSubmit={onSubmit}/>
        {backFl && <Redirect to={props.backPath || PATH_HOME}/>}
    </React.Fragment>
}
export default NewCardItem;
