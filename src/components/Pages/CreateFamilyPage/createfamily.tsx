import './createfamily.scss';
import { useNavigate } from 'react-router-dom';

const CreateFamily = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="landing-page">
                <div className="family-creation-container">
                    <h2 className='logo-title'>WishNest</h2>
                    <h3>Create Family</h3>
                    <form action="">
                        <label htmlFor="">Family Name:</label>
                        <input type="text" />
                        <label htmlFor="">Password:</label>
                        <input type="password" />
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" />
                        <h3 className="family-creation-cta">Please create a primary user</h3>
                        <label htmlFor="">Name:</label>
                        <input type="text" />
                        <label htmlFor="">Email:</label>
                        <input type="text" />
                        <label htmlFor="">Password:</label>
                        <input type="password" />
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" />
                        <button type="submit" className="primary login-btn">Sign Up</button>
                        <p>Already have an account?</p>
                        <button className="secondary" onClick={() => navigate('/signin')}>Back to log in</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateFamily;