import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CSS/AccountPage.css'; // For calendar dot styling

Chart.register(...registerables);

const AccountPage = () => {
  const [userId, setUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [journaledDates, setJournaledDates] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7days');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch functions remain the same...
  // Fetch all entries for a user
  const fetchEntries = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/journal/getAllJournals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  };

  // Fetch mood data
  const fetchMoodData = async (userId, range) => {
    try {
      const response = await axios.get(`http://localhost:8080/journal/mood-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          userId,
          range
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching mood data:', error);
      throw error;
    }
  };

  // Fetch streak data
  const fetchStreak = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/journal/streak`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching streak:', error);
      throw error;
    }
  };

  // Fetch journaled dates
  const fetchJournaledDates = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/journal/journal-dates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching journal dates:', error);
      throw error;
    }
  };

  // Fetch recent entries
  const fetchRecentEntries = async (userId, limit) => {
    try {
      const response = await axios.get(`http://localhost:8080/journal/recent-entries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { userId, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent entries:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you'd get userId from auth context
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserId = user?._id; // Example
        
        if (!currentUserId) {
          throw new Error('User not authenticated');
        }

        setUserId(currentUserId);
        
        // Fetch all data in parallel
        const [
          entriesRes, 
          moodRes, 
          streakRes, 
          datesRes, 
          recentRes
        ] = await Promise.all([
          fetchEntries(currentUserId),
          fetchMoodData(currentUserId, dateRange),
          fetchStreak(currentUserId),
          fetchJournaledDates(currentUserId),
          fetchRecentEntries(currentUserId, 3)
        ]);

        setEntries(entriesRes.entries || entriesRes); // Ensure this replaces the state, not appends.
        setMoodData(moodRes);
        setStreak(streakRes.streak || 0);
        setJournaledDates(datesRes);
        setRecentEntries(recentRes);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Prepare mood chart data
  const moodChartData = {
    labels: moodData.map(item => item.date),
    datasets: [
      {
        label: 'Mood Score',
        data: moodData.map(item => item.score),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const processMoodData = (entries) => {
    console.log("Entries being processed:", entries); // Debug log
    const moodFrequency = entries.reduce((acc, entry) => {
      if (entry.mood) {
        const moodKey = Object.keys(entry.mood).find(key => entry.mood[key]);
        if (moodKey) {
          acc[moodKey] = (acc[moodKey] || 0) + 1;
        }
      }
      return acc;
    }, {});

    // Count occurrences of each specific mood state
    const specificMoodFrequency = entries.reduce((acc, entry) => {
      if (entry.mood) {
        Object.entries(entry.mood).forEach(([category, specificMood]) => {
          if (specificMood) {
            acc[specificMood] = (acc[specificMood] || 0) + 1;
          }
        });
      }
      return acc;
    }, {});

    return { moodFrequency, specificMoodFrequency }; // Correct placement of return
  };
  
  const { moodFrequency, specificMoodFrequency } = processMoodData(entries);
  
  // Prepare chart data for main mood categories
  const moodFrequencyData = {
    labels: Object.keys(moodFrequency),
    datasets: [{
      label: 'Mood Frequency',
      data: Object.values(moodFrequency),
      backgroundColor: [
        '#FF66B3', // joyful
        '#42BFDD', // happy
        '#BBE6E4', // calmAndContent
        '#084B83', // angry
        '#F0F6F6', // anxious
        '#8A4FFF', // sad
        '#FF9E7D'  // depressed
      ],
      borderWidth: 1
    }]
  };
  
  // Prepare chart data for specific mood states
  const specificMoodData = {
    labels: Object.keys(specificMoodFrequency),
    datasets: [{
      label: 'Specific Mood Frequency',
      data: Object.values(specificMoodFrequency),
      backgroundColor: Object.keys(specificMoodFrequency).map((_, i) => 
        `hsl(${(i * 360 / Object.keys(specificMoodFrequency).length)}, 70%, 60%)`
      ),
      borderWidth: 1
    }]
  };

  useEffect(() => {
    console.log("Entries:", entries);
    console.log("Mood Frequency:", moodFrequency);
    console.log("Specific Mood Frequency:", specificMoodFrequency);
  }, [entries, moodFrequency, specificMoodFrequency]);

  // Tile content for calendar to highlight journaled dates
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (journaledDates.includes(dateStr)) {
        return <div className="journal-dot"></div>;
      }
    }
    return null;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f6f6] font-borel">
      <div className="text-2xl text-[#084b83]">Loading your journal data...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f6f6] font-borel">
      <div className="text-2xl text-red-500">Error: {error}</div>
    </div>
  );

  console.log("Journaled Dates:", journaledDates);
  console.log("Mood Data:", moodData);

  return (
    <div className="min-h-screen bg-[#f0f6f6] p-6 font-borel">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#084b83] mb-4">Welcome Back!</h1>
        <div className="flex justify-center gap-6">
          <div className="bg-[#bbe6e4] p-4 rounded-lg shadow-md w-40 text-center">
            <h3 className="text-[#084b83]">Total Entries</h3>
            <p className="text-3xl font-bold text-[#ff66b3]">{entries.length}</p>
          </div>
          <div className="bg-[#bbe6e4] p-4 rounded-lg shadow-md w-40 text-center">
            <h3 className="text-[#084b83]">Current Streak</h3>
            <p className="text-3xl font-bold text-[#ff66b3]">{streak} days</p>
          </div>
          <div className="bg-[#bbe6e4] p-4 rounded-lg shadow-md w-40 text-center">
            <h3 className="text-[#084b83]">Last Entry</h3>
            <p className="text-xl font-bold text-[#ff66b3]">
              {recentEntries[0]?.createdAt 
                ? new Date(recentEntries[0].createdAt).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Your Mood Trends</h2>
          <div className="flex gap-2 mb-4">
            <button 
              className={`px-4 py-2 rounded-full ${dateRange === '7days' ? 'bg-[#42bfdd] text-white' : 'bg-[#bbe6e4] text-[#084b83]'}`}
              onClick={() => setDateRange('7days')}
            >
              Last 7 Days
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${dateRange === '1month' ? 'bg-[#42bfdd] text-white' : 'bg-[#bbe6e4] text-[#084b83]'}`}
              onClick={() => setDateRange('1month')}
            >
              Last 30 Days
            </button>
          </div>
          <div className="h-64">
            <Line 
              data={moodChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Mood score: ${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    min: 0,
                    max: 7,
                    ticks: {
                      stepSize: 1,
                      callback: function(value) {
                        const moods = {
                          1: 'Depressed',
                          2: 'Sad',
                          3: 'Anxious',
                          4: 'Angry',
                          5: 'Calm',
                          6: 'Happy',
                          7: 'Joyful'
                        };
                        return moods[value] || '';
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </section>

        {/* Mood Frequency Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Mood Categories</h2>
          <div className="h-64">
            <Bar 
              data={moodFrequencyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.raw} entries`
                    }
                  }
                }
              }}
            />
          </div>
        </section>

        {/* Specific Mood States */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Detailed Mood States</h2>
          <div className="h-96">
            <Bar 
              data={specificMoodData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.raw} entries`
                    }
                  }
                }
              }}
            />
          </div>
        </section>

        {/* Mood Insights */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Mood Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f0f6f6] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#ff66b3]">Most Common Mood</h3>
              <p className="text-[#084b83]">
                {Object.keys(moodFrequency).length > 0 
                  ? `${Object.entries(moodFrequency).sort((a, b) => b[1] - a[1])[0][0]} (${Object.entries(moodFrequency).sort((a, b) => b[1] - a[1])[0][1]} times)`
                  : 'No data yet'}
              </p>
            </div>
            <div className="bg-[#f0f6f6] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#42bfdd]">Most Specific Mood</h3>
              <p className="text-[#084b83]">
                {Object.keys(specificMoodFrequency).length > 0
                  ? `${Object.entries(specificMoodFrequency).sort((a, b) => b[1] - a[1])[0][0]} (${Object.entries(specificMoodFrequency).sort((a, b) => b[1] - a[1])[0][1]} times)`
                  : 'No data yet'}
              </p>
            </div>
          </div>
        </section>
    
        {/* Journal Calendar Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Journal Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="border-none"
          />
          <p className="text-sm text-[#084b83] mt-2 text-center">
            Dots indicate days you journaled
          </p>
        </section>

        {/* Recent Entries Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Recent Entries</h2>
          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map(entry => (
                <div key={entry._id} className="bg-[#f0f6f6] p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-[#ff66b3]">{entry.title}</h3>
                  <p className="text-sm text-[#084b83]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[#42bfdd] font-semibold">
                    Mood: {entry.mood ? Object.keys(entry.mood).find(key => entry.mood[key]) : 'N/A'}
                  </p>
                  <p className="text-[#084b83] mt-2">
                    {entry.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#084b83]">No recent entries found</p>
          )}
        </section>

        {/* Gratitude Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">What You're Grateful For</h2>
          {entries.some(e => e.grateful?.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries
                .filter(e => e.grateful?.length > 0)
                .slice(0, 4)
                .map(entry => (
                  <div key={entry._id} className="bg-[#f0f6f6] p-4 rounded-lg">
                    <p className="text-sm text-[#084b83]">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <ul className="list-disc pl-5 mt-2">
                      {entry.grateful.map((item, i) => (
                        <li key={i} className="text-[#084b83]">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-[#084b83]">No gratitude entries yet</p>
          )}
        </section>

        {/* Reflections Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#084b83] mb-4">Your Reflections</h2>
          {entries.some(e => e.selfReflection) ? (
            <div className="space-y-4">
              {entries
                .filter(e => e.selfReflection)
                .slice(0, 2)
                .map(entry => (
                  <div key={entry._id} className="bg-[#f0f6f6] p-4 rounded-lg">
                    <p className="text-sm text-[#084b83]">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[#084b83] mt-2">
                      {entry.selfReflection.substring(0, 150)}...
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-[#084b83]">No reflections yet</p>
          )}
        </section>
      </div>
      {console.log("Entries for reflections and gratitudes:", entries)}
    </div>
  );
}

export default AccountPage;