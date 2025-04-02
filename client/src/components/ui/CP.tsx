// src/UI/CommandPrompt.tsx
import React, { useState, useEffect } from 'react';

const CommandPrompt: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === 'admin') {
      // Redirect to the admin.html file located in the public directory
      window.location.href = '/login.html'; // Adjust the path if necessary
    } else {
      alert('Unknown command.'); // Handle unknown commands
    }
    setInput(''); // Clear the input
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Check for CTRL + Shift + Y
    if (e.ctrlKey && e.shiftKey && e.key === 'Y') {
      e.preventDefault(); // Prevent default action
      setIsVisible((prev) => !prev); // Toggle visibility
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    isVisible && ( // Render the command prompt only if isVisible is true
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'black', color: 'white', padding: '10px' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            style={{ width: '100%', backgroundColor: 'black', color: 'white', border: '1px solid white' }}
            placeholder="Type your command..."
          />
        </form>
      </div>
    )
  );
};

export default CommandPrompt;
