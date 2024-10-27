let server = require('./server.js');
let api = require('./api.js');
let actions = {
    "/sign_up": api.signUp,
    "/log_in": api.logIn,
    "/log_out": api.logOut,
    "/full_menu": api.getFullMenu,
    "/item": api.getClickedItem,
    "/send_order": api.sendOrder

    // פונקציות עתידיות

    // add_new_item,
    // edit_existed_item,
    // delete_existed_item,

    // add_new_menu,
    // edit_existed_menu,
    // delete_existed_menu,

    // add_new_option,
    // edit_existed_option,
    // delete_existed_option,

    // update_user_information,
    // delete_user_information,
    // get_order_status,
    // get_order_history,
    // proccess_payment ??????????????????
};

server.startServer(actions);