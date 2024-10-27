import React, { useContext } from 'react'
import ChooseOption from './ChooseOption'
import { ItemsContext } from './itemsContext.jsx';
// import the custom hook to access the global edited item context.
import { useItemContext } from './EditedItemContext.jsx';

export default function AddToOrder(props) {

    // This line uses our custom useItemContext hook to extract globalState and updateGlobalState from the global context.
    // Now we can use these within our component.
    const { itemState, updateEditItemState } = useItemContext();
    const { items, setItems, updateItemCart } = useContext(ItemsContext);

    return (
        <div className='popUp_screen'>
            <div className="vertical_container main_card">
                {console.log("item state is: ", itemState)}
                <span className='subTitle'> {itemState.menuTitle}</span>
                <span className='mainTitle' style={{ color: "rgb(194, 0, 0)" }}> {itemState.item.title} </span>
                {itemState.item.image_url && (
                    <img className='item_img_fit'
                        src={`../../images/items/${itemState.item.image_url}`}
                        alt="sandwich" />
                )}
                <span className='boldContent' style={{ padding: "8px 0px" }}> {itemState.item.description} </span>

                <div className='horizontal_container'>
                    <div className="vertical_container">
                        <span className='emphContent'>בחירת כמות</span>
                        <div className='content'>
                            <button onClick={() => { updateEditItemState('quantity', itemState.quantity + 1); }}>+</button>
                            <span style={{ display: "inline-block", minWidth: "20px" }}>{itemState.quantity}</span>
                            <button onClick={() => {
                                updateEditItemState('quantity', Math.max(1, itemState.quantity - 1));
                            }}>-</button>
                        </div>
                    </div>

                    {
                        itemState.options?.map((option, i) => {
                            return (
                                <ChooseOption key={option.title} indexHeadOption={i} />
                            )
                        })
                    }

                </div>

                <span className="dominantContent" style={{ minWidth: "150px" }}> סך הכל {(itemState.newPrice) * (itemState.quantity || -1)} ₪</span>

                {itemState.isEditMode ?
                    <button className="dominantButton" onClick={() => {
                        console.log(JSON.parse(JSON.stringify(itemState)))
                        updateItemCart(itemState)
                        props.close();
                    }} > &#9998; סיום עריכה </button>
                    :
                    <div style={{ width: "95%" }}>
                        <button className="emphContent dominantButton" onClick={() => {
                            setItems([...items, itemState]);
                            props.close()
                        }} > &#10022; הוספה להזמנה </button>
                        <button className='content' onClick={() => { props.close() }}> &#10006; בטל </button>
                    </div>
                }

            </div>
        </div>
    )
}