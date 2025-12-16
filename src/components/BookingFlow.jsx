import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const BookingFlow = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [step, setStep] = useState('form'); // 'form' | 'submitting' | 'estimation' | 'payment_processing' | 'success' | 'failure'
    const API_URL = import.meta.env.VITE_API_URL || '';
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        installationAddress: '',
        propertyType: 'residential',
        buildingType: 'house',
        storeys: 'one',
        roofType: 'tile',
        mountLocation: 'roof',
        heritageListed: false,
        customerEquipment: [],
        animalsOnSite: false,
        mobileCoverage: 'good'
    });
    const [estimation, setEstimation] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const idFromParams = searchParams.get('bookingId');

        if (paymentStatus === 'success') {
            setStep('success');
            if (idFromParams) {
                setBookingId(idFromParams);
                fetchBookingDetails(idFromParams);
            }
        } else if (paymentStatus === 'failed') {
            setStep('failure');
        }
    }, [searchParams]);

    const fetchBookingDetails = async (id) => {
        setLoadingDetails(true);
        try {
            const response = await fetch(`${API_URL}/bookings/${id}`);
            if (!response.ok) throw new Error('Failed to fetch booking details');
            const data = await response.json();
            setBookingDetails(data);
        } catch (err) {
            console.error('Error fetching booking details:', err);
            // Non-critical error, we just won't show the details
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'customerEquipment') {
                // specialized handling if we had multiple equipment checkboxes, 
                // but for now let's assume specific logic or simple boolean mapping if needed.
                // The sample payload uses an array ["cable_45m"]. 
                // Let's implement a specific handler for equipment or just treat it as a special case below.
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEquipmentChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const current = prev.customerEquipment;
            if (checked) {
                return { ...prev, customerEquipment: [...current, value] };
            } else {
                return { ...prev, customerEquipment: current.filter(item => item !== value) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStep('submitting');
        setError(null);

        try {
            // In a real app, this would be an environment variable
            const response = await fetch(`${API_URL}/bookings/installation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create booking');
            }

            const data = await response.json();
            setBookingId(data.id);
            setEstimation(data.estimation);
            setStep('estimation');
        } catch (err) {
            console.error(err);
            setError('There was an error creating your booking. Please try again.');
            setStep('form');
        }
    };

    const handlePayment = async () => {
        if (!bookingId) return;
        setStep('payment_processing');

        try {
            const response = await fetch(`${API_URL}/payments/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId }),
            });

            if (!response.ok) {
                throw new Error('Failed to initiate payment');
            }

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to start payment. Please try again.');
            setStep('estimation');
        }
    };

    if (step === 'success') {
        return (
            <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                    width: '64px', height: '64px', background: '#10b981', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Payment Successful!</h2>
                <p style={{ marginBottom: '1rem' }}>Your installation booking has been confirmed.</p>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Our team will be in touch shortly to arrange the installation.</p>

                {loadingDetails && <p style={{ color: 'var(--text-secondary)' }}>Loading details...</p>}

                {bookingDetails && (
                    <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{bookingDetails.fullName}</p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</p>
                            <p style={{ fontSize: '1.1rem' }}>{bookingDetails.email}</p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Installation Address</p>
                            <p style={{ fontSize: '1.1rem' }}>{bookingDetails.installationAddress}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Property Type</p>
                                <p style={{ textTransform: 'capitalize' }}>{bookingDetails.propertyType || '-'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Building Type</p>
                                <p style={{ textTransform: 'capitalize' }}>{bookingDetails.buildingType || '-'}</p>
                            </div>
                        </div>

                        {bookingDetails.estimation && (
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Cost</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                    ${bookingDetails.estimation.totalCost}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => {
                        setStep('form');
                        setFormData({ ...formData, email: '' });
                        setBookingId(null);
                        setBookingDetails(null);
                        setSearchParams({});
                    }}
                    className="btn-primary"
                    style={{ width: 'auto' }}
                >
                    Book Another
                </button>
            </div>
        );
    }

    if (step === 'failure') {
        return (
            <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Payment Failed</h2>
                <p>Something went wrong with the payment.</p>
                <button
                    onClick={() => {
                        // If we had the booking ID and state preserved, we could go back to estimation.
                        // For now, simpler to restart or if we persisted state, recover it.
                        // Assuming "back to home" or retry logic if feasible.
                        // Let's just go to form for safety or if we had a way to resume... 
                        // Actually, if we just came back from stripe, state is lost unless persisted.
                        setStep('form');
                    }}
                    className="btn-primary"
                    style={{ marginTop: '2rem', width: 'auto' }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ maxWidth: step === 'form' ? '600px' : '500px', margin: '0 auto' }}>
            <h1 className="fade-in">Starlink Installation</h1>

            {error && (
                <div className="glass-card" style={{
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#fca5a5',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            {step === 'form' && (
                <form onSubmit={handleSubmit} className="glass-card fade-in">
                    <h2 style={{ marginBottom: '1.5rem' }}>Booking Details</h2>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Installation Address</label>
                        <input required type="text" name="installationAddress" value={formData.installationAddress} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Type</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Building Type</label>
                            <select name="buildingType" value={formData.buildingType} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                                <option value="house">House</option>
                                <option value="unit">Unit</option>
                                <option value="warehouse">Warehouse</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Storeys</label>
                            <select name="storeys" value={formData.storeys} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                                <option value="one">One</option>
                                <option value="two">Two</option>
                                <option value="three_plus">Three+</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Roof Type</label>
                            <select name="roofType" value={formData.roofType} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                                <option value="tile">Tile</option>
                                <option value="tin">Tin</option>
                                <option value="shingle">Shingle</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mount Location</label>
                        <select name="mountLocation" value={formData.mountLocation} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                            <option value="roof">Roof</option>
                            <option value="wall">Wall</option>
                            <option value="pole">Pole</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mobile Coverage</label>
                        <select name="mobileCoverage" value={formData.mobileCoverage} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                            <option value="good">Good</option>
                            <option value="poor">Poor</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" name="heritageListed" checked={formData.heritageListed} onChange={handleChange}
                                style={{ width: '18px', height: '18px' }} />
                            <span>Heritage Listed Property</span>
                        </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" name="animalsOnSite" checked={formData.animalsOnSite} onChange={handleChange}
                                style={{ width: '18px', height: '18px' }} />
                            <span>Animals on Site</span>
                        </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Customer Equipment</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', border: formData.customerEquipment.includes('cable_45m') ? '1px solid var(--primary-color)' : '1px solid transparent' }}>
                                <input type="checkbox" value="cable_45m" checked={formData.customerEquipment.includes('cable_45m')} onChange={handleEquipmentChange}
                                    style={{ width: '16px', height: '16px' }} />
                                <span>45m Cable</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={step === 'submitting'}>
                        {step === 'submitting' ? 'Calculating...' : 'Get Quote'}
                    </button>
                </form>
            )}

            {step === 'estimation' && estimation && (
                <div className="glass-card fade-in">
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Installation Quote</h2>

                    <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Travel Cost</span>
                            <span>${estimation.travelCost}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Base Installation</span>
                            <span>${estimation.baseCost}</span>
                        </div>
                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--secondary-color)' }}>${estimation.totalCost}</span>
                        </div>
                    </div>

                    {estimation.requiresManualPricing ? (
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15', borderRadius: '8px' }}>
                            <p>This installation requires manual pricing. Our team will contact you shortly.</p>
                        </div>
                    ) : estimation.totalCost === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Installation Covered by Starlink</p>
                            <p>Our team will be in touch shortly to arrange the installation.</p>
                        </div>
                    ) : (
                        <button onClick={handlePayment} className="btn-primary">
                            Proceed to Payment
                        </button>
                    )}

                    <button
                        onClick={() => setStep('form')}
                        style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', width: '100%', padding: '0.5rem' }}
                    >
                        &larr; Edit Details
                    </button>
                </div>
            )}

            {step === 'payment_processing' && (
                <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid var(--primary-color)',
                        borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1.5rem auto',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p>Redirecting to payment provider...</p>
                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
