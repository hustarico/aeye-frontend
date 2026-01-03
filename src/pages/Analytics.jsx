import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Analytics = () => {
    const [analyticsImg, setAnalyticsImg] = useState(null);

    useEffect(() => {
        // Fetch analytics image once or interval? "Display a single large image"
        // Prompt doesn't specify refresh, but typically analytics might be static or refreshed slowly.
        // I will fetch once on mount, and maybe add a manual refresh button if needed.
        // Assuming it's an image endpoint comparable to the feed ones.

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

        fetchAnalytics();

        return () => {
            if (analyticsImg) URL.revokeObjectURL(analyticsImg);
        };
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Analytics Dashboard</h1>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                border: '1px solid #333',
                backgroundColor: '#000',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {analyticsImg ? (
                    <img
                        src={analyticsImg}
                        alt="Analytics Data"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                ) : (
                    <p style={{ color: '#666' }}>Loading Analytics Data...</p>
                )}
            </div>
        </div>
    );
};

export default Analytics;
