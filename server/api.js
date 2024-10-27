const mysql = require('mysql');

const dbConnectionDetails = {
    host: 'localhost',
    user: 'root',
    password: 'Aa123456123456',
    database: 'restaurant_database'
}

// פונקציה לבדיקת מחרוזת מאותיות בלבד
function isOnlyLetters(str) {
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        // בדיקה אם התו הוא לא אות באנגלית או בעברית
        if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= 'א' && char <= 'ת'))) {
            return false; // אם התו אינו אות
        }
    }
    return true;
}

// פונקציה לבדיקת עוצמת הסיסמה
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasUpperCase && hasNumber;
}

exports.signUp = (req, res, q) => {
    if (req.method != "POST") {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('oops... expected POST request');
        return;
    }
    let bodyString = '';
    req.on('data', chunk => {
        bodyString += chunk;
    });
    req.on('end', () => {
        // על מנת למנוע קריסה של השרת - רק אם הגוף מסוג ג'ייסון נמשיך
        let newUser = undefined;
        try {
            newUser = JSON.parse(bodyString);
        } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('not a valid JSON');
            return;
        }
        let firstName = newUser.firstName;
        let lastName = newUser.lastName;
        let phone = newUser.phone;
        let password = newUser.password;
        let birthdate = newUser.birthdate;
        console.log(bodyString);

        // בדיקה אם השדות קיימים ומכילים ערכים מתאימים

        // בדיקת שם פרטי
        if (!firstName || typeof firstName !== 'string' || firstName.length < 2 || firstName.length > 50) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('invalid first name');
            return;
        } else if (!isOnlyLetters(firstName)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('first name must contain only hebrew or english letters');
            return;
        }

        // בדיקת שם משפחה
        if (!lastName || typeof lastName !== 'string' || lastName.length < 2 || lastName.length > 50) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('invalid last name');
            return;
        }
        else if (!isOnlyLetters(lastName)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('last name must contain only hebrew or english letters');
            return;
        }


        // בדיקת phone - וודא שהטלפון הוא מחרוזת של מספרים באורך 10
        // הטלפון לא יהיה מסוג מספר כיוון שהוא מתחיל בספרה 0 ולא ניתן לשמור מספר שמתחיל ב 0
        if (!phone || typeof phone !== 'string' || isNaN(phone) || phone.length !== 10) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('invalid phone number');
            return;
        }

        // בדיקת סיסמה
        if (!password || typeof password !== 'string') {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('invalid password');
            return;
        } else if (!isPasswordStrong(password)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('password not strong enough... minimum length 8 chars. contain upper case, lower case, and number or special char');
            return;
        }

        // בדיקת birthdate בפורמט של YYYY-MM-DD
        // משתמש לא חייב להכניס תאריך
        if (!birthdate || birthdate == '') {
            birthdate = null;
        } else {
            if (typeof birthdate !== 'string') {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid birthdate');
                return;
            }
            let dateParts = birthdate.split('-');
            if (dateParts.length !== 3) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid birthdate format');
                return;
            }
            else if (dateParts[0].length !== 4 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid birthdate format');
                return;
            } else if (isNaN(dateParts[0]) || isNaN(dateParts[1]) || isNaN(dateParts[2])) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid birthdate format');
                return;
            }
        }

        // MySQL connection setup
        const connection = mysql.createConnection(dbConnectionDetails);
        // אם כל הבדיקות עוברות, המשך בתהליך
        connection.connect((err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                console.log('err: ', err)
                res.end('oops... could not connect to db');
                return;
            }

            const isExistPhoneQuery = 'SELECT id FROM clients WHERE phone = ? LIMIT 1';
            connection.query(isExistPhoneQuery, [phone], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('err: ', err)
                    res.end('oops... could not check if the phone number exists');
                    connection.end();
                    return;
                }
                if (result.length > 0) {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    console.log('oops... phone number already exists')
                    res.end('oops... phone number already exists');
                    connection.end();
                    return;
                }
                else {
                    const newUserQuery = 'INSERT  INTO restaurant_database.clients(first_name, last_name, phone, password, birthdate) VALUES(?,?,?,?,?)';
                    connection.query(newUserQuery, [firstName, lastName, phone, password, birthdate], (err, result) => {
                        if (err) {
                            if (err.errno == 1452) {
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                console.log('err: ', err)
                                res.end('oops... Error 1452: Foreign key constraint failed. Ensure the referenced record exists in the parent table before inserting or updating.'); // שגיאה בהשמה בתוך mysql
                                connection.end();
                                return;
                            } else if (err.errno == 1292) {
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                console.log('err: ', err)
                                res.end('oops... Error 1292: Invalid date or time format. Please ensure the values follow the correct format (e.g., "YYYY-MM-DD" for DATE).'); // שגיאה בהשמה בתוך mysql בהתייחס לתאריך
                                connection.end();
                                return;
                            } else {
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                console.log('err: ', err)
                                res.end('oops... could not insert new client to clients');
                                connection.end();
                                return;
                            }
                        }
                        if (result.affectedRows == 1) {
                            connection.end();
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end('client inserted successfully');
                            console.log("result signUp: ", result);
                            return;
                        }
                        connection.end();
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        console.log('err: ', err)
                        res.end('oops... could not insert new client to clients');
                        return;
                    })
                }
            })
        })
    });
};

