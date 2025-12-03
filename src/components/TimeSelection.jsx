import React from 'react';

const TimeSelection = ({ selectedDates, selectedSlots, onTimeSelect }) => {
    if (selectedDates.length === 0) return null;

    const timeOptions = [
        { id: 'Morning', label: 'Morning', range: '8am - 12pm' },
        { id: 'Mid-day', label: 'Mid-day', range: '12pm - 4pm' },
        { id: 'Evening', label: 'Evening', range: '4pm - 8pm' }
    ];

    const isTimeSelected = (date, timeId) => {
        return selectedSlots.some(
            slot => slot.date.toDateString() === date.toDateString() && slot.time === timeId
        );
    };

    return (
        <div className="glass-card fade-in">
            <h2>Select Time Slots</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Choose preferred time slots for each selected date. You can select multiple.
            </p>

            {selectedDates.map((date) => (
                <div key={date.toDateString()} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>
                        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {timeOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onTimeSelect(date, option.id)}
                                style={{
                                    flex: '1',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    background: isTimeSelected(date, option.id) ? 'var(--secondary-color)' : 'rgba(255, 255, 255, 0.05)',
                                    color: isTimeSelected(date, option.id) ? '#fff' : 'var(--text-primary)',
                                    border: isTimeSelected(date, option.id) ? '1px solid var(--secondary-color)' : '1px solid var(--glass-border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '100px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{option.label}</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{option.range}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimeSelection;
