import { Router, type Request, type Response } from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { chatWithAgent, getAgent, listAgents, type AgentId } from '../services/aiAgents.js';

const router = Router();

const agentIds = listAgents().map((agent) => agent.id);

router.get('/agents', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    provider: process.env.AI_PROVIDER || 'local-rules',
    agents: listAgents()
  });
});

router.post(
  '/chat',
  [
    body('agentId')
      .isIn(agentIds)
      .withMessage(`agentId must be one of: ${agentIds.join(', ')}`),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 1000 })
      .withMessage('Message cannot exceed 1000 characters')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const agentId = req.body.agentId as AgentId;
    const agent = getAgent(agentId);

    if (!agent) {
      res.status(404).json({ success: false, message: 'Agent not found' });
      return;
    }

    const result = await chatWithAgent({
      agentId,
      message: req.body.message
    });

    res.status(200).json({
      success: true,
      ...result
    });
  }
);

export default router;
