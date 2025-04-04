import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const AdminRoles = () => {
    const [adminRoles, setAdminRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('No access token found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE}/admins`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Fetched admins:', response.data);
                const data = Array.isArray(response.data) ? response.data : [];
                setAdminRoles(data);
            } catch (err) {
                console.error('Error fetching admins:', err);
                setError('Failed to load admins. Please check your token or backend.');
                setAdminRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <div className="section admin-roles-section">
            <h3>Manage Admin Details</h3>

            <div className="table-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <table className="rs-table">
                        <thead>
                        <tr>
                            <th>Role</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Full Name</th>
                            <th>First Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adminRoles.length > 0 ? (
                            adminRoles.map((admin) => (
                                <tr key={admin.id || admin._id}>
                                    <td>{admin.role}</td>
                                    <td>{admin.username}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.phone || '—'}</td>
                                    <td>{admin.firstName} {admin.lastName}</td>
                                    <td>{admin.firstName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No admins found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminRoles;
