export interface KPICardProps {
    title: string
    value: string | number
    unit?: string
    trend?: {
        value: number
        direction: 'up' | 'down' | 'neutral'
        label?: string
    }
    icon?: string
    iconColor?: string
}

export interface MetricData {
    label: string
    value: number
    timestamp: Date
}

export interface StatusIndicatorProps {
    status: 'healthy' | 'warning' | 'critical' | 'offline' | 'degraded'
    label: string
    size?: 'sm' | 'md' | 'lg'
    animated?: boolean
}

export interface ServiceHealth {
    name: string
    status: string
    uptime: number
    latency: number
    requests: number
}

export interface DeploymentHistory {
    id: string
    commitHash: string
    branch: string
    author: string
    status: 'success' | 'failed' | 'in-progress'
    duration: string
    timestamp: Date
}

export interface VulnerabilityItem {
    cveId: string
    description: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    cvssScore: number
    dependency: string
    version: string
    patchStatus: string
}

export interface APIEndpoint {
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    requests: number
    avgLatency: number
    statusDistribution: {
        success: number
        clientError: number
        serverError: number
    }
}

export interface RegionalPerformance {
    region: string
    latency: number
    throughput: number
    errorRate: number
}

export interface LogEntry {
    timestamp: Date
    level: 'info' | 'warn' | 'error' | 'fatal' | 'debug'
    message: string
    source: string
    host: string
    metadata?: Record<string, any>
}

export interface ChartDataPoint {
    name: string
    value: number
    color?: string
}

export interface TimeSeriesData {
    timestamp: Date
    values: Record<string, number>
    [key: string]: any // Allow dynamic keys for recharts
}

export interface NodeHealth {
    id: string
    name: string
    ipAddress: string
    status: 'healthy' | 'unhealthy' | 'degraded'
    cpu: number
    memory: number
    connections: number
}

export interface TargetGroup {
    instanceId: string
    availabilityZone: string
    status: 'healthy' | 'unhealthy'
    weight: number
}

export interface WAFRule {
    id: string
    name: string
    pattern: string
    action: 'block' | 'allow' | 'monitor'
    hits: number
    enabled: boolean
}

export interface MaterialRequest {
    id: string
    title: string
    requestedBy: string
    status: 'pending' | 'approved' | 'ready' | 'delivered'
    priority: 'standard' | 'high' | 'critical'
    items: Array<{
        name: string
        quantity: number
        stock: number
    }>
}
