import './adduser.scss';
import { useState } from 'react';
import { useAuth } from '../../../../../hooks/AuthContext/AuthContext';
import axios from 'axios';
import Loading from 'react-loading';

type UserSignupForm = {
    firstName: string,
    email: string,
    userPassword: string,
    confirmUserPassword: string,
};

type AddUserProps = {
    isAddUser: boolean;
    setIsAddUser: React.Dispatch<React.SetStateAction<boolean>>;
    onUserAdded: () => void;
};

const AddUser: React.FC<AddUserProps> = ({ isAddUser, setIsAddUser, onUserAdded, }) => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [addUserSuccessMessage, setAddUserSuccessMessage] = useState('');
    const [addUserErrorMessage, setAddUserErrorMessage] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    const initialNewUserState: UserSignupForm = {
        firstName: '',
        email: '',
        userPassword: '',
        confirmUserPassword: '',
    };

    const[newUserData, setNewUserData] = useState(initialNewUserState);

    const handleNewUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddUserErrorMessage('');
        const { name, value } = event.target;
        setNewUserData(prevState => ({ ...prevState, [name]: value }));
    }

    const validateNewUserForm = (): boolean => {
        for(const key in newUserData) {
            if(newUserData[key as keyof UserSignupForm] === "") {
                setAddUserErrorMessage('All fields are required.');
                return false;
            }
        }
        if(!newUserData.email.includes('@')) {
            setAddUserErrorMessage('You must input a valid email address.');
            return false;
        }
        setAddUserErrorMessage('');
        return true;
    }

    const validateNewUserPassword = (): boolean => {
        if(newUserData.userPassword === newUserData.confirmUserPassword) {
            return true;
        } else {
            setAddUserErrorMessage(`The passwords don't match!`);
            return false;
        }
    };

    const createUserInFamily = async (family_id: string): Promise<boolean> => {
        const completeUserData = { ...newUserData, family_id };
        try {
            const response = await axios.post(`${API_URL}users/`, completeUserData);
            if(response.status === 200 || response.status === 201) {
                console.log('The user was created!');
                return true;
            }
        } catch (error: any) {
            console.error('An error occurred: ', error.response?.data || error.message);
            if(error.response?.status === 400) {
                console.log('This email address is already in use.');
                setAddUserErrorMessage('This email address is already in use.');
            }
            setLoading(false);
        }
        setLoading(false);
        return false;
    };

    const handleCreation = async() => {
        const familyId = currentFamily?.id;
        if(familyId) {
            const userCreated = await createUserInFamily(familyId);
            if(userCreated) {
                console.log('New user successfully created!');
                setAddUserSuccessMessage('The user was added to the family!')
                setTimeout(() => {
                    setAddUserSuccessMessage('');
                }, 2000);
                setLoading(false);
                setNewUserData(initialNewUserState);
                setIsAddUser(false);
                onUserAdded();
            } else {
                console.error('Failed to create user.');
                setLoading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isUserValid = validateNewUserForm();
        if(!isUserValid) {setLoading(false); return;}
        const isUserPasswordValid = validateNewUserPassword();
        if(!isUserPasswordValid) {setLoading(false); return;}

        handleCreation();
    }

    return (
        <>  <div className="add-user-form-container">
                <h1>Add User</h1>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="">Name:</label>
                        <input type="text" name="firstName" value={newUserData.firstName} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Email:</label>
                        <input type="text" name="email" value={newUserData.email} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" name="userPassword" value={newUserData.userPassword} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" name="confirmUserPassword" value={newUserData.confirmUserPassword} onChange={handleNewUserInputChange}/>
                        {addUserErrorMessage && <p className="error-message">{addUserErrorMessage}</p>}
                        {addUserSuccessMessage && <p className="success-message">{addUserSuccessMessage}</p>}
                        <button type="submit" className="primary login-btn">
                            {loading ? <Loading type={"spin"} color={"#FFFFFF"} height={25} width={25} /> : 'Add User'}
                        </button>
                        <button className="secondary" onClick={() => setIsAddUser(false)}>Back to user list</button>
                </form>
        </div>
        </>
    )
}

export default AddUser;