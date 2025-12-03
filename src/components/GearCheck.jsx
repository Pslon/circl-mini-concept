import React from 'react';

const GearCheck = ({ onResponse }) => {
    return (
        <div className="glass-card fade-in">
            <h2>Equipment Check</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Have you already received your Starlink gear?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => onResponse(true)}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                    Yes
                </button>
                <button
                    onClick={() => onResponse(false)}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                    No
                </button>
            </div>
        </div>
    );
};

export default GearCheck;
