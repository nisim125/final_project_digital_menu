import React, { useState } from 'react'

export default function LogIn(props) {
    const [isLogIn, setIsLogIn] = useState(true);

    const [firstName, setFirstName] = useState(''); // שמירת ao pryh
    const [lastName, setLastName] = useState(''); // שמירת ao napjv
    const [phone, setPhone] = useState(''); // שמירת הטלפון
    const [password, setPassword] = useState(''); // שמירת הסיסמה
    const [birthdate, setBirthdate] = useState(''); // שמירת הטלפון
    const [acceptTerms, setAcceptTerms] = useState(false); // שמירת הסיסמה

    const [errorLogIn, setErrorLogIn] = useState(null); // שמירה על הודעות שגיאת התחברות
    const [errorSignUp, setErrorSignUp] = useState(null); // שמירה על הודעות שגיאת הרשמה


    const handleLogIn = () => {
        // יצירת גוף הבקשה משדות הקלט
        const logInData = {
            phone: phone,
            password: password
        };

        // שליחת הנתונים לסרבר
        fetch('http://localhost:8080/api/log_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logInData) // המרת נתוני משתמש לגייסון
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed, phone or password incorrect');
                }
                return response.text(); // קבלת תשובה מהסרבר
            })
            .then(data => {
                console.log("Login successfully:", data);
                props.setUserData(data)
                props.close()
            })
            .catch(error => {
                console.error("Error during login:", error);
                setErrorLogIn(error.message); // הצגת הודעת שגיאה במידת הצורך
            });
    };

    const handleSignUp = () => {
        if (!acceptTerms) {
            console.log("accept terms must be checked");
            setErrorSignUp("accept terms must be checked")
        } else {
            setErrorSignUp(null);
            // יצירת גוף הבקשה משדות הקלט
            const signUpData = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                password: password,
                birthdate: birthdate,
            };

            // שליחת הנתונים לסרבר
            fetch('http://localhost:8080/api/sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpData) // המרת נתוני משתמש לגייסון
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('error... sign up failed - some value is incorrect');
                    }
                    return response.text(); // קבלת תשובה מהסרבר
                })
                .then(data => {
                    console.log("Signed up successfully:", data);
                    handleLogIn()
                })
                .catch(error => {
                    console.error("Error during login:", error);
                    setErrorSignUp(error.message); // הצגת הודעת שגיאה במידת הצורך
                });
        }
    };

    return (
        <div className='popUp_screen'>

            <div className='vertical_container main_card'>

                <p className='mainTitle'> כניסה </p>
                <p className='content'> יש להתחבר על מנת לבצע שימוש במערכת </p>

                <div
                    className='horizontal_container'
                    style={{ width: "95%" }}>

                    <button
                        className={(isLogIn ? 'checked_button' : 'button') + ' subHeading'}
                        style={{ width: "40%" }}
                        onClick={() => {
                            setIsLogIn(true)
                            setErrorSignUp("")
                        }}
                    >יש לי חשבון</button>

                    <button
                        className={(!isLogIn ? 'checked_button' : 'button') + ' subHeading'}
                        style={{ width: "40%" }}
                        onClick={() => {
                            setIsLogIn(false)
                            setErrorLogIn("")
                        }}
                    >הרשמה</button>

                    <button onClick={() => {
                        setPhone('0505005500');
                        setPassword('QWEqwe123');
                    }}>
                        פרטי התחברות מהירים
                    </button>

                </div>

                {
                    <div style={{ height: "480px" }}>

                        {!isLogIn && <>
                            <p> שם פרטי </p>
                            <input
                                id='firstName'
                                type='text'
                                placeholder='&#10022;'
                                autoFocus
                                required
                                value={firstName}
                                onChange={(ev) => setFirstName(ev.target.value)} // שמירה ב-state
                            />

                            <p> שם משפחה </p>
                            <input id='lastName'
                                type='text'
                                placeholder='&#10022;'
                                required
                                value={lastName}
                                onChange={(ev) => setLastName(ev.target.value)}
                            />
                        </>}

                        <p>מספר טלפון</p>
                        <input
                            type="tel"
                            name="phone"
                            placeholder='&#9742;'
                            maxLength={10}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            required
                            value={phone}
                            onChange={(ev) => setPhone(ev.target.value)}
                        />

                        <p>סיסמה</p>
                        {!isLogIn &&
                            <p style={{ fontSize: "12px" }}> יש לכלול אות גדולה באנגלית ומספר </p>
                        }
                        <input
                            type='password'
                            placeholder='&#8902; &#8902; &#8902; &#8902; &#8902;'
                            required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)} // שמירה ב-state
                        />

                        {!isLogIn && <>
                            <p> תאריך לידה </p>
                            <p style={{ fontSize: "12px" }}>
                                אופציונלי - כדי שנדע מתי לשלוח מתנה &#9829;
                            </p>
                            <input id='birthdate'
                                type='date'
                                pattern=''
                                required
                                value={birthdate}
                                onChange={(ev) => setBirthdate(ev.target.value)}
                            />

                            <div
                                className='horizontal_container'>
                                <input
                                    id="acceptTerms"
                                    type='checkbox'
                                    required
                                    style={{ width: "30px" }}
                                    value={acceptTerms}
                                    onChange={(ev) => setAcceptTerms(ev.target.checked)}
                                />
                                <span>הסכמה לשמירת נתונים במערכת שלנו (חובה)</span>
                            </div>
                        </>
                        }

                        {!isLogIn && <>
                            {
                                errorSignUp &&
                                <p
                                    className='boldContent'
                                    style={{ marginTop: "12px", color: "rgb(194, 0, 0)" }}>
                                    אופס... יש לוודא שכל הפרטים מלאים כמו שצריך
                                </p>
                            }
                        </>}

                        {
                            !isLogIn &&
                            <button
                                style={{ marginTop: "12px" }}
                                type="submit"
                                form="form1"
                                value="Submit"
                                className='dominantButton subHeading'
                                onClick={handleSignUp}
                            > סיום הרשמה והתחברות </button>
                        }

                        {isLogIn && <>
                            {
                                errorLogIn &&
                                <p className='boldContent' style={{ marginTop: "12px", color: "rgb(194, 0, 0)" }}> אופס... נראה שהכנסת פרטי התחברות שגויים </p>
                            }
                            <button
                                style={{ marginTop: "12px" }}
                                type="submit"
                                form="form1"
                                value="Submit"
                                className='dominantButton subHeading'
                                onClick={handleLogIn}
                            >התחברות</button>

                            <div
                                className='item_img'
                                style={{ width: "100%", margin: "12px auto" }}>
                                <img
                                    src="/images/sandwich_banner.png"
                                    style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "center", borderRadius: "15px" }}
                                    alt="logo" />
                            </div>
                        </>}

                    </div>}
            </div>
        </div>
    )
}