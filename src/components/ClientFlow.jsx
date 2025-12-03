import React, { useState } from 'react';
import GearCheck from './GearCheck';
import TrackingInput from './TrackingInput';

const ClientFlow = () => {
    const [step, setStep] = useState('slot-selection'); // 'slot-selection' | 'gear-check' | 'tracking-input' | 'confirmation'
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [hasGear, setHasGear] = useState(null);
    const [trackingCode, setTrackingCode] = useState('');

    // Mocked approved slots
    const approvedSlots = [
        { date: new Date(new Date().setDate(new Date().getDate() + 1)), time: 'Morning', range: '8am - 12pm' },
        { date: new Date(new Date().setDate(new Date().getDate() + 2)), time: 'Mid-day', range: '12pm - 4pm' },
        { date: new Date(new Date().setDate(new Date().getDate() + 3)), time: 'Evening', range: '4pm - 8pm' },
    ];

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setStep('gear-check');
    };

    const handleGearResponse = (response) => {
        setHasGear(response);
        if (response === true) {
            setStep('confirmation');
        } else {
            setStep('tracking-input');
        }
    };

    const handleTrackingSubmit = (code) => {
        setTrackingCode(code);
        setStep('confirmation');
    };

    const handleTrackingSkip = () => {
        setStep('confirmation');
    };

    return (
        <div className="app-container">
            <h1>Installation Setup</h1>

            {step === 'slot-selection' && (
                <div className="glass-card fade-in">
                    <h2>Select Installation Slot</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Please choose one of the available time slots for your installation.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {approvedSlots.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotSelect(slot)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: selectedSlot === slot ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                                    color: selectedSlot === slot ? '#fff' : 'var(--text-primary)',
                                    border: selectedSlot === slot ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                                    textAlign: 'left',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedSlot !== slot) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    if (selectedSlot !== slot) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                        {slot.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div style={{ opacity: 0.8 }}>{slot.time} ({slot.range})</div>
                                </div>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid ' + (selectedSlot === slot ? 'white' : 'var(--text-secondary)'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: selectedSlot === slot ? 'white' : 'transparent'
                                }}>
                                    {selectedSlot === slot && (
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'gear-check' && (
                <GearCheck onResponse={handleGearResponse} />
            )}

            {step === 'tracking-input' && (
                <TrackingInput onSubmit={handleTrackingSubmit} onSkip={handleTrackingSkip} />
            )}

            {step === 'confirmation' && (
                <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--secondary-color)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Installation Scheduled!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        We have confirmed your appointment.
                    </p>

                    <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date & Time</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                {selectedSlot?.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                            <p>{selectedSlot?.time} ({selectedSlot?.range})</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Gear Status</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                {hasGear ? 'Received' : 'Not Received'}
                            </p>
                            {!hasGear && trackingCode && (
                                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Tracking: {trackingCode}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientFlow;
