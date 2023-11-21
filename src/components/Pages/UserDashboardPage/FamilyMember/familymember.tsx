import './familymember.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../hooks/SessionStorage/useSessionStorage';
import Loading from 'react-loading';
import axios from 'axios';

type User = {
    id: string,
    firstName: string,
    email: string,
    gifts?: Gift[];
    family_id: string
}

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

const FamilyMember = () => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(); 
    const [selectedUserGifts, setSelectedUserGifts] = useState<Gift[] | undefined>();
    const [sortedSelectedUserGifts, setSortedSelectedUserGifts] = useState<Gift[] | undefined>();
    const [errorMessage, setErrorMessage] = useState('');

    const { resetContextFromStorage } = useSessionStorage();

    const API_URL = import.meta.env.VITE_API_URL;

    const { userId } = useParams();
    
    useEffect(() => {
        if(!currentUser || !currentFamily || !token) {
            resetContextFromStorage();
        }
        setLoading(false); 
    }, [currentFamily, currentUser, token]);

    useEffect(() => {
        setLoading(true);
        getUser();
        getUserGifts();
        sortUserGifts();
        setLoading(false);
    }, [userId])

    const getUser = async ():  Promise<User | null> => {
        try {
            const response = await axios.get(`${API_URL}users/${userId}`);
            if(response.status === 200 || response.status === 201) {
                setSelectedUser(response.data);
            }
            return response.data;
        } catch (error) {
            console.error(`There was an error retrieving the user's data.`);
            setErrorMessage(`There was an error retrieving the user's data.`);
            return null;
        }
    }

    const getUserGifts = async (): Promise<Gift | null> => {
        try {
            const response = await axios.get(`${API_URL}gifts/gifts/user/${userId}`);
            if(response.status === 200 || response.status === 201) {
                setSelectedUserGifts(response.data || []);
            }
            return response.data;
        } catch (error) {
            console.error(`There was an error retrieving the user's gifts.`);
            setErrorMessage(`There was an error retrieving the user's gifts.`);
            return null;
        }
    }

    const sortUserGifts = () => {
        if (selectedUserGifts) {
            const sortedGifts = [...selectedUserGifts].sort((a, b) => {
                // First, sort by the 'purchased' status
                if (a.purchased && !b.purchased) {
                    return 1; // a is purchased, b is not, a goes after b
                } else if (!a.purchased && b.purchased) {
                    return -1; // a is not purchased, b is, a goes before b
                } else {
                    // If both have the same 'purchased' status, sort by 'priority'
                    return a.priority - b.priority;
                }
            });
            setSortedSelectedUserGifts(sortedGifts);
            setLoading(false);
        }
    }

    const markAsBought = async (giftId: string, purchasedStatus: boolean) => {
        try {
            const response = await axios.put(`${API_URL}gifts/${giftId}`, {
                purchased: purchasedStatus
            });
            if (response.status === 200 || response.status === 201) {
                console.log("Gift purchase status updated successfully.");
                // Refresh the gifts list here
                getUserGifts().then(() => sortUserGifts());
            } else {
                console.error("Failed to update gift purchase status.");
            }
        } catch (error) {
            console.error("Error in updating gift purchase status: ", error);
        }
    };

    return (
        <>
            {loading ? (
                <div className="family-user-list-container">
                    <h3>User Gift List</h3>
                    <Loading type={"spin"} color="#FFFFFF" height={250} width={250} />
                </div>
            ) : (
                <div className="gift-list-container">
                    <h1 className="user-gift-list-header">{selectedUser?.firstName}'s Gift List</h1>
                    <div className="gift-items-container">
                        {sortedSelectedUserGifts && sortedSelectedUserGifts.length > 0 ? (sortedSelectedUserGifts?.map(gift =>
                            <div 
                            className={`user-gift-item ${gift.purchased ? "user-gift-item-disabled" : ""}`}
                            key={gift.id}
                            >
                    
                            <div className="item-top-container">
                                <img src={gift.picture} className="user-gift-item-image" alt="" />
                    
                                <div className="item-info-container">
                                    <h2 className="gift-item-title">{gift.title}</h2>
                                    <div className="price-priority-container">
                                        <h3 className="gift-item-price">Price: ${gift.price}</h3>
                                        <h3 className="gift-item-priority">Priority: {gift.priority}</h3>
                                    </div>
                                </div>
                            </div>
                    
                            <p className="gift-item-description-title">Description:</p>
                            <p className="gift-item-description">{gift.description}</p>
                            <button className={`purchased-button ${gift.purchased ? "unmark-button" : ""}`}
                                onClick={() => markAsBought(gift.id, !gift.purchased)}>
                                    {gift.purchased ? 'Mark not purchased' : 'Mark as purchased'}
                            </button>
                            <button className="go-to-button" onClick={() => window.open(gift.link, '_blank')}>Go to item</button>
                        </div>
                        )) : (
                            <h3>This user has not added any gifts.</h3>
                        )} 
                    </div>
                </div>
            )}
        </>
    )
}

export default FamilyMember;