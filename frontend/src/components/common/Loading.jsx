import React from 'react';

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                <div className="absolute h-10 w-10 animate-pulse rounded-full bg-indigo-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-600 tracking-widest uppercase animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Loading;