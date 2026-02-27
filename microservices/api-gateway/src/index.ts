import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(morgan('dev'));

const formatDate = () => new Date().toISOString();

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', gateway: true, timestamp: formatDate() });
});

// Configuration des Services (Docker vs Localhost)
const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    complaints: process.env.COMPLAINTS_SERVICE_URL || 'http://localhost:3002',
    teams: process.env.TEAMS_SERVICE_URL || 'http://localhost:3003',
    notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005',
    inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3006',
    legacy: process.env.LEGACY_BACKEND_URL || 'http://localhost:5009'
};

// Proxy Routes
app.use('/api/auth', createProxyMiddleware({ target: SERVICES.auth, changeOrigin: true }));
app.use('/api/complaints', createProxyMiddleware({ target: SERVICES.complaints, changeOrigin: true }));
app.use('/api/teams', createProxyMiddleware({ target: SERVICES.teams, changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: SERVICES.notifications, changeOrigin: true }));
app.use('/api/analytics', createProxyMiddleware({ target: SERVICES.analytics, changeOrigin: true }));
app.use('/api/inventory', createProxyMiddleware({ target: SERVICES.inventory, changeOrigin: true }));

// Fallback to Legacy Backend
app.use('/api', createProxyMiddleware({ target: SERVICES.legacy, changeOrigin: true }));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
