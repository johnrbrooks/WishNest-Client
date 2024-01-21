import './familymember.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../../hooks/SessionStorage/useSessionStorage';
import Loading from 'react-loading';
import axios from 'axios';

const familyMemberGiftList = () => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedUserGifts, setSelectedUserGifts] = useState<Gift[] | undefined>();
    const [sortedSelectedUserGifts, setSortedSelectedUserGifts] = useState<Gift[] | undefined>();

    const { resetContextFromStorage } = useSessionStorage();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if(!currentUser || !currentFamily || !token) {
            resetContextFromStorage();
        }
        setLoading(false); 
    }, [currentFamily, currentUser, token]);

    useEffect(() => {
        setLoading(true);
        console.log('useEffect triggered');
        const getUserGiftsAndSort = async() => {
            await getUser();
            await getUserGifts();
        }
        getUserGiftsAndSort().finally(() => setLoading(false));
    }, [userId])

    const getUserGifts = async () => {
        console.log('Fetching gifts...');
        try {
            const response = await axios.get(`${API_URL}gifts/gifts/user/${userId}`);
            if (response.status === 200 || response.status === 201) {
                const gifts = response.data || [];
                // Perform sorting here
                const sortedGifts = sortUserGifts(gifts);
                // Use a promise to wait for state update
                await new Promise(resolve => {
                    setSelectedUserGifts(sortedGifts);
                    resolve();
                });
            }
        } catch (error) {
            console.error(`There was an error retrieving the user's gifts.`);
            setErrorMessage(`There was an error retrieving the user's gifts.`);
            throw error;
        }
    };

    const sortUserGifts = () => {
        const giftsToSort = selectedUserGifts ?? [];
        const sortedGifts = [...giftsToSort].sort((a, b) => {
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
        console.log('Gifts sorted.');
    };

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
        <h1>Family Member Gift List</h1>
    )
}

export default familyMemberGiftList;