exports.logIn = (req, res, q) => {
    if (req.method != "POST") {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('oops... expected POST request');
        return;
    }
    let bodyString = '';
    req.on('data', chunk => {
        bodyString += chunk;
    });
    req.on('end', () => {
        // על מנת למנוע קריסה של השרת - רק אם הגוף מסוג ג'ייסון נמשיך
        let userIdentifiers = undefined;
        try {
            userIdentifiers = JSON.parse(bodyString);
        } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('not a valid JSON');
            return;
        }
        let phone = userIdentifiers.phone;
        let password = userIdentifiers.password;

        // MySQL connection setup
        const connection = mysql.createConnection(dbConnectionDetails);
        connection.connect((err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                console.log('err: ', err)
                res.end('oops... could not connect to db');
                return;
            }

            // Query to fetch dishes
            const findExistUserQuery = 'SELECT * FROM restaurant_database.clients WHERE phone = ?';

            // Execute submenu query
            connection.query(findExistUserQuery, [phone], (err, result) => {
                if (err) {
                    if (err.errno == 1054) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        console.log('err: ', err)
                        res.end('oops... error 1054: Unknown column.');
                        connection.end();
                        return;
                    }
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('err: ', err)
                    res.end('oops... Database query error');
                    connection.end();
                    return;
                }
                if (result.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'text/plain' });
                    res.end('oops... 401 Unauthorized... User not found');
                    connection.end();
                    return;
                }
                else if (result[0].password != password) {
                    res.writeHead(410, { 'Content-Type': 'text/plain' });
                    console.log('Incorrect password for user with phone: ', phone);
                    res.end('oops... 401 Unauthorized... incorrect password');
                    connection.end();
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log('User varified successfully');
                res.end(JSON.stringify({
                    "firstName": result[0].first_name,
                    "lastName": result[0].last_name,
                    "phone": result[0].phone,
                    "id": result[0].id
                }));
                connection.end();
            });
        })
    })
};

exports.logOut = (req, res, q) => {

};

exports.getFullMenu = (req, res, q) => {
    // MySQL connection setup
    const connection = mysql.createConnection(dbConnectionDetails);
    connection.connect((err) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            console.log('connection error: ', err)
            res.end('oops... could not connect to db');
            return;
        }

        // שאילתת תפריטים
        const submenuQuery = 'SELECT menus.id AS id, menus.title AS title, menus.description AS description FROM restaurant_database.menus';

        // שאילתת מנות
        const dishesQuery = "SELECT items.id, items.menu_id, items.title AS title, items.description AS description, items.price AS price, items.image_url AS image_url FROM items WHERE items.avilability = 'available'";

        // ביצוע השאילתות
        connection.query(submenuQuery, (err, submenuResults) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                console.log('err: ', err)
                res.end('oops... could not get menus table from db');
                connection.end();
                return;
            }

            // בדיקת תפריטים ריקים
            if (submenuResults.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('oops... no menus found');
                connection.end();
                return;
            }

            connection.query(dishesQuery, (err, dishesResults) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('err: ', err)
                    res.end('oops... could not get items table from db');
                    connection.end();
                    return;
                }

                // יצירת מבנה תפריט
                const fullMenu = submenuResults.map(submenu => {
                    // מציאת כל המנות המתאימות לתפריט הנוכחי על פי מספר מזהה מנה
                    const dishes = dishesResults.filter(dish => dish.menu_id === submenu.id);

                    // יצירת אובייקט עבור כל תפריט עם המנות שלו
                    return {
                        subMenu: submenu,  // אובייקט התפריט המקורי
                        items: dishes // מערך המנות התואמות
                    };
                });

                // Return the structured data
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(fullMenu));
                connection.end();
            });
        });
    });
};

