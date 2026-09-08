import { useEffect, useState } from 'react';
import { api } from '../api/client';

const fallbackAgents = [
  {
    id: 'site-concierge',
    name: 'AlphaGen Site Concierge',
    audience: 'Visitors and prospects',
    description: 'Answers questions about services, trainings, jobs, and contact options.',
    starterPrompts: ['Which services do you offer?', 'How do I submit my resume?', 'Tell me about AI training programs.']
  },
  {
    id: 'employee-copilot',
    name: 'Employee Portal Copilot',
    audience: 'Employees',
    description: 'Guides employees through timesheets, account access, and training support.',
    starterPrompts: ['How do I submit a timesheet?', 'What happens after I submit hours?', 'Where can I find training support?']
  },
  {
    id: 'supervisor-copilot',
    name: 'Supervisor Review Agent',
    audience: 'Supervisors and admins',
    description: 'Helps supervisors review timesheets and create useful follow-up notes.',
    starterPrompts: ['How should I review a timesheet?', 'What should I check before approval?', 'How do I handle a rejection?']
  }
];

export default function AIChatbot() {
  const [agents, setAgents] = useState(fallbackAgents);
  const [selectedAgentId, setSelectedAgentId] = useState(fallbackAgents[0].id);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Choose an AlphaGen agent and ask about services, training, jobs, timesheets, or supervisor review workflows.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) || agents[0];

  useEffect(() => {
    let ignore = false;

    api.get('/api/ai/agents')
      .then((data) => {
        if (!ignore && Array.isArray(data.agents) && data.agents.length > 0) {
          setAgents(data.agents);
          setSelectedAgentId(data.agents[0].id);
        }
      })
      .catch(() => {
        if (!ignore) setAgents(fallbackAgents);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const sendMessage = async (messageText) => {
    const trimmed = messageText.trim();
    if (!trimmed || isSending) return;

    setInput('');
    setIsSending(true);
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);

    try {
      const data = await api.post('/api/ai/chat', {
        agentId: selectedAgentId,
        message: trimmed
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: data.reply,
          suggestions: data.suggestions || []
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: error.message || 'The assistant is unavailable right now. Please try again shortly.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="ai-agents" id="ai-agents">
      <div className="container">
        <div className="ai-agents-header">
          <span className="ai-eyebrow">AI assistants</span>
          <h2 className="section-title">Chatbots for AlphaGen workflows</h2>
          <p className="contact-subtitle">
            Start with the right assistant for website questions, employee tasks, or supervisor reviews.
          </p>
        </div>

        <div className="ai-chat-shell">
          <div className="agent-list" aria-label="AlphaGen agents">
            {agents.map((agent) => (
              <button
                type="button"
                key={agent.id}
                className={`agent-card ${agent.id === selectedAgentId ? 'active' : ''}`}
                onClick={() => setSelectedAgentId(agent.id)}
              >
                <strong>{agent.name}</strong>
                <span>{agent.audience}</span>
                <p>{agent.description}</p>
              </button>
            ))}
          </div>

          <div className="chat-panel">
            <div className="chat-panel-header">
              <div>
                <span>Active agent</span>
                <strong>{selectedAgent.name}</strong>
              </div>
              <span className="agent-status">Local ready</span>
            </div>

            <div className="starter-prompts">
              {selectedAgent.starterPrompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                  <span>{message.role === 'user' ? 'You' : selectedAgent.name}</span>
                  <p>{message.text}</p>
                  {message.suggestions?.length > 0 && (
                    <div className="chat-suggestions">
                      {message.suggestions.map((suggestion) => (
                        <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              className="chat-input-row"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={`Ask ${selectedAgent.name}...`}
                maxLength={1000}
              />
              <button type="submit" className="btn btn-primary" disabled={isSending || !input.trim()}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
