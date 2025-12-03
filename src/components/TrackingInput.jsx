import React, { useState } from 'react';

const TrackingInput = ({ onSubmit, onSkip }) => {
    const [code, setCode] = useState('');

    return (
        <div className="glass-card fade-in">
            <h2>Tracking Information</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Please provide your tracking code. We will use this to automatically reschedule if the package doesn't arrive on time.
            </p>

            <input
                type="text"
                placeholder="Enter tracking number..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '1.5rem',
                    outline: 'none'
                }}
            />

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <button
                    className="btn-primary"
                    onClick={() => onSubmit(code)}
                    disabled={!code.trim()}
                    style={{ margin: 0, opacity: code.trim() ? 1 : 0.5 }}
                >
                    Submit Tracking Code
                </button>
                <button
                    onClick={onSkip}
                    style={{
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        textDecoration: 'underline'
                    }}
                >
                    Skip this step
                </button>
            </div>
        </div>
    );
};

export default TrackingInput;
