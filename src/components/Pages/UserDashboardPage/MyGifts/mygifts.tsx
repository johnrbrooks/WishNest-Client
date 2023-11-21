import './mygifts.scss';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../hooks/SessionStorage/useSessionStorage';
import AddGift from '../MyGifts/AddGift/addgift';
import MyGiftList from '../MyGifts/MyGiftList/mygiftlist';


const MyGifts = () => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const { resetContextFromStorage } = useSessionStorage();

    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <> 
            <div className="my-gifts-page-container">
                <MyGiftList />
                <AddGift />
            </div>
        </>
    )
}

export default MyGifts;