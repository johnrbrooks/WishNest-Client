import './adduser.scss';
import { useState } from 'react';
import { useAuth } from '../../../../../hooks/AuthContext/AuthContext';
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
};

const AddUser: React.FC<AddUserProps> = ({ isAddUser, setIsAddUser }) => {

    const { currentUser, setCurrentUser, currentFamily, setCurrentFamily, token, setToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [addUserErrorMessage, setAddUserErrorMessage] = useState('');

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

    return (
        <>  <div className="add-user-form-container">
                <h1>Add User</h1>
                <form action="">
                    <label htmlFor="">Name:</label>
                        <input type="text" name="firstName" value={newUserData.firstName} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Email:</label>
                        <input type="text" name="email" value={newUserData.email} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Password:</label>
                        <input type="password" name="userPassword" value={newUserData.userPassword} onChange={handleNewUserInputChange}/>
                        <label htmlFor="">Confirm Password:</label>
                        <input type="password" name="confirmUserPassword" value={newUserData.confirmUserPassword} onChange={handleNewUserInputChange}/>
                        {addUserErrorMessage && <p className="error-message">{addUserErrorMessage}</p>}
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