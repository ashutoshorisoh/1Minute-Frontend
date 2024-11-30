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

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (error) return <div className="text-red-500 text-center mt-5">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white lg:p-0 p-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Users</h2>
      {users.length > 0 ? (
        <div
          {...swipeHandlers}
          className="relative w-full max-w-lg h-96 bg-white text-black shadow-lg  shadow-slate-700 border border-black rounded-lg flex flex-col items-center justify-center p-6 text-center "
        >
          <img
            src={users[currentIndex].avatar}
            alt={users[currentIndex].username}
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold">{users[currentIndex].username}</h3>
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
