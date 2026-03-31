import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
      <div className="flex space-x-3">
        <div className="w-4 h-4 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-4 h-4 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-4 h-4 bg-zinc-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loader;
