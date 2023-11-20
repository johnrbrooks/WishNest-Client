import './userdashboardlanding.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import useSessionStorage from '../../../../hooks/SessionStorage/useSessionStorage';
import Loading from 'react-loading';
import FamilyGiftList from '../FamilyUserGiftList/familyusergiftlist';
import FamilyUserList from '../FamilyUsers/familyusers';

const UserDashboardLanding = () => {

    const { currentFamily, setCurrentFamily, currentUser, setCurrentUser, token, setToken } = useAuth();
    const [loading, setLoading] = useState(true); 

    const { resetContextFromStorage } = useSessionStorage();

    useEffect(() => {
        if(!currentUser || !currentFamily || !token) {
            resetContextFromStorage();
        }
        setLoading(false); // Set loading to false once done
    }, [currentFamily, currentUser, token]);

    if(loading) {
        return <Loading type={"spin"} color="#000000" height={667} width={375} />;
    }

    return (
        <><div className="dashboard-page">
            <div className="dashboard-titles">
                <h1>Welcome to WishNest {currentUser.firstName}!</h1>
            </div>
            <div className="user-list-container">
                <FamilyUserList />
            </div>
        </div>
        </>
    )
}

export default UserDashboardLanding;