import React from 'react';

function Home() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gradient-to-r from-[#cfcbca] to-[#ecf8f8] px-4 text-center">
      <h1 className="text-4xl font-bold text-[#b2967d] mb-4">Welcome to MoodJournal</h1>

      {!isLoggedIn ? (
        <p className="text-xl italic text-[#b2967d] max-w-2xl">
          “Keeping a journal of what’s going on in your life is a good way to help you distill what’s important and what’s not.” – <span className="not-italic font-medium">Martina Navratilova</span>
        </p>
      ) : (
        <p className="text-lg text-gray-600 max-w-xl">
          Your journey matters. Head over to the dashboard to track your mood and thoughts!
        </p>
      )}
    </div>
  );
}

export default Home;
