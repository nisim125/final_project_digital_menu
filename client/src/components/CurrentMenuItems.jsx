import React, { useState } from 'react'

const maxTitleLength = 35;
const maxDescriptionLength = 50;

export default function CurrentMenuItems(props) {

    const [data, setData] = useState(null); // שמירת הנתונים שהתקבלו
    const [loading, setLoading] = useState(false); // שמירה האם הטעינה מתבצעת
    const [error, setError] = useState(null); // שמירה על הודעות שגיאה

    if (loading) {
        console.log("טוען נתוני מנה מהשרת");
    }

    if (error) {
        console.log("חלה שגיאה בטעינת נתוני המנה מהשרת");
    }

    function onClickingItem(item, menuTitle, id) {
        // קריאת ה-API באמצעות fetch
        fetch('http://localhost:8080/api/item?id=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('response was not ok');
                }
                return response.json(); // המרת התגובה ל-JSON
            })
            .then(data => {
                setData(data); // שמירת המידע שהתקבל
                setLoading(false); // הפסקת מצב הטעינה
                props.open(item, menuTitle, data, 1, false);
            })
            .catch(error => {
                setError(error.message); // שמירת הודעת השגיאה אם יש בעיה
                setLoading(false); // הפסקת מצב הטעינה
            })
    }

    return (
        <div id="current_menu_items" className="vertical_container">
            {props.subMenu.items.map((item, i) => (

                <div key={item.title + i}
                    className="horizontal_container card item_container"
                    onClick={() => {
                        onClickingItem(item, props.subMenu.subMenu.title, item.id)
                    }}>
                    <div style={{
                        width: "232px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <div>
                            <p className="subHeading text_right">
                                {item.title.length > maxTitleLength ? { ...item }.title.substring(0, maxTitleLength) + '...' : item.title}
                            </p>

                            <p className="content text_right">
                                {(item.description && item.description.length) > maxDescriptionLength ? { ...item }.description.substring(0, maxDescriptionLength) + '...' : item.description}
                            </p>
                        </div>
                        <div>
                            <p className="boldContent text_right"> {item.price} ₪ </p>
                        </div>
                    </div>

                    <div
                        className='item_image_cover_div'
                        style={{ opacity: item.image_url ? 1 : 0.2 }}>
                        <img
                            className='item_img_cover'
                            src={item.image_url ? `../../images/items/${item.image_url}` : '../../images/iconLogo.png'}
                            alt={item.image_url ? "item image" : "item image not found... logo instead"} />
                    </div>

                </div>

            ))}

        </div>

    )
}