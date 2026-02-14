// Participant and feedback data structures

export interface Participant {
  id: string;
  nickname: string;
  hobby: string; // Single hobby displayed
  icon: string; // Color or identifier for anonymous icon
}

export interface Feedback {
  participantId: string;
  rating: "disruptive" | "absent" | "no" | "neutral" | "yes"; // 会を乱す | 欠席 | 会いたくない | 同席してもよい | 次回は２人で会いたい
}

export interface EventFeedback {
  eventId: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
  overallComment: string;
  experienceComment: string;
  participantFeedbacks: Feedback[];
  submittedAt: string;
}

export interface Connection {
  participantId: string;
  participantNickname: string;
  participantHobby: string;
  mutualInterest: boolean;
  expiresAt: string; // 3 days from event
}

export interface SpecialSlotEvent {
  id: string;
  type: "special-slot";
  partnerId: string;
  partnerNickname: string;
  partnerHobby: string;
  expiresAt: string;
  selectedDates: string[];
  selectedAreas: string[];
  price: 1000;
}

// Mock participants for an event
export function getMockParticipants(eventId: string): Participant[] {
  return [
    {
      id: "p1",
      nickname: "ヒロキ",
      hobby: "アイドル",
      icon: "green",
    },
    {
      id: "p2",
      nickname: "ケンタ",
      hobby: "筋トレ",
      icon: "blue",
    },
    {
      id: "p3",
      nickname: "ユウタ",
      hobby: "アイドル",
      icon: "purple",
    },
    {
      id: "p4",
      nickname: "タカシ",
      hobby: "サウナ",
      icon: "orange",
    },
  ];
}

// Generate participant hint text based on user's personality answers
export function getParticipantHints(participants: Participant[]): string {
  // Mock: assumes user likes "アイドル"
  const sameHobbyCount = participants.filter(p => p.hobby === "アイドル").length;
  
  if (sameHobbyCount > 0) {
    return `あなたと同じ趣味のアイドル好きが${sameHobbyCount}人います`;
  }
  
  return "参加メンバーとの共通点を見つけてみましょう";
}

// Save feedback to localStorage
export function saveFeedback(feedback: EventFeedback) {
  const key = `sakuraco_feedback_${feedback.eventId}`;
  localStorage.setItem(key, JSON.stringify(feedback));
}

// Get feedback for an event
export function getFeedback(eventId: string): EventFeedback | null {
  const key = `sakuraco_feedback_${eventId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Check for mutual connections
export function processFeedback(eventId: string, feedback: EventFeedback): Connection[] {
  // In a real app, this would be server-side
  // For prototype, we'll simulate mutual interest
  
  const connections: Connection[] = [];
  
  feedback.participantFeedbacks.forEach(f => {
    if (f.rating === "yes") {
      // Simulate 50% chance of mutual interest for demo
      const isMutual = Math.random() > 0.5;
      
      const participant = getMockParticipants(eventId).find(p => p.id === f.participantId);
      if (participant && isMutual) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 3);
        
        connections.push({
          participantId: participant.id,
          participantNickname: participant.nickname,
          participantHobby: participant.hobby,
          mutualInterest: true,
          expiresAt: expiresAt.toISOString(),
        });
      }
    }
  });
  
  return connections;
}

// Save connections
export function saveConnections(connections: Connection[]) {
  const existing = getConnections();
  const updated = [...existing, ...connections];
  localStorage.setItem("sakuraco_connections", JSON.stringify(updated));
}

// Get all connections
export function getConnections(): Connection[] {
  const data = localStorage.getItem("sakuraco_connections");
  if (!data) return [];
  
  const connections: Connection[] = JSON.parse(data);
  const now = new Date();
  
  // Filter out expired connections
  return connections.filter(c => new Date(c.expiresAt) > now);
}

// Create special slot event from connection
export function createSpecialSlotEvent(connection: Connection): SpecialSlotEvent {
  return {
    id: `special-${connection.participantId}`,
    type: "special-slot",
    partnerId: connection.participantId,
    partnerNickname: connection.participantNickname,
    partnerHobby: connection.participantHobby,
    expiresAt: connection.expiresAt,
    selectedDates: [],
    selectedAreas: [],
    price: 1000,
  };
}
