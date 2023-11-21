import './mygiftlist.scss';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../../hooks/SessionStorage/useSessionStorage';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import Loading from 'react-loading';

type Gift = {
    id: string,
    title: string,
    picture: string,
    description: string,
    link: string,
    purchased: boolean,
    user_id: string,
    price: number,
    priority: number,
}

const MyGiftList = () => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const { resetContextFromStorage } = useSessionStorage();

    const API_URL = import.meta.env.VITE_API_URL;

    const [userGifts, setUserGifts] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserGifts = async() => {
            try{
                const response = await axios.get(`${API_URL}gifts/gifts/user/${currentUser?.id}`);
                if(response.status === 200 || response.status === 201) {
                    setUserGifts(response.data);
                }
            } catch (error) {
                console.error(`There was an error retrieving the user's gifts.`);
                setErrorMessage(`There was an error retrieving the user's gifts.`);
            }
        }
        fetchUserGifts();
    }, [currentUser])

    const handleEdit = () => {
        console.log('This will allow the user to edit the gift.')
    }

    const handleDelete = () => {
        console.log('This will open the delete item modal.')
    }

    return (
        <>
            <div className="my-gift-list-container">
                <h1>My Gift List</h1>
                {userGifts === null || userGifts === undefined ? (
                    <Loading type={"spin"} color="#FFFFFF" height={250} width={250} />
                    ) : userGifts.length > 0 ? (
                    userGifts.map(gift => (
                        <div className="my-gift-list-item" key={gift.id}>
                            <div className="delete-item-container">
                                <IoClose className="delete-gift-item" onClick={handleDelete}/>
                            </div>
                            <div className="my-gift-top-container">
                                <img src={gift.picture} className="my-gift-item-image" alt="" />
                    
                                <div className="my-gift-info-container">
                                    <h2 className="my-gift-item-title">{gift.title}</h2>
                                    <div className="gift-details-container">
                                        <h3 className="my-gift-item-info">Price: ${gift.price}</h3>
                                        <h3 className="my-gift-item-info">Priority: {gift.priority}</h3>
                                        <a className="my-gift-item-link" href={gift.link}>Link</a>
                                    </div>
                                </div>
                            </div>
                            <div className="description-container">
                                <h3>Description:</h3>
                                <p>{gift.description}</p>
                            </div>
                            <button className="primary edit-gift-button" onClick={handleEdit}>Edit Gift</button>
                        </div>
                    ))
                ) : (
                    <p>You have not added any gifts yet!</p>
                )}
            </div>
        </>
    );
}

export default MyGiftList;