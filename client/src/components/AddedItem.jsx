import React, { useContext } from 'react'
import { ItemsContext } from './itemsContext'

export default function AddedItem(props) {

    return (
        <div className="vertical_container card added_item_container">

            <span className="boldContent"> תפריט {props.item.menuTitle}</span>

            <span className="subHeading" style={{color:"rgb(194, 0, 0)"}}> {props.item.item.title} </span>

            <span className="content"> כמות:  {props.item.quantity} </span>

            {
                props.item.options.map((option) => {
                    return (
                        <p className="content" key={option.title}> {option.title + ":"}
                            {option.optionCollection.map((optionObject, i) => {
                                return (
                                    (optionObject.isChecked) ? <span key={optionObject.optionTitle}> {optionObject.optionTitle} </span> : ""
                                )
                            })}
                        </p>
                    )
                })}

            <p>
                <button onClick={() => {
                    props.edit(props.item.item, props.item.menuTitle,props.item.options, props.item.quantity, true, props.index, props.item.newPrice);
                }}> &#9998; עריכה </button>

                <button onClick={() => {
                    props.delete(props.index);
                }}> &#10006; הסר</button>
            </p>

        </div>
    )
}