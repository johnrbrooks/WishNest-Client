import './familylogin.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext';
import axios from 'axios';
import Loading from 'react-loading';

type FamilyLoginForm = {
    familyName: string,
    familyPassword: string,
}

const FamilyLogin = () => {

    const { currentFamily, setCurrentFamily } = useAuth();

    useEffect(() => {
        console.log('currentFamily has been updated:', currentFamily);
    }, [currentFamily]);

    const initialFamilyState: FamilyLoginForm = {
        familyName: '',
        familyPassword: '',
    };

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const[familyLoginData, setFamilyLoginData] = useState(initialFamilyState);
    const[familyLoginErrorMessage, setFamilyLoginErrorMessage] = useState('');
    const[loading, setLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyLoginErrorMessage('');
        const { name, value } = event.target;
        setFamilyLoginData(prevState => ({ ...prevState, [name]: value }));
    }

    const validateLoginForm = (): boolean => {
        if(familyLoginData.familyName !== '' && familyLoginData.familyPassword !== '') {
            return true;
        } else {
            return false;
        }
    }

    const checkLoginCredentials = async (): Promise<Family | null> => {
        try {
            const response = await axios.post(`${API_URL}families/login`, familyLoginData);
            if(response && response.data) {
                return {
                    id: response.data.id,
                    familyName: response.data.familyName,
                };
            } else {
                setFamilyLoginErrorMessage('An error occurred. Please try again.');
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
            setFamilyLoginErrorMessage('You must input your family name and password.');
            return;
        }

        const familyData = await checkLoginCredentials();
        if(familyData) {
            setLoading(false);
            setCurrentFamily(familyData);
            console.log('Login was successful!');
        } else {
            setLoading(false);
            setFamilyLoginErrorMessage('Family name or password incorrect.');
        }
    }


    return (
        <>
            <div className="landing-page">
                <div className="family-login-container">
                    <h2 className='logo-title'>WishNest</h2>
                    <h3>Family Login</h3>
                    <form action="" onSubmit={(handleSubmit)}>
                        <label htmlFor="">Family Name:</label>
                        <input type="text" name="familyName" value={familyLoginData.familyName} onChange={handleInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" className="family-password" name="familyPassword" value={familyLoginData.familyPassword} onChange={handleInputChange}/>
                        <p className="forgot-password">Forgot Password?</p>
                        {familyLoginErrorMessage && <p className="error-message">{familyLoginErrorMessage}</p>}
                        <button type="submit" className="primary login-btn">
                            {loading ? <Loading type={"spin"} color={"#FFFFFF"} height={25} width={25} /> : 'Log in'}
                        </button>
                        <p>Haven't added your family yet?</p>
                        <button className="secondary" onClick={() => navigate('/family/signup')}>Create Family</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FamilyLogin;