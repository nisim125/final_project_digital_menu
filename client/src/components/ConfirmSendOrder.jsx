import React, { useState, useContext } from 'react'
import { ItemsContext } from './itemsContext';

export default function ConfirmSendOrder(props) {
    const [completeOrder, setcompleteOrder] = useState(false);

    const { items, resetItems } = useContext(ItemsContext)

    const handleSendOrder = () => {
        console.log("clientId: ", props.userId);
        console.log("items: ", items);
        // יצירת גוף הבקשה משדות הקלט
        const sendOrderData = {
            clientId: props.userId,
            items: items
        };
        console.log("sendOrderData: ", sendOrderData);

        // שליחת הנתונים לסרבר
        fetch('http://localhost:8080/api/send_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendOrderData) // המרת נתוני משתמש לגייסון
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('oops... send order failed');
                }
                return response.text(); // קבלת תשובה מהסרבר
            })
            .then(data => {
                console.log("order sent successfully:", data);
            })
            .catch(error => {
                console.error("Error during sending order:", error);
            });
    };

    return (

        <div className='popUp_screen'>

            {completeOrder === false ?
                <div className="vertical_container main_card">
                    <span className='mainTitle'> אישור הזמנה </span>

                    <span className='subTitle'>  </span>

                    <button className="emphContent dominantButton"
                        onClick={() => {
                            setcompleteOrder(true);
                            handleSendOrder();
                            resetItems();
                        }} > &#10004; סיימתי ואני מאשר לשלוח את ההזמנה </button>
                    
                    <button className='content' onClick={() => {
                        props.back();
                    }}>
                        &#10132; חזור אחורה </button>
                </div>
                :
                <div className="vertical_container main_card"
                    style={{
                        minHeight: "300px",
                        justifyContent: "space-around",
                        backgroundImage: "url(/images/background.png)",
                        backgroundSize: "cover",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        backgroundBlendMode: "overlay"
                    }} >
                    <div style={{ width: "80px", height: "80px" }}>
                        <img src="/images/iconLogo.png" style={{ width: "80px" }} alt="logo" />
                    </div>

                    <span className='mainTitle' style={{ color: "rgb(194, 0, 0)" }}> איזה כיף שהזמנתם אצלינו! </span>

                    <span className='subTitle'> בתיאבון, ונתראה בפעם הבאה</span>

                    <button className="emphContent dominantButton" onClick={() => {
                        props.back();
                    }} > יציאה חזרה למסך הראשי </button>
                </div>
            }

        </div>
    )
}

