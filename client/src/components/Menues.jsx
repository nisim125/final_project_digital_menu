import React, { useState } from 'react';

export default function Menues(props) {

    const [selectedMenuIndex, setSelectedMenuIndex] = useState(props.indexToShow);

    const handleMenuClick = (titleIndex) => {
        setSelectedMenuIndex(titleIndex);
        props.chooseMenu(titleIndex);
    };

    return (
        <div id="menues" className="vertical_container">
            {props.titles.map((title, index) => (
                <button
                    key={title}
                    className={`subHeading ${selectedMenuIndex === index ? "menu_button_on" : "menu_button"}`}
                    onClick={() => handleMenuClick(index)}
                >
                    {title}
                </button>
            ))}
        </div>
    )
}
