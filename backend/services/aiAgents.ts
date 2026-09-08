export type AgentId = 'site-concierge' | 'employee-copilot' | 'supervisor-copilot';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  audience: string;
  description: string;
  starterPrompts: string[];
}

interface ChatInput {
  agentId: AgentId;
  message: string;
}

interface ChatReply {
  agent: AgentDefinition;
  provider: 'local-rules' | 'github-models' | 'openai-compatible' | 'azure-openai';
  reply: string;
  suggestions: string[];
  attemptedProvider?: RemoteProvider;
  fallbackReason?: string;
}

type RemoteProvider = Exclude<ChatReply['provider'], 'local-rules'>;
type ChatApiProvider = 'openai-compatible' | 'azure-openai';
type ProviderResult =
  | Pick<ChatReply, 'provider' | 'reply' | 'suggestions'>
  | Pick<ChatReply, 'attemptedProvider' | 'fallbackReason'>;

const agentDefinitions: Record<AgentId, AgentDefinition> = {
  'site-concierge': {
    id: 'site-concierge',
    name: 'AlphaGen Site Concierge',
    audience: 'Visitors and prospects',
    description: 'Answers questions about services, trainings, jobs, and how to contact AlphaGen Solutions.',
    starterPrompts: [
      'Which services do you offer?',
      'How do I submit my resume?',
      'Tell me about AI training programs.'
    ]
  },
  'employee-copilot': {
    id: 'employee-copilot',
    name: 'Employee Portal Copilot',
    audience: 'Employees',
    description: 'Guides employees through timesheets, profile tasks, training options, and support requests.',
    starterPrompts: [
      'How do I submit a timesheet?',
      'What happens after I submit hours?',
      'Where can I find training support?'
    ]
  },
  'supervisor-copilot': {
    id: 'supervisor-copilot',
    name: 'Supervisor Review Agent',
    audience: 'Supervisors and admins',
    description: 'Helps supervisors review submitted timesheets, spot missing context, and plan follow-up actions.',
    starterPrompts: [
      'How should I review a timesheet?',
      'What should I check before approval?',
      'How do I handle a rejection?'
    ]
  }
};

const defaultSuggestions = [
  'Show available services',
  'Explain portal access',
  'Connect me with AlphaGen'
];

const includesAny = (message: string, keywords: string[]) => keywords.some((keyword) => message.includes(keyword));

const getSystemPrompt = (agent: AgentDefinition) => [
  `You are ${agent.name} for AlphaGen Solutions.`,
  `Audience: ${agent.audience}.`,
  agent.description,
  'Keep answers concise, practical, and specific to AlphaGen services, jobs, trainings, timesheets, or supervisor workflows.',
  'Do not invent private company policies, credentials, prices, or guarantees.'
].join(' ');

const getConfiguredProvider = () => {
  const provider = process.env.AI_PROVIDER as ChatReply['provider'] | undefined;
  const endpoint = process.env.AI_ENDPOINT || (provider === 'github-models'
    ? 'https://models.github.ai/inference/chat/completions'
    : undefined);
  const model = process.env.AI_MODEL || (provider === 'github-models' ? 'openai/gpt-4.1-mini' : undefined);
  const apiKey = process.env.AI_API_KEY || (provider === 'github-models' ? process.env.GITHUB_TOKEN : undefined);

  if (!provider || provider === 'local-rules' || !endpoint || !model || !apiKey) return null;
  if (provider !== 'github-models' && provider !== 'openai-compatible' && provider !== 'azure-openai') return null;

  return {
    provider: provider as RemoteProvider,
    chatApiProvider: (provider === 'azure-openai' ? 'azure-openai' : 'openai-compatible') as ChatApiProvider,
    endpoint,
    model,
    apiKey
  };
};

const chatWithConfiguredProvider = async (agent: AgentDefinition, message: string): Promise<ProviderResult | null> => {
  const config = getConfiguredProvider();
  if (!config) return null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.chatApiProvider === 'azure-openai'
      ? { 'api-key': config.apiKey }
      : { Authorization: `Bearer ${config.apiKey}` })
  };

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      temperature: 0.3,
      max_tokens: 320,
      messages: [
        { role: 'system', content: getSystemPrompt(agent) },
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    return {
      attemptedProvider: config.provider,
      fallbackReason: `Configured AI provider returned HTTP ${response.status}.`
    };
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return {
      attemptedProvider: config.provider,
      fallbackReason: 'Configured AI provider returned an empty response.'
    };
  }

  return {
    provider: config.provider,
    reply,
    suggestions: agent.starterPrompts
  };
};

