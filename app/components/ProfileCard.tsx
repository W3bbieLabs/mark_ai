import React from "react";

interface ProfileCardProps {
  profileImage: string;
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  title: string;
  twitter_url: string;
  created_at: string | number;
  dexscreener_url: string;
  onButton1Click?: () => void;
  onButton2Click?: () => void;
}

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProfileCard = ({
  profileImage,
  label1,
  label2,
  label3,
  label4,
  title,
  twitter_url,
  dexscreener_url,
  created_at,
  onButton1Click,
  onButton2Click,
}: ProfileCardProps) => {
  const getTimeDifference = (timestamp: string | number) => {
    const created =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    const now = Date.now();
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m ago`;
  };

  return (
    <div className="w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] max-w-[1000px] p-4 md:p-8 bg-gray-900 rounded-xl shadow-lg mx-auto my-4 border border-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {toTitleCase(title)}
          </h2>
          <span className="text-sm text-gray-400">
            {getTimeDifference(created_at)}
          </span>
        </div>
        <img
          src={profileImage}
          alt="Profile"
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-700"
        />
      </div>

      {/* Labels Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div
            className={`text-center text-xl font-bold ${
              parseFloat(label1) < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {label1}%
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">5m</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div
            className={`text-center text-xl font-bold ${
              parseFloat(label2) < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {label2}%
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">1h</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div
            className={`text-center text-xl font-bold ${
              parseFloat(label3) < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {label3}%
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">6h</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div
            className={`text-center text-xl font-bold ${
              parseFloat(label4) < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {label4}%
          </div>
          <div className="text-center text-sm text-gray-400 mt-1">24h</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onButton1Click}
          className="px-8 py-3 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Dexscreener
        </button>
        <button
          onClick={onButton2Click}
          className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Twitter
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
