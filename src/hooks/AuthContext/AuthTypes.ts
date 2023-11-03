type AuthContextType = {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    currentFamily: Family | null;
    setCurrentFamily: React.Dispatch<React.SetStateAction<Family | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
  };
  
  type User = {
    id: string;
    firstName: string;
    email: string;
    family_id: number;
    // ... other user properties
  };
  
  type Family = {
    id: string;
    familyName: string;
    // ... other family properties
  };