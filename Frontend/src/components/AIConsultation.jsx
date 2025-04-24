import React, { useState } from 'react';

function AIConsultation() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const getAIAdvice = () => {
    if (!input) {
      alert('Please enter your skin concerns.');
      return;
    }
    setResponse("Analyzing your concerns... (AI response coming soon!)");
  };

  return (
    <section id="aiConsultation" className="consultation">
      <h2>Start Your AI Consultation</h2>
      <textarea
        placeholder="Describe your skin issues..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={getAIAdvice}>Get AI Advice</button>
      {response && <div className="response">{response}</div>}
    </section>
  );
}

export default AIConsultation;
