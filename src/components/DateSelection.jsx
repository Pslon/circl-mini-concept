import React, { useState, useEffect } from 'react';

const DateSelection = ({ selectedDates, onDateSelect }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const nextWeek = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            nextWeek.push(date);
        }
        setDates(nextWeek);
    }, []);

    const handleDateClick = (date) => {
        onDateSelect(date);
    };

    const isSelected = (date) => {
        return selectedDates.some(d => d.toDateString() === date.toDateString());
    };

    return (
        <div className="glass-card fade-in">
            <h2>Select Dates</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Select up to 3 preferred dates for installation.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
                {dates.map((date) => (
                    <button
                        key={date.toDateString()}
                        onClick={() => handleDateClick(date)}
                        style={{
                            padding: '0.75rem 0.5rem',
                            borderRadius: '12px',
                            background: isSelected(date) ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                            color: isSelected(date) ? '#fff' : 'var(--text-primary)',
                            border: isSelected(date) ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                            {date.getDate()}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateSelection;
