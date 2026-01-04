import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Analytics.css';

const Analytics = () => {
    const [analyticsImg, setAnalyticsImg] = useState(null);
    const [threats, setThreats] = useState([]);
    const [loadingThreats, setLoadingThreats] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/api/analytics', {
                    responseType: 'blob',
                    params: { t: Date.now() }
                });
                const url = URL.createObjectURL(response.data);
                setAnalyticsImg(url);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };

        const fetchThreatHistory = async () => {
            try {
                const response = await api.get('/api/v1/threats/history');
                setThreats(response.data);
            } catch (error) {
                console.error("Failed to fetch threat history", error);
            } finally {
                setLoadingThreats(false);
            }
        };

        fetchAnalytics();
        fetchThreatHistory();

        return () => {
            if (analyticsImg) URL.revokeObjectURL(analyticsImg);
        };
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="analytics-container">
            <h1>Analytics Dashboard</h1>

            <div className="analytics-image-container">
                {analyticsImg ? (
                    <img
                        src={analyticsImg}
                        alt="Analytics Data"
                        className="analytics-image"
                    />
                ) : (
                    <p className="loading-text">Loading Analytics Data...</p>
                )}
            </div>

            <div className="threat-history-section">
                <h2>Threat Detection History</h2>
                {loadingThreats ? (
                    <p className="loading-text">Loading threat history...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="threat-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Camera</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threats.length > 0 ? (
                                    threats.map((threat, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{threat.cameraName}</td>
                                            <td>{formatTimestamp(threat.timestamp)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="no-data">No threats detected</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
