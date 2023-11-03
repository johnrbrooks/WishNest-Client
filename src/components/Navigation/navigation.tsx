import './navigation.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navigation = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <>
            <nav>
                <h1>WishNest</h1>
                <div className="links-container">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    {isLoggedIn? (<Link to="signin">Log Out</Link>) : (<Link to="signin">Sign In</Link>)}
                </div>
            </nav>
        </>
    )
}

export default Navigation;