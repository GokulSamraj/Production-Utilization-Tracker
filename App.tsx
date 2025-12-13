import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { User, ProductionRecord, UserRole } from './types';
import { DEFAULT_ADMIN } from './constants';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [loginError, setLoginError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('app_users');
    const storedRecords = localStorage.getItem('app_records');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([DEFAULT_ADMIN]);
    }

    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords);
        if (Array.isArray(parsed)) {
             // Sanitize: Ensure all records have IDs
             const sanitized = parsed.map((r: any) => ({
                 ...r,
                 id: r.id || uuidv4() 
             }));
             setRecords(sanitized);
        }
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
    setIsDataLoaded(true);
  }, []);

  // Persist data ONLY after initial load is complete
  useEffect(() => {
    if (isDataLoaded) {
        if (users.length > 0) localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
        localStorage.setItem('app_records', JSON.stringify(records));
    }
  }, [records, isDataLoaded]);


  const handleLogin = (u: string, p: string) => {
    const foundUser = users.find(user => user.username === u && user.password === p);
    if (foundUser) {
      setUser(foundUser);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
  };

  const handleAddRecord = (newRecord: ProductionRecord) => {
    setRecords(prev => [...prev, newRecord]);
  };

  const handleUpdateRecord = (updatedRecord: ProductionRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  if (!isDataLoaded) {
    return <div className="min-h-screen bg-mac-bg flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  if (user.role === UserRole.ADMIN) {
    return (
      <AdminDashboard 
        users={users} 
        records={records} 
        onAddUser={handleAddUser} 
        onUpdateUser={handleUpdateUser}
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