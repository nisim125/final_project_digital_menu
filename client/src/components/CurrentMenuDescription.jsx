import React from 'react'

export default function CurrentMenuDescription(props) {
    return (
        <div className="vertical_container current_menu_description">
            <p className='subTitle'>{props.title}</p>
            {
                props.description && <p className='content'> {props.description} </p>
            }
        </div>
    )
}
