import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { contextUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    /*if (!isAuthenticated) {
      navigate('/login');
      return;
    }*/

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/userlist');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
          // Map data to filter out only the necessary fields
          const filteredUsers = data.data.map(user => ({
            username: user.username,
            avatar: user.avatar,
          }));
          setUsers(filteredUsers);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Users List</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.username}>
              <p>{user.username}</p>
              <img src={user.avatar} alt={user.username} width="50" height="50" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default UsersPage;
