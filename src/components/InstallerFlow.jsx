import React, { useState } from 'react';
import ClientInfo from './ClientInfo';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import Confirmation from './Confirmation';

const InstallerFlow = () => {
    const [step, setStep] = useState('selection'); // 'selection' | 'confirmation'
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]); // Array of { date, time }

    const handleDateSelect = (date) => {
        const dateString = date.toDateString();
        const isAlreadySelected = selectedDates.some(d => d.toDateString() === dateString);

        if (isAlreadySelected) {
            // Deselect
            setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateString));
            // Also remove any slots associated with this date
            setSelectedSlots(selectedSlots.filter(s => s.date.toDateString() !== dateString));
        } else {
            // Select (max 3)
            if (selectedDates.length < 3) {
                // Add new date and sort them chronologically
                const newDates = [...selectedDates, date].sort((a, b) => a - b);
                setSelectedDates(newDates);
            }
        }
    };

    const handleTimeSelect = (date, time) => {
        const dateString = date.toDateString();

        // Check if this specific slot is already selected
        const isSelected = selectedSlots.some(
            s => s.date.toDateString() === dateString && s.time === time
        );

        if (isSelected) {
            // Remove it
            setSelectedSlots(selectedSlots.filter(
                s => !(s.date.toDateString() === dateString && s.time === time)
            ));
        } else {
            // Add it
            const newSlots = [...selectedSlots, { date, time }].sort((a, b) => {
                if (a.date.getTime() === b.date.getTime()) {
                    // Sort by time (Morning < Mid-day < Evening)
                    const timeOrder = { 'Morning': 1, 'Mid-day': 2, 'Evening': 3 };
                    return timeOrder[a.time] - timeOrder[b.time];
                }
                return a.date - b.date;
            });
            setSelectedSlots(newSlots);
        }
    };

    const handleConfirm = () => {
        setStep('confirmation');
    };

    // Validation: Ensure every selected date has at least one time slot selected
    const canConfirm = selectedDates.length > 0 && selectedDates.every(date =>
        selectedSlots.some(slot => slot.date.toDateString() === date.toDateString())
    );

    return (
        <div className="app-container">
            <h1>Installer Availability</h1>

            {step === 'selection' && (
                <>
                    <ClientInfo />
                    <DateSelection
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                    />
                    <TimeSelection
                        selectedDates={selectedDates}
                        selectedSlots={selectedSlots}
                        onTimeSelect={handleTimeSelect}
                    />

                    {selectedDates.length > 0 && (
                        <div className="fade-in" style={{ marginTop: '1rem' }}>
                            <button
                                className="btn-primary"
                                onClick={handleConfirm}
                                disabled={!canConfirm}
                                style={{
                                    opacity: canConfirm ? 1 : 0.5,
                                    cursor: canConfirm ? 'pointer' : 'not-allowed',
                                    background: canConfirm ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' : '#475569'
                                }}
                            >
                                {canConfirm ? 'Confirm Availability' : 'Select times for all dates'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {step === 'confirmation' && (
                <Confirmation selectedSlots={selectedSlots} />
            )}
        </div>
    );
};

export default InstallerFlow;
