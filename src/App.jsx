import React from 'react'
import StoryForm from './StoryForm'

const App = () => {
  const handleFormSubmit = (formData) => {
    console.log("User input:", formData);
    // send to backend or trigger story generation here
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-slate-950 text-white p-4">
    <StoryForm onSubmit={handleFormSubmit} />
  </div>
  )
}

export default App