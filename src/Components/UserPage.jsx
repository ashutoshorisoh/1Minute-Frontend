import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/users/userlist`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          const filteredUsers = data.data.map((user) => ({
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
  }, [backendUrl]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % users.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + users.length) % users.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true, // Allow swipe with mouse drag
  });

  if (loading) return <div className="text-center mt-5 text-white">Loading...</div>;

  if (error) return <div className="text-red-500 text-center mt-5">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black p-6">
      {users.length > 0 ? (
        <div
          {...swipeHandlers}
          className="relative w-full max-w-md h-96 bg-gray-800 text-white shadow-xl border border-gray-700 rounded-lg flex flex-col items-center justify-center p-6 text-center"
        >
          <img
            src={users[currentIndex].avatar}
            alt={users[currentIndex].username}
            className="w-40 h-40 rounded-full mb-4 object-cover"
          />
          <h3 className="text-2xl font-semibold">{users[currentIndex].username}</h3>
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
            <button
              onClick={handlePrev}
              className="text-blue-500 hover:text-blue-700 p-2"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={handleNext}
              className="text-blue-500 hover:text-blue-700 p-2"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default UsersPage;
