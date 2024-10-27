import React, { useState } from 'react'
import FullMenu from './FullMenu';
import OrderSummary from './Summary';
import AddToOrder from './AddToOrder.jsx';
import ConfirmSendOrder from './ConfirmSendOrder.jsx';
import LogIn from './LogIn.jsx';
import { useItemContext } from './EditedItemContext.jsx';

export default function OrderOnline() {

    const { setItemState, resetEditItemState } = useItemContext();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(0);

    function setUserData(data) {
        setUser(JSON.parse(data))
    }

    const [showOrderSummary, setshowOrderSummary] = useState(false)

    const [openAddToCart, setOpenAddToCart] = useState(false);

    const [openConfirmSendOrder, setOpenConfirmSendOrder] = useState(false);

    function menuLoadedSuccessfully() {
        setshowOrderSummary(true)
    }

    const openAdd = (item, menuTitle, options, quantity, isEditMode, indexInCart, newPrice) => {
        setItemState({
            item: item,
            menuTitle: menuTitle,
            options: options,
            quantity: quantity,
            isEditMode: isEditMode,
            indexInCart: isEditMode === true ? indexInCart : -1,
            newPrice: !isNaN(newPrice) && newPrice > -1 ? newPrice : item.price
        })
        setOpenAddToCart(true);
    }

    const closeAdd = () => {
        resetEditItemState()
        setOpenAddToCart(false);
    }

    const openSendOrder = () => {
        setOpenConfirmSendOrder(true)
    }

    const closeSendOrder = () => {
        setOpenConfirmSendOrder(false)
    }

    return (
        <>
            {!isLoggedIn ? (
                <LogIn setUserData={setUserData} close={() => { setIsLoggedIn(true); }} />
            ) : (
                <>                    
                    <div style={{
                        width: "100%", height: "92px", backgroundColor: "rgb(48, 15, 0)", borderRadius: "0px", display: "flex", justifyContent: "right", alignItems: "center"
                    }}> <img src="/images/iconLogo.png" style={{ width: "72px" , marginRight:"48px"}} alt="logo" />
                    <span style={{color:"rgb(255, 200, 200)", marginRight:"20px"}} className='subTitle'>שלום {user.firstName}!</span>
                    </div>

                    <div id='order_online' className="horizontal_container section">
                        <FullMenu open={openAdd} close={closeAdd} menuLoadedSuccessfully={menuLoadedSuccessfully} />
                        {showOrderSummary && <OrderSummary open={openAdd} close={closeAdd} openSendOrder={openSendOrder} />}
                    </div>

                    {!isLoggedIn && <LogIn close={() => { setIsLoggedIn(true); }} />}

                    {openAddToCart && <AddToOrder close={closeAdd} />}

                    {openConfirmSendOrder && <ConfirmSendOrder userId={user.id} back={closeSendOrder} />}
                </>
            )}
        </>
    );
}