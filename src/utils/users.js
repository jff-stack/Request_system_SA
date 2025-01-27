import { v4 as uuidv4 } from 'uuid';

// Initialize users with admin account
const initializeUsers = () => {
  if (!localStorage.getItem('users')) {
    const adminId = uuidv4();
    localStorage.setItem('users', JSON.stringify([{
      id: adminId,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    }]));
  }
};

export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
};

export const createUser = (username, password) => {
    const users = getUsers();
    
    if (users.some(user => user.username === username)) {
      throw new Error('Username already exists');
    }
  
    const newUser = {
      id: uuidv4(),
      username,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return newUser;
  };

export const authenticateUser = (username, password) => {
  const users = getUsers();
  return users.find(user => 
    user.username === username && 
    user.password === password
  );
};

initializeUsers();