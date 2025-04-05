import { useState } from "react";

const moods = ["Sad", "Anxious", "Lonely", "Angry", "Confused", "Empty"];
const settings = ["Peaceful nature", "Futuristic city", "Quiet village", "Magical world"];
const genres = ["Slice of Life", "Adventure", "Fantasy", "Inspiring", "Sci-Fi"];

export default function StoryForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    mood: moods[0],
    situation: "",
    setting: settings[0],
    genre: genres[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.situation.trim()) return alert("Please describe what's bothering you.");
    onSubmit(form); // send data up
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10"
    >
      <h2 className="text-2xl font-semibold text-white mb-2">Your Journey Begins Here</h2>
      <p className="text-white/80 mb-6 text-sm">Share how you feel, and we'll create a story where someone just like you finds their way through.</p>

      <div className="space-y-6">
        <input
          name="name"
          type="text"
          placeholder="Your Name (optional)"
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none"
          value={form.name}
          onChange={handleChange}
        />

        <div>
          <label className="text-white font-medium">How are you feeling today?</label>
          <select
            name="mood"
            className="w-full p-3 rounded-xl mt-2 bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none appearance-none"
            value={form.mood}
            onChange={handleChange}
            style={{ color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            {moods.map((m) => (
              <option key={m} value={m} className="bg-indigo-900 text-white">
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-white font-medium">What's been on your mind?</label>
          <textarea
            name="situation"
            rows="4"
            className="w-full mt-2 p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none"
            placeholder="It helps to write it down. Share as much or as little as you'd like..."
            value={form.situation}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-white font-medium">What setting would comfort you right now?</label>
          <select
            name="setting"
            className="w-full p-3 rounded-xl mt-2 bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none appearance-none"
            value={form.setting}
            onChange={handleChange}
            style={{ color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            {settings.map((s) => (
              <option key={s} value={s} className="bg-indigo-900 text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-white font-medium">What kind of story would you like?</label>
          <select
            name="genre"
            className="w-full p-3 rounded-xl mt-2 bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none appearance-none"
            value={form.genre}
            onChange={handleChange}
            style={{ color: "white", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            {genres.map((g) => (
              <option key={g} value={g} className="bg-indigo-900 text-white">
                {g}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
        >
          Begin Your Journey
        </button>
        
        <p className="text-white/60 text-xs text-center mt-4">
          Every story is unique, just like your journey. We're here to help you find hope.
        </p>
      </div>
    </form>
  );
}