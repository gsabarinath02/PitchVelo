/**
 * Format seconds into a human-readable duration string
 * @param seconds - Number of seconds
 * @returns Formatted duration string (e.g., "2h 30m 15s")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
}

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Calculate average session duration from multiple sessions
 * @param sessions - Array of session durations in seconds
 * @returns Average duration in seconds
 */
export function calculateAverageSession(sessions: number[]): number {
  if (sessions.length === 0) return 0;
  
  const validSessions = sessions.filter(duration => duration > 0);
  if (validSessions.length === 0) return 0;
  
  const total = validSessions.reduce((sum, duration) => sum + duration, 0);
  return total / validSessions.length;
}

/**
 * Validate if a session duration is reasonable
 * @param duration - Duration in seconds
 * @returns True if duration is reasonable (between 0 and 24 hours)
 */
export function isValidSessionDuration(duration: number): boolean {
  return duration >= 0 && duration <= 24 * 3600; // 24 hours max
} 