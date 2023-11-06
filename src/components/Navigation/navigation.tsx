import './navigation.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import { useState, useEffect } from 'react';

const Navigation = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { currentFamily, setCurrentFamily, currentUser, setCurrentUser, setToken } = useAuth();

    useEffect(() => {
        if(currentFamily || currentUser) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [currentFamily, currentUser])

    const handleLogOut = () => {
        sessionStorage.removeItem('currentFamily');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        setCurrentFamily(null);
        setCurrentUser(null);
        setToken(null);
    }
    
    return (
        <>
            <nav>
                <h1>WishNest</h1>
                <div className="links-container">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    {isLoggedIn? (<Link to="/signin" onClick={handleLogOut}>Log Out</Link>) : (<Link to="/signin">Sign In</Link>)}
                </div>
            </nav>
        </>
    )
}

export default Navigation;