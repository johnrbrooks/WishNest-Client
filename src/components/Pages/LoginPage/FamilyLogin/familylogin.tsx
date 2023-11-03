import './familylogin.scss';
import { useNavigate } from 'react-router-dom';

const FamilyLogin = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="landing-page">
                <div className="family-login-container">
                    <h2 className='logo-title'>WishNest</h2>
                    <h3>Family Login</h3>
                    <form action="">
                        <label htmlFor="">Family Name:</label>
                        <input type="text" />
                        <label htmlFor="">Password:</label>
                        <input type="password" className="family-password" />
                        <p className="forgot-password">Forgot Password?</p>
                        <button type="submit" className="primary login-btn">Log in</button>
                        <p>Haven't added your family yet?</p>
                        <button className="secondary" onClick={() => navigate('/family/signup')}>Create Family</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FamilyLogin;