import './familymember.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../hooks/SessionStorage/useSessionStorage';
import Loading from 'react-loading';
import axios from 'axios';
import familyMemberGiftList from './FamilyMemberGiftList/familymembergiftlist';

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
    const [familyMemberGifts, setFamilyMemberGifts] = useState([]); 
    const [sortedFamilyMemberGifts, setSortedFamilyMemberGifts] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
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
        const retrieveGiftsAndSort = async () => {
            await retrieveFamilyMemberGifts(userId);
            sortUserGifts();
            setLoading(false);
        }
        retrieveGiftsAndSort();
    }, [userId])

    useEffect(() => {
        setLoading(true);
        const retrieveSelectedUser = async() => {
            await retrieveSelectedUserData(userId);
            setLoading(false);
        }
        retrieveSelectedUser();
    }, [userId])

    const retrieveSelectedUserData = async (userId: string) => {
        try {
            const response = await axios.get(`${API_URL}users/${userId}`);
            setSelectedUser(response.data);
        } catch(error) {
            console.error(`There was an error retrieving the family member's data`, error);
            setErrorMessage('This family member was not found.');
        }
    }

    const retrieveFamilyMemberGifts = async (userId: string) => {
        try {
            const response = await axios.get(`${API_URL}gifts/gifts/user/${userId}`);
            setFamilyMemberGifts(response.data); 
        } catch (error) {
            console.error(`There was an error retrieving the family member's gifts`, error);
            setErrorMessage('This family member has not added any gifts yet!');
        }
    }

    const sortUserGifts = () => {
        if (familyMemberGifts) {
            setLoading(true); // Start loading
    
            const sortedGifts = [...familyMemberGifts].sort((a, b) => {
                return b.priority - a.priority; // Sorting by priority
            });
    
            setSortedFamilyMemberGifts(sortedGifts);
    
            setLoading(false); // End loading
        }
    };
    
    const markAsBought = async (giftId: string, purchasedStatus: boolean) => {
        try {
            const response = await axios.put(`${API_URL}gifts/${giftId}`, {
                purchased: purchasedStatus
            });
    
            if (response.status === 200 || response.status === 201) {
                console.log("Gift purchase status updated successfully.");
    
                // Update the state to reflect the change
                const updatedGifts = familyMemberGifts.map(gift => {
                    if (gift.id === giftId) {
                        return { ...gift, purchased: purchasedStatus };
                    }
                    return gift;
                });
    
                setFamilyMemberGifts(updatedGifts);
    
                // Re-sort gifts after updating the state
                sortUserGifts();
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
                        {familyMemberGifts.length > 0 ? (
                            familyMemberGifts.map(gift => (
                                <div 
                                    className={`user-gift-item ${gift.purchased ? "user-gift-item-disabled" : ""}`}
                                    key={gift.id}
                                >
                                    <div className="item-top-container">
                                        <img src={gift.picture} className="user-gift-item-image" alt={gift.title} />
                    
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
                                    <button 
                                        className={`purchased-button ${gift.purchased ? "unmark-button" : ""}`}
                                        onClick={() => markAsBought(gift.id, !gift.purchased)}
                                    >
                                        {gift.purchased ? 'Mark not purchased' : 'Mark as purchased'}
                                    </button>
                                    <button 
                                        className="go-to-button" 
                                        onClick={() => window.open(gift.link, '_blank')}
                                    >
                                        Go to item
                                    </button>
                                </div>
                            ))
                        ) : (
                            <h3>This user has not added any gifts.</h3>
                        )} 
                    </div>
                </div>
            )}
        </>
    );
};

export default FamilyMember;