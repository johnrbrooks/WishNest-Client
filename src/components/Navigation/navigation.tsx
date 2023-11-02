import './navigation.scss';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <>
            <nav>
                <h1>WishNest</h1>
                <div className="links-container">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="signin">Sign In</Link>
                </div>
            </nav>
        </>
    )
}

export default Navigation;