const siteConciergeReply = (message: string) => {
  if (includesAny(message, ['service', 'cloud', 'devops', 'cyber', 'security', 'data', 'development'])) {
    return {
      reply: 'AlphaGen offers cloud solutions, AI and machine learning, custom development, cybersecurity, data analytics, and DevOps automation. I can help you pick the right service based on your project goal, timeline, and current platform.',
      suggestions: ['Compare cloud and DevOps services', 'Ask about AI services', 'Contact AlphaGen']
    };
  }

  if (includesAny(message, ['job', 'resume', 'career', 'placement', 'h1b', 'visa'])) {
    return {
      reply: 'AlphaGen supports candidates with job placement, resume preparation, interview coaching, W2 opportunities, remote or hybrid roles, and eligible visa sponsorship paths. The next step is to share your target role and current skill set.',
      suggestions: ['Find current openings', 'Prepare my resume', 'Ask about visa support']
    };
  }

  if (includesAny(message, ['training', 'course', 'learn', 'bootcamp', 'program'])) {
    return {
      reply: 'Training programs cover Java full stack, cloud architecture, DevOps and CI/CD, data analytics, AI and machine learning, and .NET development. I can recommend a track based on your current experience level.',
      suggestions: ['Recommend a training track', 'Show AI training', 'Ask about placement support']
    };
  }

  return {
    reply: 'I can help with AlphaGen services, job placement, training programs, and contact options. Tell me whether you are here as a business client, job seeker, trainee, employee, or supervisor.',
    suggestions: defaultSuggestions
  };
};

const employeeCopilotReply = (message: string) => {
  if (includesAny(message, ['timesheet', 'hours', 'submit', 'draft', 'week'])) {
    return {
      reply: 'Create your weekly timesheet as a draft, enter each work date with a task description and hours, then submit it when the week is complete. After submission, edits are locked while your supervisor reviews it.',
      suggestions: ['Explain timesheet status', 'What if I made a mistake?', 'Contact my supervisor']
    };
  }

  if (includesAny(message, ['password', 'login', 'account', 'access'])) {
    return {
      reply: 'For access issues, use the password reset flow from the login page. If you still cannot sign in, contact AlphaGen support with your work email and the portal you are trying to access.',
      suggestions: ['Reset password steps', 'Portal access help', 'Contact support']
    };
  }

  return {
    reply: 'I can guide you through employee portal tasks like timesheet submission, account access, training support, and next-step questions before contacting your supervisor.',
    suggestions: ['Submit a timesheet', 'Understand approval status', 'Training support']
  };
};

const supervisorCopilotReply = (message: string) => {
  if (includesAny(message, ['approve', 'approval', 'review', 'timesheet', 'hours'])) {
    return {
      reply: 'Review each submitted timesheet for the correct week, clear task descriptions, reasonable daily hours, and alignment with assigned work. Approve when everything is complete, or reject with a specific reason the employee can act on.',
      suggestions: ['Approval checklist', 'Write rejection reason', 'Find pending timesheets']
    };
  }

  if (includesAny(message, ['reject', 'rejection', 'missing', 'incorrect', 'wrong'])) {
    return {
      reply: 'When rejecting a timesheet, include the exact day or entry that needs correction and what the employee should change. Good rejection notes reduce back-and-forth and keep payroll review clean.',
      suggestions: ['Draft rejection note', 'Common issues to check', 'Escalate a concern']
    };
  }

  return {
    reply: 'I can help supervisors review submitted timesheets, decide whether to approve or reject, and create clear follow-up notes for employees.',
    suggestions: ['Review checklist', 'Pending approval workflow', 'Rejection guidance']
  };
};

export const listAgents = () => Object.values(agentDefinitions);

export const getAgent = (agentId: string): AgentDefinition | undefined => agentDefinitions[agentId as AgentId];

const chatWithLocalRules = ({ agentId, message }: ChatInput): ChatReply => {
  const normalizedMessage = message.toLowerCase();
  const agent = agentDefinitions[agentId];

  const result = (() => {
    if (agentId === 'site-concierge') return siteConciergeReply(normalizedMessage);
    if (agentId === 'employee-copilot') return employeeCopilotReply(normalizedMessage);
    return supervisorCopilotReply(normalizedMessage);
  })();

  return {
    agent,
    provider: 'local-rules',
    reply: result.reply,
    suggestions: result.suggestions
  };
};

export const chatWithAgent = async ({ agentId, message }: ChatInput): Promise<ChatReply> => {
  const agent = agentDefinitions[agentId];

  try {
    const providerReply = await chatWithConfiguredProvider(agent, message);
    if (providerReply && 'provider' in providerReply) {
      return {
        agent,
        ...providerReply
      };
    }
    if (providerReply) {
      return {
        ...chatWithLocalRules({ agentId, message }),
        attemptedProvider: providerReply.attemptedProvider,
        fallbackReason: providerReply.fallbackReason
      };
    }
  } catch {
    // Fall through to the local provider so chat remains available without external AI uptime.
  }

  return chatWithLocalRules({ agentId, message });
};
