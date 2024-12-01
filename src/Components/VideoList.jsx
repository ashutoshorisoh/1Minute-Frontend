import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/v1/videos`); 
        const data = await response.json();
        setVideos(data.message.data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array means it runs once after the component mounts

  if (loading) {
    return (
    <div className=" flex flex-col pl-2 gap-2 justify-center items-center pr-2 bg-white h-full pt-0.5">
       <div className='flex flex-row w-full gap-2'>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
       </div>
       <div className='flex flex-row w-full gap-2'>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
       </div>
       <div className='flex flex-row w-full gap-2'>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
       </div>
       <div className='flex flex-row w-full gap-2'>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
       </div>
       <div className='flex flex-row w-full gap-2'>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
         <div className='flex-grow aspect-video bg-black rounded-xl shadow-2xl '></div>
       </div>
    </div>
  );
  }

  const handleVideoClick = (video) => {
    navigate(`/video/${video._id}`, { state: { video } }); // Pass only the video data
  };

  return (
    <div className="h-full pb-2 flex flex-col pl-2 pr-2 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-0.5">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div 
              key={video._id} 
              className="video-item bg-black rounded-xl shadow-2xl shadow-slate-950 overflow-hidden hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer border-black border hover:border-none"
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail relative pb-[56.25%] "> {/* 16:9 aspect ratio */}
                <video className="absolute top-0 left-0 w-full h-full object-contain pb-1">
                  <source src={video.videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 truncate bg-white">{video.title}</h3>
                {/*<p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>*/}
                <div className="mt-2 text-sm flex justify-between text-gray-500 bg-white">
                  {/*} <p>Duration: {video.time} seconds</p>*/}
                  <p>{video.owner[0]?.username || 'Unknown'}</p>
                  <p>Views: {video.views}</p>
                  {/*} <p>Published: {video.isPublished ? 'Yes' : 'No'}</p>*/}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-xl">No videos available.</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;
