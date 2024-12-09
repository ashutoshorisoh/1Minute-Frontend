import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch videos and sort them by the latest uploaded
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/videos`);
        const data = await response.json();
        const sortedVideos = (data.message.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setVideos(sortedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Navigate to video page
  const handleVideoClick = async (video) => {
    try {
      // Update the views in the backend
      await fetch(`${backendUrl}/api/v1/post/${video._id}/views`, {
        method: "POST",
      });
  
      // Navigate to the video page
      navigate(`/video/${video._id}`, { state: { video } });
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center items-center h-full bg-gray-100">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-64 h-36 bg-gray-300 rounded-lg animate-pulse m-4"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full pb-4 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video._id}
              className="video-item bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out overflow-hidden cursor-pointer"
             
            >
              <div className="video-thumbnail relative pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  muted
                  loop
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                  onClick={() => handleVideoClick(video)}
                >
                  <source src={video.videoFile} type="video/mp4"  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4">
                <h3 className="text-md lg:text-lg flex flex-wrap justify-between font-semibold text-gray-800 truncate">
                  <p>{video.title}</p>
                  <p className='text-gray-600 text-sm lg:text-md flex justify-center items-center'>{video.views} views</p>
                </h3>
                <div className="mt-2 text-sm text-gray-600 flex justify-between">
                  <button>{video.owner[0]?.username || 'Unknown'}</button>
                  
                  <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-700">
            No videos available.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoList;
