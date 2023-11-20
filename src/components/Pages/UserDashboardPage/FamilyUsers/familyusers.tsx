import './familyusers.scss';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSessionStorage from '../../../../hooks/SessionStorage/useSessionStorage';
import Loading from 'react-loading';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiRefreshCw } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import AddUser from '../FamilyUsers/AddUser/adduser';

type Gift = {
    id: string,
    title: string,
    picture: string,
    description: string,
    link: string,
    purchased: boolean,
    user_id: string
};

type User = {
    id: string,
    firstName: string,
    email: string,
    gifts?: Gift[];
    family_id: string
}

const FamilyUserList = () => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const [usersWithGifts, setUsersWithGifts] = useState<User[]>([]);
    const [isAddUser, setIsAddUser] = useState(false);
    const [loading, setLoading] = useState(false); 

    const { resetContextFromStorage } = useSessionStorage();

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if(!currentUser || !currentFamily || !token) {
            resetContextFromStorage();
        }
        setLoading(false); // Set loading to false once done
    }, [currentFamily, currentUser, token]);

    useEffect(() => {
        fetchFamilyUsersAndTheirGifts();
    }, []);

    const fetchFamilyUsersAndTheirGifts = useCallback(async () => {
        setLoading(true);
        const users = await retrieveFamilyUsers();
        const filteredUsers = users?.filter((user) => user.email !== currentUser?.email)
        const usersData: User[] = [];
        
        if (filteredUsers) {
            for (const user of filteredUsers) {
                const gifts = await retrieveUserGifts(user.id);
                usersData.push({...user, gifts});
            }
            setUsersWithGifts(usersData);
        }
        setLoading(false);
    }, [currentFamily?.id]);
    
    const retrieveFamilyUsers = async (): Promise<User[] | null> => {
        try {
            const response = await axios.get(`${API_URL}users/family/${currentFamily?.id}`);
            return response.data;
        } catch (error) {
            console.error("There was an error retrieving the users ", error);
            return null;
        }
    };
    
    const retrieveUserGifts = async (userId: string): Promise<Gift[]> => {
        try {
            const response = await axios.get(`${API_URL}gifts/gifts/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`There was an error retrieving the gifts for user ${userId} `, error);
            return [];
        }
    };

    return (
        <>
            {loading ? (
                <div className="family-user-list-container">
                    <h3>Family User List</h3>
                    <Loading type={"spin"} color="#FFFFFF" height={250} width={250} />
                </div>
                
            ) : isAddUser ? (
                <div className="add-user-container">
                    <AddUser isAddUser={isAddUser} setIsAddUser={setIsAddUser} onUserAdded={fetchFamilyUsersAndTheirGifts}/>
                </div>
            ) : (
                <div className="family-user-list-container">
                    <div className="title-container">
                        <h3 className="family-users-title">Family User List</h3>
                        <AiOutlinePlus 
                            className="add-user-icon"
                            onClick={() => {setIsAddUser(true)}}
                        />
                    </div>
                    {usersWithGifts?.map((user) => (
                        <div className="user-item-container" key={user.id} onClick={() => navigate(`users/${user.id}`)}>
                            <h3 className="user-list-name">{user.firstName}</h3>
                            <h3 className="user-list-name">{user.gifts?.length}</h3>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default FamilyUserList;