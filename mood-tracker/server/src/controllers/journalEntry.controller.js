// import { journalModel } from "../models/journalEntry.model.js";

// export const entryJournal = async (req, res) => {
//     const { title, note, moodCategory, specificMood, date, grateful, reflection } = req.body;

//     try {
//         const newEntry = new journalModel({
//             title,
//             note,
//             moodCategory,
//             specificMood,
//             date,
//             grateful: grateful || [], // default empty array
//             reflection,
//             user: req.userId
//         });
//         // const newEntry = new journalModel({
//         //     title,
//         //     note,
//         //     mood,
//         //     date,
//         //     user: req.userId
//         // });

//         await newEntry.save();

//         res.status(200).json({ message: "Journal Entry Created Successfully", newEntry });
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({ message: e });
//     }

// }

// export const deleteEntry = async (req, res) => {
//     const { id } = req.params;

//     try {
//         await journalModel.findByIdAndDelete(id);
//         return res.status(200).json({ messgae: "entry was deleted!" });
//     } catch (e) {
//         console.log(e);
//         return res.staus(500).json({ message: e });
//     }
// }

import { journalModel } from '../models/journalEntry.model.js'; // 🆕 Import JournalEntry model
import { userModel } from '../models/user.model.js';// 🆕 Import User model

// 🆕 Add new journal entry for a user
export const addEntry = async (req, res) => {
  const { title, content, mood, grateful, selfReflection } = req.body;
//   const userId = req.userId; // comes from auth middleware
  const userId = req.user.id; // comes from auth middleware

  try {
    const newEntry = new journalModel({ title, content, mood,grateful, selfReflection , user: userId });
    await newEntry.save();

    return res.status(201).json({
      message: 'Journal entry added successfully',
      entry: newEntry
    });
  } catch (error) {
    console.error('Error adding entry:', error);
    return res.status(500).json({ message: 'Server error while adding entry' });
  }
};

// 🆕 Get all entries by username
export const getEntriesByUsername = async (req, res) => {
  const userId  = req.user.id;

  try {
    const user = await userModel.find({ userId: userId });

    console.log(user);
    console.log(userId);
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const entries = await journalModel.find({ user: user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: `All entries for ${user.email}`,
      entries
    });
  } catch (error) {
    console.error('Error retrieving entries:', error);
    return res.status(500).json({ message: 'Server error while retrieving entries' });
  }
};

// 🆕 Edit a journal entry by ID
export const editEntry = async (req, res) => {
  const entryId = req.params.id;
  const { title, content, mood,grateful, selfReflection  } = req.body;

  try {
    const updatedEntry = await journalModel.findByIdAndUpdate(
      entryId,
      { title, content, mood , grateful, selfReflection },
      { new: true }
    );

    console.log(updatedEntry);

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    return res.status(200).json({
      message: 'Entry updated successfully',
      updatedEntry
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    return res.status(500).json({ message: 'Server error while updating entry' });
  }
};

// 🆕 Delete a journal entry by ID
export const deleteEntry = async (req, res) => {
  const entryId = req.params.id;

  try {
    const deleted = await journalModel.findByIdAndDelete(entryId);

    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    return res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return res.status(500).json({ message: 'Server error while deleting entry' });
  }
};



//mood mapping
const getMoodScore = (mood) => {
  if (!mood) return null;

  // Assign weights based on mood category
  if (mood.joyful) return 7;      // Highest positive
  if (mood.happy) return 6;
  if (mood.calmAndContent) return 5;
  if (mood.angry) return 4;       // Neutral/mixed
  if (mood.anxious) return 3;
  if (mood.sad) return 2;
  if (mood.depressed) return 1;   // Lowest
  return null;
};

// API: Get mood data for the graph
export const getMoodData = async (req, res) => {
  try {
    const { userId, range } = req.query; // '7days' or '1month'
    const days = range === '7days' ? 7 : 30;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const entries = await journalModel
      .find({
        user: userId,
        createdAt: { $gte: startDate },
      })
      .sort({ createdAt: 1 });

    // Transform into Chart.js format
    const moodData = entries.map((entry) => ({
      date: entry.createdAt.toISOString().split('T')[0],
      score: getMoodScore(entry.mood),
    }));

    return res.json(moodData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch mood data" });
  }
};

export const getRecentEntries = async (req, res) => {
  try {
    const { userId, limit = 5 } = req.query;

    const entries = await journalModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch recent entries" });
  }
};

export const getJournaledDates = async (req, res) => {
  try {
    const { userId } = req.query;

    const entries = await journalModel.find(
      { user: userId },
      { createdAt: 1 }
    );

    const journaledDates = entries.map((entry) =>
      entry.createdAt.toISOString().split('T')[0] // Format: YYYY-MM-DD
    );

    return res.json(journaledDates);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch journal dates" });
  }
};

export const getStreak = async (req, res) => {
  try {
    const { userId } = req.query;

    const entries = await journalModel
      .find({ user: userId })
      .sort({ createdAt: -1 }); // Newest first

    let streak = 0;
    let lastDate = new Date();

    for (const entry of entries) {
      const entryDate = new Date(entry.createdAt);
      const diffDays = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) continue; // Same day
      if (diffDays === 1) streak++;
      else break; // Streak broken

      lastDate = entryDate;
    }

    return res.json({ streak });
  } catch (error) {
    return res.status(500).json({ error: "Failed to calculate streak" });
  }
};
