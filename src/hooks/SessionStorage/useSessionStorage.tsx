import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

const useSessionStorage = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setCurrentFamily, setToken } = useAuth();

    const getItemFromSessionStorage = (key: string) => {
        const value = sessionStorage.getItem(key);
        if (!value) return null;
    
        // Avoid parsing if the key is 'token' since it's not a JSON string
        if (key === 'token') return value;
    
        try {
            return JSON.parse(value);
        } catch (error) {
            console.error("Error parsing session storage item: ", key, error);
            return null;
        }
    };

    const resetContextFromStorage = () => {
        const storedUser = getItemFromSessionStorage('currentUser');
        const storedFamily = getItemFromSessionStorage('currentFamily');
        const storedToken = getItemFromSessionStorage('token');

        if(storedUser) setCurrentUser(storedUser);
        if(storedFamily) setCurrentFamily(storedFamily);
        if(storedToken) setToken(storedToken);

        // If any of these is missing, redirect to /signin
        if(!storedUser || !storedFamily || !storedToken) {
            navigate('/signin');
        }
    };

    return { resetContextFromStorage };
};

export default useSessionStorage;