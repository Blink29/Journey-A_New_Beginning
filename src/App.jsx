import React, { useState } from 'react'
import StoryForm from './StoryForm'
import SceneViewer from './SceneViewer'

const App = () => {
  const [story, setStory] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [mediaResults, setMediaResults] = useState([]);
  const [viewMode, setViewMode] = useState('story'); // 'story' or 'scenes'
  
  const handleFormSubmit = (formData) => {
    console.log("User input:", formData);
    // send to backend or trigger story generation here
  };
  
  const handleStoryGenerated = (storyData, sceneData, mediaData) => {
    setStory(storyData);
    setScenes(sceneData);
    setMediaResults(mediaData);
  };
  
  const handleReset = () => {
    setStory([]);
    setScenes([]);
    setMediaResults([]);
    setViewMode('story');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-slate-950 text-white p-4 pb-16">
      {story.length === 0 ? (
        <StoryForm 
          onSubmit={handleFormSubmit} 
          onStoryGenerated={handleStoryGenerated}
        />
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* View toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800/70 rounded-xl p-1 inline-flex">
              <button 
                onClick={() => setViewMode('story')}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'story' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-300 hover:bg-slate-700/70'
                }`}
              >
                Story View
              </button>
              <button 
                onClick={() => setViewMode('scenes')}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'scenes' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-300 hover:bg-slate-700/70'
                }`}
              >
                Immersive Experience
              </button>
            </div>
          </div>
          
          {viewMode === 'story' ? (
            <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 p-8 rounded-3xl shadow-xl backdrop-blur-lg border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">Your Journey</h2>
              
              <div className="space-y-8 mb-6">
                {story.map((chapter, index) => (
                  <div key={index} className="bg-white/10 p-6 rounded-xl text-white/90">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-white">{chapter.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{chapter.context}</p>
                    </div>
                    
                    <p className="leading-relaxed mb-4">{chapter.description}</p>
                    
                    {scenes && scenes[index] && (
                      <div className="mt-6 bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="italic text-white/80 mb-4">{scenes[index].scene_description}</p>
                        
                        {scenes[index].dialogue && scenes[index].dialogue.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {scenes[index].dialogue.map((dialog, dIdx) => (
                              <div key={dIdx} className="flex">
                                <span className="font-medium mr-2">{dialog.character}:</span>
                                <span className="text-white/80">"{dialog.line}"</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <SceneViewer scenes={scenes} mediaResults={mediaResults} />
          )}
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="bg-white/20 text-white font-medium py-2 px-6 rounded-xl hover:bg-white/30 transition-all"
            >
              Create Another Story
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App