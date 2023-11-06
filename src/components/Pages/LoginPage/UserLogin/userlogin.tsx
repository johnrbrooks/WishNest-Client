import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from 'react-loading';


type UserLoginForm = {
    email: string,
    userPassword: string,
}

type UserLoginPayload = UserLoginForm & {
    family_id: string;
};

type LoginResponse = {
    user: User,
    token: string;
}

const UserLogin = () => {

    const { currentFamily, setCurrentUser, token, setToken } = useAuth();

    const initialUserState: UserLoginForm = {
        email: '',
        userPassword: '',
    };

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const[userLoginData, setUserLoginData] = useState(initialUserState);
    const[userLoginErrorMessage, setUserLoginErrorMessage] = useState('');
    const[loading, setLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserLoginErrorMessage('');
        const { name, value } = event.target;
        setUserLoginData(prevState => ({ ...prevState, [name]: value }));
    }

    const validateLoginForm = (): boolean => {
        if(userLoginData.email !== '' && userLoginData.userPassword !== '') {
            return true;
        } else {
            return false;
        }
    }

    const checkLoginCredentials = async (): Promise<LoginResponse | null> => {
        try {
            const payload: UserLoginPayload = {
                ...userLoginData,
                family_id: currentFamily.id
            }
            const response = await axios.post(`${API_URL}users/login`, payload);
            if(response && response.data) {
                console.log(response.data);
                return {
                    user: {
                        id: response.data.user.id,
                        firstName: response.data.user.firstName,
                        email: response.data.user.email,
                        family_id: response.data.user.family_id,
                    }, 
                    token: response.data.token
                }
            } else {
                setUserLoginErrorMessage('An error occurred. Please try again.');
                return null;
            }
            
        } catch(error) {
            console.error("There was an error checking the credentials: ", error);
            return null;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isFormValid = validateLoginForm();
        if(!isFormValid) {
            setLoading(false);
            setUserLoginErrorMessage('You must input your user email and password.');
            return;
        }

        const userData = await checkLoginCredentials();
        if(userData) {
            const { user, token } = userData;

            sessionStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.setItem('token', token);

            setLoading(false);
            setCurrentUser(user);
            setToken(token);
            console.log('Login was successful!');
            navigate('/dashboard');
        } else {
            setLoading(false);
            setUserLoginErrorMessage('Email or password incorrect.');
        }
    }

    return (
        <>
            <div className="landing-page">
                <div className="family-login-container">
                    <h2 className='logo-title'>WishNest</h2>
                    <h3>User Login</h3>
                    <form action="" onSubmit={(handleSubmit)}>
                        <label htmlFor="">Family Name:</label>
                        <input type="text" name="familyName" value={currentFamily.familyName} readOnly/>
                        <label htmlFor="">Email:</label>
                        <input type="text" name="email" value={userLoginData.email} onChange={handleInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" className="family-password" name="userPassword" value={userLoginData.userPassword} onChange={handleInputChange}/>
                        <p className="forgot-password">Forgot Password?</p>
                        {userLoginErrorMessage && <p className="error-message">{userLoginErrorMessage}</p>}
                        <button type="submit" className="primary login-btn">
                            {loading ? <Loading type={"spin"} color={"#FFFFFF"} height={25} width={25} /> : 'Log in'}
                        </button>
                        <p>Haven't added your user yet?</p>
                        <button className="secondary" onClick={() => navigate('/family/signup')}>Create User</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserLogin;