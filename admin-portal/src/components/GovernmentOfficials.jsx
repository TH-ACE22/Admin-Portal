// src/components/GovernmentOfficials.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const GovernmentOfficials = () => {
    // Form state + feedback/toast
    const [form, setForm] = useState({
        username: '', firstName: '', lastName: '', email: '', phone: '', department: '', password: ''
    });
    const [errors, setErrors]           = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting]   = useState(false);

    // Toast notification
    const [toast, setToast] = useState({ message: '', type: '' });
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    // Channels & officials
    const [availableChannels, setAvailableChannels] = useState([]);
    const [assignedChannels, setAssignedChannels]   = useState([]);
    const [officials, setOfficials]                 = useState([]);
    const [draggedChannel, setDraggedChannel]       = useState(null);

    // Fetch on mount
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setGlobalError('Authentication required.');
            setLoadingData(false);
            return;
        }
        (async () => {
            try {
                const [offRes, chRes] = await Promise.all([
                    axios.get(`${API_BASE}/government-officials`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE}/channels`,            { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const normalized = Array.isArray(offRes.data)
                    ? offRes.data.map(o => ({
                        ...o,
                        assignedChannels: Array.isArray(o.assignedChannels) ? o.assignedChannels : []
                    }))
                    : [];
                setOfficials(normalized);
                setAvailableChannels(chRes.data || []);
            } catch {
                setGlobalError('Failed to load data.');
            } finally {
                setLoadingData(false);
            }
        })();
    }, []);

    // Validation
    const validate = () => {
        const t = {};
        t.username  = form.username  ? '' : 'Required';
        t.firstName = form.firstName ? '' : 'Required';
        t.lastName  = form.lastName  ? '' : 'Required';
        t.email     = form.email
            ? /\S+@\S+\.\S+/.test(form.email) ? '' : 'Invalid email format'
            : 'Required';
        t.phone      = form.phone      ? '' : 'Required';
        t.department = form.department ? '' : 'Required';
        t.password   = form.password.length >= 6 ? '' : 'Min 6 chars';
        t.channels   = assignedChannels.length > 0 ? '' : 'Assign at least one';
        setErrors(t);
    };
    useEffect(validate, [form, assignedChannels]);

    // Drag & drop handlers
    const onDragStart  = channel => setDraggedChannel(channel);
    const onDragOver   = e => e.preventDefault();
    const onDropAssign = () => {
        if (draggedChannel && !assignedChannels.find(c => c.id === draggedChannel.id)) {
            setAssignedChannels([...assignedChannels, draggedChannel]);
        }
        setDraggedChannel(null);
    };
    const onDropRemove = () => {
        if (draggedChannel) setAssignedChannels(assignedChannels.filter(c => c.id !== draggedChannel.id));
        setDraggedChannel(null);
    };

    const isFormValid = Object.values(errors).every(x => x === '');

    // Form field change
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setGlobalError('');
    };

    // Uniqueness checks
    const checkUsername = () => {
        if (!form.username) return;
        const exists = officials.some(o => o.username === form.username);
        if (exists) {
            setErrors(prev => ({ ...prev, username: 'Username already in use.' }));
            return;
        }
        axios.get(`${API_BASE}/auth/check-username/${encodeURIComponent(form.username)}`)
            .then(res => {
                if (!res.data) setErrors(prev => ({ ...prev, username: 'Username already exists.' }));
            })
            .catch(() => {});
    };

    const checkEmail = () => {
        if (!form.email) return;
        const exists = officials.some(o => o.email === form.email);
        if (exists) {
            setErrors(prev => ({ ...prev, email: 'Email already in use.' }));
            return;
        }
        axios.get(`${API_BASE}/auth/check-email/${encodeURIComponent(form.email)}`)
            .then(res => {
                if (!res.data) setErrors(prev => ({ ...prev, email: 'Email already registered.' }));
            })
            .catch(() => {});
    };

    // Submit handler
    const handleSubmit = async e => {
        e.preventDefault();
        setGlobalError('');
        if (!isFormValid) return;

        setSubmitting(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setGlobalError('Authentication required.');
            setSubmitting(false);
            return;
        }

        // Use channel IDs instead of names to persist correctly
        const payload = {
            ...form,
            assignedChannelIds: assignedChannels.map(c => c.id)
        };

        try {
            const res = await axios.post(
                `${API_BASE}/government-officials/create`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOfficials([{ ...res.data, assignedChannels: res.data.assignedChannels || [] }, ...officials]);
            showToast('Registered successfully!', 'success');
            setForm({ username: '', firstName: '', lastName: '', email: '', phone: '', department: '', password: '' });
            setAssignedChannels([]);
        } catch (err) {
            if (err.response?.status === 409) {
                const data = err.response.data;
                let fieldErrors = {};
                if (Array.isArray(data)) {
                    data.forEach(item => Object.entries(item).forEach(([field, msg]) => { fieldErrors[field] = msg; }));
                } else if (typeof data === 'object') {
                    Object.entries(data).forEach(([field, msg]) => { fieldErrors[field] = msg; });
                }
                setErrors(prev => ({ ...prev, ...fieldErrors }));
                showToast('Please fix the highlighted fields.', 'error');
            } else {
                const msg = err.response?.data?.message || 'Registration failed.';
                showToast(msg, 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Styles
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem 1rem' };
    const inputStyle = { padding: '0.4rem 0.75rem', fontSize: '0.875rem' };

    return (
        <div className="section gov-official-section">
            <h3>Government Officials</h3>
            {toast.message && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, padding: '0.75rem 1.25rem', borderRadius: 4,
                    backgroundColor: toast.type === 'success' ? '#2ecc71' : '#e74c3c',
                    color: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                    {toast.message}
                </div>
            )}
            {globalError && (
                <div style={{ backgroundColor: '#e74c3c', color:'#fff', padding:'0.75rem', borderRadius:4 }}>
                    {globalError}
                </div>
            )}

            <form className="gov-official-form" onSubmit={handleSubmit}>
                <h4 style={{ marginBottom:'1rem', fontSize:'1.15rem' }}>Create Government Official</h4>
                <div style={gridStyle}>
                    {[
                        { name:'username',  label:'Username',   type:'text',    onBlur:checkUsername },
                        { name:'firstName', label:'First Name', type:'text' },
                        { name:'lastName',  label:'Last Name',  type:'text' },
                        { name:'email',     label:'Email',      type:'email',   onBlur:checkEmail },
                        { name:'phone',     label:'Phone',      type:'text' },
                        { name:'department',label:'Department', type:'text' },
                        { name:'password',  label:'Password',   type:'password' }
                    ].map(f => (
                        <div key={f.name}>
                            <label htmlFor={f.name} style={{ fontSize:'0.9rem' }}>{f.label}</label>
                            <input
                                {...f} id={f.name} name={f.name}
                                value={form[f.name]} onChange={handleChange}
                                style={{ ...inputStyle, borderColor: errors[f.name] ? '#c0392b' : '#ddd' }}
                            />
                            {errors[f.name] && (
                                <div style={{ color:'#c0392b', fontSize:'0.75rem', marginTop:'-0.5rem' }}>{errors[f.name]}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="channels-container" style={{ marginTop:'1rem' }}>
                    <div className="channels-list" onDragOver={onDragOver} onDrop={onDropRemove} style={{ padding:'0.5rem', minHeight:'120px' }}>
                        <h5 style={{ marginBottom:'0.5rem' }}>Available Channels</h5>
                        <ul style={{ listStyle:'none', padding:0 }}>
                            {availableChannels.map(ch => (
                                <li key={ch.id} draggable onDragStart={()=>onDragStart(ch)} style={{ padding:'6px 10px', margin:'4px 0', fontSize:'0.875rem' }}>{ch.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="channels-list assigned" onDragOver={onDragOver} onDrop={onDropAssign} style={{ padding:'0.5rem', minHeight:'120px' }}>
                        <h5 style={{ marginBottom:'0.5rem' }}>Assigned Channels</h5>
                        <ul style={{ listStyle:'none', padding:0 }}>
                            {assignedChannels.map(ch => (
                                <li key={ch.id} draggable onDragStart={()=>onDragStart(ch)} style={{ padding:'6px 10px', margin:'4px 0', fontSize:'0.875rem' }}>{ch.name}</li>
                            ))}
                        </ul>
                        {errors.channels && <div style={{ color:'#c0392b', fontSize:'0.75rem' }}>{errors.channels}</div>}
                    </div>
                </div>

                <button type="submit" disabled={!isFormValid || submitting} style={{ marginTop:'1rem', padding:'0.6rem 1rem', fontSize:'0.9rem', opacity:(!isFormValid||submitting)?0.6:1 }}>
                    {submitting ? 'Saving…' : 'Create Official'}
                </button>
            </form>

            <div className="table-container" style={{ marginTop:'2rem' }}>
                <h4 style={{ fontSize:'1.1rem', marginBottom:'0.5rem' }}>Existing Officials</h4>
                {loadingData ? <p>Loading…</p> : (
                    <table className="rs-table">
                        <thead>
                        <tr><th>Username</th><th>First</th><th>Last</th><th>Email</th><th>Phone</th><th>Dept.</th><th>Channels</th></tr>
                        </thead>
                        <tbody>
                        {officials.map(o => (
                            <tr key={o.id || o._id}>
                                <td>{o.username}</td>
                                <td>{o.firstName}</td>
                                <td>{o.lastName}</td>
                                <td>{o.email}</td>
                                <td>{o.phone}</td>
                                <td>{o.department}</td>
                                <td>
                                    {(o.assignedChannels || [])
                                        .map(id => availableChannels.find(c => c.id === id)?.name || id)
                                        .join(', ')
                                    }
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GovernmentOfficials;
