// Centralized backend constants

// Application (Pipeline) statuses
const APPLICATION_STATUS = Object.freeze({
  APPLIED: 'applied',
  IN_PROGRESS: 'in-progress',
  SELECTED: 'selected',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
});

// Stage history statuses
const STAGE_STATUS = Object.freeze({
  PENDING: 'pending',
  CLEARED: 'cleared',
  FAILED: 'failed',
  SKIPPED: 'skipped',
});

// Placement event types
const EVENT_TYPE = Object.freeze({
  PRE_PLACEMENT_TALK: 'pre-placement-talk',
  APTITUDE_TEST: 'aptitude-test',
  TECHNICAL_INTERVIEW: 'technical-interview',
  HR_INTERVIEW: 'hr-interview',
  GROUP_DISCUSSION: 'group-discussion',
  PLACEMENT_DRIVE: 'placement-drive',
  RESULT: 'result',
  OTHER: 'other',
});

// Event status
const EVENT_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

// Support ticket
const SUPPORT_TICKET_TYPE = Object.freeze({
  FEEDBACK: 'feedback',
  BUG: 'bug',
  FEATURE: 'feature',
  HELP: 'help',
  CONTRIBUTE: 'contribute',
});

const SUPPORT_TICKET_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

const SUPPORT_TICKET_STATUS = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
});

module.exports = {
  APPLICATION_STATUS,
  STAGE_STATUS,
  EVENT_TYPE,
  EVENT_STATUS,
  SUPPORT_TICKET_TYPE,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_STATUS,
};


