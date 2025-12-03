import React from 'react';

const Confirmation = ({ selectedSlots }) => {
    return (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{
                width: '64px',
                height: '64px',
                background: 'var(--primary-color)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Availability Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Thank you for submitting your availability. We have recorded the following preferences:
            </p>

            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                {/* Group slots by date for display */}
                {Object.entries(selectedSlots.reduce((acc, slot) => {
                    const dateStr = slot.date.toDateString();
                    if (!acc[dateStr]) acc[dateStr] = { date: slot.date, times: [] };
                    acc[dateStr].times.push(slot.time);
                    return acc;
                }, {})).map(([key, { date, times }]) => (
                    <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 0',
                        borderBottom: '1px solid var(--glass-border)'
                    }}>
                        <span style={{ fontWeight: '600' }}>
                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {times.map(time => (
                                <span key={time} style={{
                                    color: 'var(--secondary-color)',
                                    background: 'rgba(236, 72, 153, 0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}>
                                    {time}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Confirmation;
