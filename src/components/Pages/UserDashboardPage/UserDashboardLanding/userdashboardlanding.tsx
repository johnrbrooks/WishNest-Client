import './userdashboardlanding.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';

const UserDashboardLanding = () => {

    const { currentFamily, setCurrentFamily, currentUser, setCurrentUser, token, setToken } = useAuth();

    const navigate = useNavigate();
    
    console.log(currentUser);

    useEffect(() => {
        if(!currentUser || !currentFamily || !token) {
            //get from session storage
            navigate('/signin');
        }
    }, [currentFamily, currentUser, token])

    return (
        <>
            <h1>Welcome to WishNest {currentUser.firstName}!</h1>
            <h2>See your family's gift requests below:</h2>
        </>
    )
}

export default UserDashboardLanding;