exports.getClickedItem = (req, res, q) => {

    // קבלת ובדיקת תקינות ID
    const itemId = q.query.id;
    if (!itemId || isNaN(itemId)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('id is not a valid number');
        return;
    }

    const connection = mysql.createConnection(dbConnectionDetails);

    // שאילתת כותרות שינוייים
    const optionTitlesQuery = 'SELECT option_titles.id AS optionTitleId, option_titles.title AS optionTitle FROM item_options JOIN option_titles ON item_options.option_title_id = option_titles.id WHERE item_options.item_id =?';

    // שאילתת אפשרויות שינויים
    const subOptionsQuery = "SELECT option_title_id AS optionTitleId, title AS optionTitle, extra_price AS extraPrice, is_checked AS isChecked, is_multiple AS isMultiple FROM option_collections WHERE option_title_id IN (SELECT option_title_id FROM item_options WHERE item_id =?)";

    // ביצוע השאילתות
    connection.query(optionTitlesQuery, [itemId], (err, optionTitlesResult) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            console.log('err: ', err)
            res.end('oops... error retrieving option titles from database');
            connection.end();
            return;
        }

        // בדיקה אם אין כותרות שינויים
        if (optionTitlesResult.length === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            console.log('no options for this item')
            res.end(JSON.stringify([]));
            connection.end();
        }
        else {
            connection.query(subOptionsQuery, [itemId], (err, subOptionsResult) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('err: ', err)
                    res.end('oops... error retrieving option collections from database');
                    connection.end();
                    return;
                }

                // יצירת מבנה שינויים אפשריים
                const options = optionTitlesResult.map(optionTitleObj => {
                    const subOptions = subOptionsResult.filter(subOption =>
                        subOption.optionTitleId === optionTitleObj.optionTitleId
                    )
                    // יצירת אובייקט עבור כל שינוי עם האפשרויות שלו
                    return {
                        title: optionTitleObj.optionTitle, // כותרת שינוי
                        optionCollection: subOptions // מערך האפשרויות של אותו שינוי
                    }
                });
                // Return the structured data
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log('clicked item: ', JSON.stringify(options))
                res.end(JSON.stringify(options));
                connection.end();
            });
        }

    });
};

exports.sendOrder = (req, res, q) => {
    if (req.method != "POST") {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('oops... expected POST request');
        return;
    }

    let bodyString = '';
    let clientId = 0;
    let items = [];

    req.on('data', chunk => {
        bodyString += chunk;
    });

    req.on('end', () => {
        console.log("data sendOrderBody", JSON.parse(bodyString));
        // על מנת למנוע קריסה של השרת - רק אם הגוף מסוג ג'ייסון נמשיך
        let newOrder = undefined;
        try {
            newOrder = JSON.parse(bodyString);
        } catch {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('not a valid JSON');
            return;
        }
        clientId = newOrder.clientId;
        items = newOrder.items;

        console.log("clientId: ", clientId);
        console.log("items: ", items);

        if (clientId < 1 || items.length == 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('erroe... missing client ID or items in the order');
            return;
        }

        const connection = mysql.createConnection(dbConnectionDetails);

        const insertOrderQuery = "INSERT INTO orders (client_id, order_date) VALUES (?, NOW())";

        connection.query(insertOrderQuery, [clientId], (err, result) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                console.log('err: ', err)
                res.end('oops... database error while inserting order');
                connection.end();
                return;
            }

            console.log("result send order: ", result);

            const orderId = result.insertId;

            const values = items.map(item => [
                orderId,                       // order_id
                item.item.id,                  // item_id
                item.quantity,                 // quantity
                JSON.stringify(item.options.map(opt => {
                    return {
                        title: opt.title,
                        chosenChanges: opt.optionCollection
                            .filter(option => option.isChecked === 1)
                            .map(option => option.optionTitle)
                    };
                })),  // notes
                item.newPrice                  // total_item_price
            ]);

            const insertItemsQuery = "INSERT INTO order_items (order_id, item_id, quantity, notes, total_item_price) VALUES ?";

            connection.query(insertItemsQuery, [values], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    console.log('err: ', err)
                    res.end('oops... database error while inserting order items');
                    connection.end();
                    return;
                }
                console.log("All items inserted successfully");

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("order completed successfully");
                connection.end();
            });
        });
    })
}; 