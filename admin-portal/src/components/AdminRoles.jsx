// src/components/AdminRoles.jsx
import React, { useState } from 'react';


const AdminRoles = () => {
    const [adminFilter, setAdminFilter] = useState({
        user: '',
        date: '',
        actionType: 'All'
    });
    const [adminRoles] = useState([
        {
            id: 'admin1',
            user: 'Alice',
            action: 'Assigned community-admin',
            date: '2023-04-10',
            permissions: 'View, Edit'
        },
        {
            id: 'admin2',
            user: 'Bob',
            action: 'Viewed role-permissions',
            date: '2023-04-11',
            permissions: 'View'
        }
    ]);

    const filteredRoles = adminRoles.filter(role =>
        (adminFilter.user === '' || role.user.toLowerCase().includes(adminFilter.user.toLowerCase())) &&
        (adminFilter.date === '' || role.date === adminFilter.date) &&
        (adminFilter.actionType === 'All' ||
            (adminFilter.actionType === 'assign' && role.action.includes('Assigned')) ||
            (adminFilter.actionType === 'view' && role.action.includes('Viewed')))
    );

    return (
        <div className="section admin-roles-section">
            <h3>Manage Admin Roles</h3>
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Filter by user"
                    value={adminFilter.user}
                    onChange={(e) =>
                        setAdminFilter({ ...adminFilter, user: e.target.value })
                    }
                />
                <input
                    type="date"
                    placeholder="Filter by date"
                    value={adminFilter.date}
                    onChange={(e) =>
                        setAdminFilter({ ...adminFilter, date: e.target.value })
                    }
                />
                <select
                    value={adminFilter.actionType}
                    onChange={(e) =>
                        setAdminFilter({ ...adminFilter, actionType: e.target.value })
                    }
                >
                    <option value="All">All Actions</option>
                    <option value="assign">Assign Community Admin</option>
                    <option value="view">View Role-Permissions</option>
                    <option value="other">Other Admin Actions</option>
                </select>
            </div>
            <div className="table-container">
                <table className="rs-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Date</th>
                        <th>Permissions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.user}</td>
                                <td>{role.action}</td>
                                <td>{role.date}</td>
                                <td>{role.permissions}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No admin roles found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRoles;
