import React, { useState, useRef, useEffect } from 'react'
import CurrentMenu from './CurrentMenu';
import Menues from './Menues';

export default function FullMenu(props) {

    const [menuToShow, setMenuToShow] = useState(0);

    // Create a ref to store the references to the menu sections
    const menuRefs = useRef([]);

    const handleSetMenu = (titleIndex) => {
        setMenuToShow(titleIndex);

        // Scroll to the selected menu
        if (menuRefs.current[titleIndex]) {
            menuRefs.current[titleIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const [data, setData] = useState(null); // שמירת הנתונים שהתקבלו
    const [loadingMenu, setLoadingMenu] = useState(true); // שמירה האם הטעינה מתבצעת
    const [error, setError] = useState(null); // שמירה על הודעות שגיאה

    useEffect(() => {
        // קריאת ה-API באמצעות fetch
        fetch('http://localhost:8080/api/full_menu', {
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
                console.log("data of full menu received");
                // Use a timeout to ensure the loading state is active for at least 1 second
                setTimeout(() => {
                    setData(data); // Store the received data
                    setLoadingMenu(false); // Stop loading
                    props.menuLoadedSuccessfully();
                }, 1000); // Delay of 1 second
            })
            .catch(error => {
                setError(error.message); // שמירת הודעת השגיאה אם יש בעיה
                setLoadingMenu(false); // הפסקת מצב הטעינה
            })
    }, []); // התלות הריקה [] מבטיחה שהאפקט ירוץ רק פעם אחת כשהקומפוננטה נטענת

    if (loadingMenu) {
        return <div className="vertical_container">
            <p style={{ fontWeight: "bold", marginTop: "30%" }} className='subTitle'>טוען נתונים...</p>
            <img
                src='../../images/loading.gif'
                alt="loading gif"
                style={{
                    marginTop: "12px",
                    height: "48px",
                }}
            />
        </div>    // הודעה בזמן שהטעינה מתבצעת
    }

    if (error) {
        return <p>חלה שגיאה בטעינת הנתונים. יש לנסות לטעון את הדף מחדש.</p>; // הצגת השגיאה אם קרתה
    }

    return (
        <div id="full_menu_div" className="horizontal_container">
            <Menues titles={data.map(subMenu => subMenu.subMenu.title)} indexToShow={menuToShow} chooseMenu={handleSetMenu}></Menues>

            <div id="full_menu" className="vertical_container scrollbar">
                {
                    data.map((subMenu, index) => {
                        return (
                            <div
                                style={{ display: 'flex', justifyContent: 'center' }}
                                key={'divSubMenu' + index}
                                // Store the ref for each menu
                                ref={el => menuRefs.current[index] = el}
                            >
                                <CurrentMenu
                                    subMenu={subMenu}
                                    open={props.open}
                                    close={props.close} />
                            </div>
                        )
                    })
                }

            </div>

        </div>
    )
}