import './createfamily.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loading from 'react-loading';
import axios from 'axios';

type FamilySignupForm = {
    familyName: string,
    familyPassword: string,
    confirmFamilyPassword: string,
}

type UserSignupForm = {
    firstName: string,
    email: string,
    userPassword: string,
    confirmUserPassword: string,
}

const CreateFamily = () => {

    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const[familyErrorMessage, setFamilyErrorMessage] = useState<string>('');
    const[userErrorMessage, setUserErrorMessage] = useState<string>('');
    const[loading, setLoading] = useState(false);

    const initialFamilyState: FamilySignupForm = {
        familyName: '',
        familyPassword: '',
        confirmFamilyPassword: '',
    };

    const[familyData, setFamilyData] = useState(initialFamilyState);

    const initialUserState: UserSignupForm = {
        firstName: '',
        email: '',
        userPassword: '',
        confirmUserPassword: '',
    };

    const[userData, setUserData] = useState(initialUserState);


    const handleFamilyInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFamilyErrorMessage('');
        const { name, value } = event.target;
        setFamilyData(prevState => ({ ...prevState, [name]: value }));
    }

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserErrorMessage('');
        const { name, value } = event.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    }

    const validateFamilyForm = (): boolean => {
        for(const key in familyData) {
            if(familyData[key as keyof FamilySignupForm] === "") {
                setFamilyErrorMessage('All fields are required.');
                return false;
            }
        }
        setUserErrorMessage('');
        return true;
    }

    const validateFamilyPassword = (): boolean => {
        if(familyData.familyPassword === familyData.confirmFamilyPassword){
            return true;
        } else {
            setFamilyErrorMessage(`The passwords don't match!`);
            return false;
        }
    }

    const validateUserForm = (): boolean => {
        for(const key in userData) {
            if(userData[key as keyof UserSignupForm] === "") {
                setUserErrorMessage('All fields are required.');
                return false;
            }
        }
        if(!userData.email.includes('@')) {
            setUserErrorMessage('You must input a valid email address.');
            return false;
        }
        setUserErrorMessage('');
        return true;
    };

    const validateUserPassword = (): boolean => {
        if(userData.userPassword === userData.confirmUserPassword) {
            if(userData.userPassword !== familyData.familyPassword) {
                return true;
            } else {
                setUserErrorMessage('Your password cannot match the family password!');
                return false;
            }
        } else {
            setUserErrorMessage(`The passwords don't match!`);
            return false;
        }
    };

    const createFamily = async (): Promise<string | null> => {
        try {
            const response = await axios.post(`${API_URL}families/`, familyData);
            if(response.status === 200 || response.status === 201) {
                console.log('The family was created!');
                return response.data.id;
            }
        } catch (error: any) {
            console.error('An error occurred: ', error.response?.data || error.message);
            setLoading(false);
        }
        setLoading(false);
        return null;
    }

    const createUserWithFamily = async (family_id: string): Promise<boolean> => {
        const completeUserData = { ...userData, family_id };
        try {
            const response = await axios.post(`${API_URL}users/`, completeUserData);
            if(response.status === 200 || response.status === 201) {
                console.log('The user was created!');
                return true;
            }
        } catch (error: any) {
            console.error('An error occurred: ', error.response?.data || error.message);
            setLoading(false);
        }
        setLoading(false);
        return false;
    }

    const handleCreation = async() => {
        const familyId = await createFamily();
        if(familyId) {
            const userCreated = await createUserWithFamily(familyId);
            if(userCreated) {
                console.log('Family and user successfully created!');
                navigate('/signin');
                setLoading(false);
            } else {
                console.error('Failed to create user after family was successfully created.');
                setLoading(false);
            }
        } else {
            console.error('Failed to create family.');
            setLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isFamilyInputValid = validateFamilyForm();
        if(!isFamilyInputValid) {setLoading(false); return;}
        const isFamilyPasswordValid = validateFamilyPassword();
        if(!isFamilyPasswordValid) {setLoading(false); return;}
        const isUserValid = validateUserForm();
        if(!isUserValid) {setLoading(false); return;}
        const isUserPasswordValid = validateUserPassword();
        if(!isUserPasswordValid) {setLoading(false); return;}

        handleCreation();
    }

    return (
        <>
            <div className="landing-page">
                <div className="family-creation-container">
                    <h2 className='logo-title'>WishNest</h2>
                    <h3>Create Family</h3>
                    <form action="" onSubmit={handleSubmit}>
                        <label htmlFor="">Family Name:</label>
                        <input type="text" name="familyName" value={familyData.familyName} onChange={handleFamilyInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" name="familyPassword" value={familyData.familyPassword} onChange={handleFamilyInputChange}/>
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" name="confirmFamilyPassword" value={familyData.confirmFamilyPassword} onChange={handleFamilyInputChange}/>
                        {familyErrorMessage && <p className="error-message">{familyErrorMessage}</p>}

                        <h3 className="family-creation-cta">Please create a primary user</h3>

                        <label htmlFor="">Name:</label>
                        <input type="text" name="firstName" value={userData.firstName} onChange={handleUserInputChange}/>
                        <label htmlFor="">Email:</label>
                        <input type="text" name="email" value={userData.email} onChange={handleUserInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" name="userPassword" value={userData.userPassword} onChange={handleUserInputChange}/>
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" name="confirmUserPassword" value={userData.confirmUserPassword} onChange={handleUserInputChange}/>
                        {userErrorMessage && <p className="error-message">{userErrorMessage}</p>}
                        <button type="submit" className="primary login-btn">
                            {loading ? <Loading type={"spin"} color={"#FFFFFF"} height={25} width={25} /> : 'Sign Up'}
                        </button>
                        <p>Already have an account?</p>
                        <button className="secondary" onClick={() => navigate('/signin')}>Back to log in</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateFamily;