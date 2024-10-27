import React, { useContext } from 'react'
import { ItemsContext } from './itemsContext';

export default function ConfirmDeleteFromCart(props) {

    const { removeFromCart } = useContext(ItemsContext)

    return (
        <div className='popUp_screen'>
            <div className="vertical_container main_card">

                <span className='mainTitle'> האם ברצונך להסיר את המוצר? </span>

                <span className='subTitle'> קיימת בסל אפשרות לערוך את המוצר מבלי להסירו </span>

                <button className="emphContent dominantButton" onClick={() => {
                    removeFromCart(props.index);
                    props.back();
                }} > &#10006; הסרה </button>

                <button className='content' onClick={() => { props.back() }}> 
                &#10132; חזור אחורה </button>
            </div>
        </div>
    )
}
