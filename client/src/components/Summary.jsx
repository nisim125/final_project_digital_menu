import React, { useContext, useState } from 'react'
import AddedItem from './AddedItem'
import { ItemsContext } from './itemsContext'
import ConfirmDeleteFromCart from './ConfirmDeleteFromCart';

export default function OrderSummary(props) {

    const { items, totalPrice } = useContext(ItemsContext)

    let [openConfirmDeleteFromCart, setConfirmDeleteFromCart] = useState(false);

    let [indexToDelete, setIndexToDelete] = useState(-1);

    const openConfirm = (index) => {
        setIndexToDelete(index);
        setConfirmDeleteFromCart(true);
    };

    const closeConfirm = () => {
        setIndexToDelete(-1);
        setConfirmDeleteFromCart(false);
    };

    return (
        <div id='order_summary'>

            <button
                className="emphContent dominantButton"
                onClick={() => {
                    items.length > 0 &&
                        props.openSendOrder()
                }}>
                &#10022; מעבר לאישור הזמנה
            </button>

            <p><span className="content dominantContent"> סך הארוחה: {totalPrice} ₪</span></p>

            <div id='order_summary_items' className="vertical_container scrollbar">
                {items.map((item, i) => {
                    return (
                        <AddedItem key={item.item.title + i.toString()} index={i} item={item} edit={props.open} delete={openConfirm} />
                    )
                })}
            </div>

            {openConfirmDeleteFromCart && <ConfirmDeleteFromCart index={indexToDelete} back={closeConfirm}></ConfirmDeleteFromCart>}

        </div>
    )
}
