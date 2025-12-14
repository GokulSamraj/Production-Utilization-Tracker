import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { User, ProductionRecord, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [loginError, setLoginError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Load data from the backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch initial data');
        }
        const { users, records } = await response.json();
        setUsers(users);
        setRecords(records);
      } catch (error) {
        console.error("API Error:", error);
        setLoginError("Could not connect to the server.");
      } finally {
        setIsDataLoaded(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setLoginError(message || 'Invalid credentials');
        return;
      }

      const foundUser = await response.json();
      if (foundUser.isDisabled) {
        setLoginError('This account has been disabled.');
        return;
      }
      setUser(foundUser);
      setLoginError('');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('An error occurred during login.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddUser = async (newUser: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const addedUser = await response.json();
      setUsers(prev => [...prev, addedUser]);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const returnedUser = await response.json();
      setUsers(prev => prev.map(u => u.id === returnedUser.id ? returnedUser : u));
      if (user && user.id === returnedUser.id) {
        setUser(returnedUser);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setUsers(prev => prev.filter(u => u.id !== id));
      // Also remove records associated with the deleted user
      setRecords(prev => prev.filter(r => r.userId !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleAddRecord = async (newRecord: ProductionRecord) => {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      const addedRecord = await response.json();
      setRecords(prev => [...prev, addedRecord]);
    } catch (error) {
      console.error('Failed to add record:', error);
    }
  };

  const handleUpdateRecord = async (updatedRecord: ProductionRecord) => {
    try {
      const response = await fetch('/api/records', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord),
      });
      const returnedRecord = await response.json();
      setRecords(prev => prev.map(r => r.id === returnedRecord.id ? returnedRecord : r));
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-mac-bg flex items-center justify-center text-white">Connecting to database...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  if (user.role === UserRole.ADMIN) {
    return (
      <AdminDashboard 
        currentUser={user}
        users={users} 
        records={records} 
        onAddUser={handleAddUser} 
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onUpdateRecord={handleUpdateRecord}
        onDeleteRecord={handleDeleteRecord}
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <UserDashboard 
      currentUser={user} 
      records={records} 
      onAddRecord={handleAddRecord} 
      onDeleteRecord={handleDeleteRecord}
      onLogout={handleLogout} 
    />
  );
}

export default App;