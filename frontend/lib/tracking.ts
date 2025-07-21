import { analyticsAPI } from './api';

export interface TrackingConfig {
  pageName: string;
  sessionStartTime: number;
}

export class PageTracker {
  private pageVisitId: number | null = null;
  private sessionStartTime: number;
  private pageName: string;
  private isTracking = false;
  private hasLoggedOut = false;

  constructor(config: TrackingConfig) {
    this.pageName = config.pageName;
    this.sessionStartTime = config.sessionStartTime;
  }

  async startTracking(): Promise<void> {
    if (this.isTracking) return;
    
    try {
      const response = await analyticsAPI.createPageVisit({ page_name: this.pageName });
      this.pageVisitId = response.data.id;
      this.isTracking = true;
      console.log(`Started tracking for ${this.pageName}`);
    } catch (error) {
      console.error('Failed to start page tracking:', error);
    }
  }

  async stopTracking(): Promise<void> {
    if (!this.isTracking || !this.pageVisitId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const durationSeconds = Math.max(0, (Date.now() - this.sessionStartTime) / 1000);
      const exitTime = new Date().toISOString();
      
      // Try fetch first
      await fetch(`http://localhost:8000/analytics/analytics/page-visit/${this.pageVisitId}/exit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exit_time: exitTime,
          duration_seconds: durationSeconds,
        }),
        keepalive: true
      });
      
      console.log(`Stopped tracking for ${this.pageName}, duration: ${durationSeconds}s`);
    } catch (error) {
      // Fallback to sendBeacon
      try {
        const exitTime = new Date().toISOString();
        const durationSeconds = Math.max(0, (Date.now() - this.sessionStartTime) / 1000);
        
        navigator.sendBeacon(
          `http://localhost:8000/analytics/analytics/page-visit/${this.pageVisitId}/exit`,
          JSON.stringify({
            exit_time: exitTime,
            duration_seconds: durationSeconds,
          })
        );
      } catch (beaconError) {
        console.error('Failed to send tracking beacon:', beaconError);
      }
    }
  }

  async sendLogoutEvent(): Promise<void> {
    // Prevent duplicate logout events
    if (this.hasLoggedOut) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('http://localhost:8000/analytics/analytics/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        keepalive: true
      });
      
      this.hasLoggedOut = true;
      console.log('Logout event sent successfully');
    } catch (error) {
      // Fallback to sendBeacon
      try {
        const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
        navigator.sendBeacon('http://localhost:8000/analytics/analytics/logout', blob);
        this.hasLoggedOut = true;
        console.log('Logout event sent via beacon');
      } catch (beaconError) {
        console.error('Failed to send logout beacon:', beaconError);
      }
    }
  }

  setupPageExitHandlers(): () => void {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      await this.stopTracking();
      await this.sendLogoutEvent();
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        await this.stopTracking();
        await this.sendLogoutEvent();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }
}

export function createPageTracker(pageName: string): PageTracker {
  return new PageTracker({
    pageName,
    sessionStartTime: Date.now()
  });
} 