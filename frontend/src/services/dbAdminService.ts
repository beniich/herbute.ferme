import axios from 'axios';

// La base URL de l'API (à adapter selon configuration, ici lecture depuis .env ou défaut)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const dbAdminApi = {
    /**
     * Récupère les métriques agrégées (lag, IOPS, etc.)
     */
    getMetrics: async () => {
        return axios.get(`${API_URL}/db/metrics`);
    },

    /**
     * Récupère la liste des réplicas
     */
    getReplicas: async () => {
        return axios.get(`${API_URL}/db/replicas`);
    },

    /**
     * Récupère l'historique des backups
     */
    getBackups: async () => {
        return axios.get(`${API_URL}/db/backups`);
    },

    /**
     * Récupère la liste de tous les clusters
     */
    getClusters: async () => {
        return axios.get(`${API_URL}/db/clusters`);
    },

    /**
     * Récupère les données de visualisation réseau (NetViz)
     */
    getNetVizData: async () => {
        return axios.get(`${API_URL}/db/net-viz`);
    },

    /**
     * Récupère les données de gestion de files d'attente (Q-Manager)
     */
    getQManagerData: async () => {
        return axios.get(`${API_URL}/db/q-manager`);
    },

    /**
     * Récupère les données de monitoring cloud (CloudMonitor)
     */
    getCloudMonitorData: async () => {
        return axios.get(`${API_URL}/db/cloud-monitor`);
    },

    /**
     * Récupère les données de performance DBA (DBA Sentinel)
     */
    getDBASentinelData: async () => {
        return axios.get(`${API_URL}/db/dba-sentinel`);
    }
};
