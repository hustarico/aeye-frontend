import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Feed.css';

const Feed = () => {
    // We use direct URLs for images because fetching blob via axios and creating ObjectURL 
    // is heavier for a 500ms MJPEG-like feed, but sticking to prompt "fetch GET ... 500ms".
    // Actually, setting src to a URL with timestamp is the standard way to "fetch" an image 
    // without manual axios handling for blobs.
    // Prompt says: "Logic: Use setInterval to fetch GET /api/images/1 and GET /api/images/2 every 500ms."
    // and "Append a query param... to the image URL".
    // This strongly implies setting the <img> src attribute.
    // However, if the images are protected (require Bearer token), header injection via <img> tag isn't possible directly.
    // CRITICAL: If images are protected, we MUST use axios to fetch Blob and create ObjectURL.
    // Prompt "Axios Interceptor: Automatically attach Authorization...".
    // If endpoints are protected, simple <img> src won't work.
    // I will implementation fetching via Axios Blob for security if they are protected.
    // But frequently refreshing blobs is heavy. 
    // Let's assume for now we use Axios to fetch blobs to respect the "Axios Interceptor" requirement strictly.

    // NOTE: If the backend supports cookie-based auth or query param auth, that's easier.
    // But with Bearer token in header, Blob is the way.

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);

    const fetchImage = async (id, setImg) => {
        try {
            const response = await api.get(`/api/images/${id}`, {
                responseType: 'blob',
                params: { t: Date.now() } // Cache busting
            });
            const url = URL.createObjectURL(response.data);
            setImg(prev => {
                if (prev) URL.revokeObjectURL(prev); // Cleanup old URL
                return url;
            });
        } catch (error) {
            console.error(`Failed to fetch image ${id}`, error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchImage(1, setImage1);
        fetchImage(2, setImage2);

        const intervalId = setInterval(() => {
            fetchImage(1, setImage1);
            fetchImage(2, setImage2);
        }, 500);

        return () => {
            clearInterval(intervalId);
            if (image1) URL.revokeObjectURL(image1);
            if (image2) URL.revokeObjectURL(image2);
        };
    }, []);

    return (
        <div className="feed-container">
            <h1>Live Surveillance</h1>
            <div className="feed-grid">
                <div className="cam-feed">
                    <div className="live-indicator">
                        <span className="dot"></span> Live
                    </div>
                    {image1 ? (
                        <img src={image1} alt="Camera 1" />
                    ) : (
                        <div className="placeholder">Loading Cam 1...</div>
                    )}
                    <div className="cam-label">Camera 01</div>
                </div>
                <div className="cam-feed">
                    <div className="live-indicator">
                        <span className="dot"></span> Live
                    </div>
                    {image2 ? (
                        <img src={image2} alt="Camera 2" />
                    ) : (
                        <div className="placeholder">Loading Cam 2...</div>
                    )}
                    <div className="cam-label">Camera 02</div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
