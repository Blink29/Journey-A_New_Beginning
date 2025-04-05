import { useState } from "react";
import axios from "axios";

const StoryForm = ({ onSubmit }) => {
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSituation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim()) return alert("Please describe what's bothering you.");
    
    setLoading(true);
    setError("");
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/generate-story', {
        query: situation
      });
      
      if (data.success) {
        setStory(data.story);
      } else {
        setError(data.message || "Failed to generate story");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {!story ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">Your Journey Begins Here</h2>
          <p className="text-white/80 mb-6 text-sm">Share how you feel, and we'll create a story where someone just like you finds their way through.</p>

          <div className="space-y-6">
            <div>
              <label className="text-white font-medium">What's been on your mind?</label>
              <textarea
                name="situation"
                rows="4"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition outline-none"
                placeholder="It helps to write it down. Share as much or as little as you'd like..."
                value={situation}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Your Story..." : "Begin Your Journey"}
            </button>
            
            {error && <p className="text-red-300 text-sm text-center">{error}</p>}
            
            <p className="text-white/60 text-xs text-center mt-4">
              Every story is unique, just like your journey. We're here to help you find hope.
            </p>
          </div>
        </form>
      ) : (
        <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Journey</h2>
          <div className="bg-white/10 p-6 rounded-xl text-white/90 leading-relaxed whitespace-pre-line">
            {story}
          </div>
          <button
            onClick={() => {
              setStory("");
              setSituation("");
            }}
            className="mt-6 bg-white/20 text-white font-medium py-2 px-4 rounded-xl hover:bg-white/30 transition-all"
          >
            Create Another Story
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryForm;