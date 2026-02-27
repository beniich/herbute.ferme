export interface ThreatMetrics {
    totalBlocks24h: number;
    activeDDoS: number;
    sqlInjectionAttempts: number;
    threatFeedSync: number;
    blocksChange: number;
}

export interface ThreatEvent {
    id: string;
    timestamp: Date;
    sourceIP: string;
    attackVector: string;
    targetURI: string;
    geoLocation: string;
    severityScore: number;
    status: 'blocked' | 'allowed' | 'monitored';
}
