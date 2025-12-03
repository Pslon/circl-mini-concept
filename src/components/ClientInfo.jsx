import React from 'react';

const ClientInfo = () => {
    return (
        <div className="glass-card fade-in">
            <h2>Installation Details</h2>
            <div style={{ marginTop: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Client</p>
                <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>John Doe</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Address</p>
                <p style={{ fontSize: '1.125rem' }}>123 Starlink Avenue, Space City, CA 90210</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Details</p>
                <p style={{ fontSize: '1rem' }}>Starlink 2-storey installation. Roof access required.</p>
            </div>
        </div>
    );
};

export default ClientInfo;
