import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        phoneNumber: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setFormData({ username: '', password: '', phoneNumber: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                // LOGIN
                const response = await api.post('/auth/login', {
                    username: formData.username,
                    password: formData.password
                });

                const tokenVal = response.data.token || response.data.accessToken || (typeof response.data === 'string' ? response.data : null);

                login(tokenVal);
                navigate('/feed');
            } else {
                // REGISTER
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                const registerPayload = {
                    username: formData.username,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                };

                const regResponse = await api.post('/auth/register', registerPayload);

                // Try to see if token is in registration response, otherwise login
                let tokenVal = regResponse.data.token || regResponse.data.accessToken;

                if (!tokenVal) {
                    // Automatically login after registration
                    const loginResponse = await api.post('/auth/login', {
                        username: formData.username,
                        password: formData.password
                    });
                    tokenVal = loginResponse.data.token || loginResponse.data.accessToken || (typeof loginResponse.data === 'string' ? loginResponse.data : null);
                }

                if (tokenVal) {
                    login(tokenVal);
                    navigate('/feed');
                } else {
                    // Fallback if no token is returned
                    setIsLogin(true);
                    setSuccess('Registration successful! Please login.');
                }
            }
        } catch (err) {
            console.error(err);
            let errorMessage = 'Authentication failed. Please try again.';

            if (err.response) {
                const data = err.response.data;
                // Handle different error response shapes
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (data.error) {
                    errorMessage = data.error;
                }

                // Specifically catch "phone number already in use" cases if they look like backend stack traces or generic messages
                if (errorMessage.toLowerCase().includes('phone') && (errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('use'))) {
                    errorMessage = 'This phone number is already registered.';
                } else if (errorMessage.toLowerCase().includes('username') && (errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('use'))) {
                    errorMessage = 'This username is already taken. Please choose another one.';
                }
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    )}
                    <button type="submit" className="auth-btn">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="toggle-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={toggleMode}>{isLogin ? 'Register' : 'Login'}</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
