import React from 'react'
import CurrentMenuDescription from './CurrentMenuDescription'
import CurrentMenuItems from './CurrentMenuItems'

export default function CurrentMenu(props) {
    return (
        <div id="current_menu" className="vertical_container">            
            <CurrentMenuDescription key={props.subMenu.subMenu.title} title={props.subMenu.subMenu.title} description={props.subMenu.subMenu.description}/>
            <CurrentMenuItems key={props.subMenu.subMenu.title+"Items"} subMenu={props.subMenu} open={props.open} close={props.close}/>
        </div>
    )
}
