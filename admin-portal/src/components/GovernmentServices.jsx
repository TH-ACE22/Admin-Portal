// src/components/GovernmentServices.jsx
import React, { useState } from 'react';

const GovernmentServices = () => {
    const [govServiceForm, setGovServiceForm] = useState({
        name: '',
        channelId: '',
        description: '',
        contactEmail: ''
    });
    const [govServices, setGovServices] = useState([]);
    const [govServantForm, setGovServantForm] = useState({
        governmentServantId: '',
        name: '',
        email: '',
        contactNumber: '',
        governmentDepartment: '',
        role: '',
        waterIssues: '',
        assignedChannels: ''
    });
    const [govServants, setGovServants] = useState([]);

    const handleGovServiceSubmit = (e) => {
        e.preventDefault();
        const newService = {
            ...govServiceForm,
            id: new Date().getTime().toString()
        };
        setGovServices([newService, ...govServices]);
        setGovServiceForm({ name: '', channelId: '', description: '', contactEmail: '' });
        alert('Government Service created.');
    };

    const handleGovServantSubmit = (e) => {
        e.preventDefault();
        const newServant = {
            ...govServantForm,
            id: new Date().getTime().toString(),
            assignedChannels: govServantForm.assignedChannels
                .split(',')
                .map((ch) => ch.trim())
        };
        setGovServants([newServant, ...govServants]);
        setGovServantForm({
            governmentServantId: '',
            name: '',
            email: '',
            contactNumber: '',
            governmentDepartment: '',
            role: '',
            waterIssues: '',
            assignedChannels: ''
        });
        alert('Government Servant created.');
    };

    return (
        <div className="section gov-services-section">
            <h3>Government Services</h3>
            <div className="gov-service-forms">
                <form className="gov-services-form" onSubmit={handleGovServiceSubmit}>
                    <h4>Create Government Service</h4>
                    <input
                        type="text"
                        placeholder="Service Name"
                        value={govServiceForm.name}
                        onChange={(e) =>
                            setGovServiceForm({ ...govServiceForm, name: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Channel ID"
                        value={govServiceForm.channelId}
                        onChange={(e) =>
                            setGovServiceForm({ ...govServiceForm, channelId: e.target.value })
                        }
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={govServiceForm.description}
                        onChange={(e) =>
                            setGovServiceForm({ ...govServiceForm, description: e.target.value })
                        }
                        required
                    ></textarea>
                    <input
                        type="email"
                        placeholder="Contact Email"
                        value={govServiceForm.contactEmail}
                        onChange={(e) =>
                            setGovServiceForm({ ...govServiceForm, contactEmail: e.target.value })
                        }
                        required
                    />
                    <button type="submit">Create Service</button>
                </form>

                <form className="gov-servant-form" onSubmit={handleGovServantSubmit}>
                    <h4>Create Government Servant</h4>
                    <input
                        type="text"
                        placeholder="Government Servant ID"
                        value={govServantForm.governmentServantId}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, governmentServantId: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={govServantForm.name}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, name: e.target.value })
                        }
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={govServantForm.email}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, email: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={govServantForm.contactNumber}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, contactNumber: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Government Department"
                        value={govServantForm.governmentDepartment}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, governmentDepartment: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={govServantForm.role}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, role: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Water Issues"
                        value={govServantForm.waterIssues}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, waterIssues: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Assigned Channels (comma separated)"
                        value={govServantForm.assignedChannels}
                        onChange={(e) =>
                            setGovServantForm({ ...govServantForm, assignedChannels: e.target.value })
                        }
                    />
                    <button type="submit">Create Government Servant</button>
                </form>
            </div>

            <div className="gov-services-tables">
                <div className="table-container">
                    <h4>Government Services</h4>
                    <table className="rs-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Service Name</th>
                            <th>Channel ID</th>
                            <th>Description</th>
                            <th>Contact Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {govServices.length > 0 ? (
                            govServices.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.id}</td>
                                    <td>{service.name}</td>
                                    <td>{service.channelId}</td>
                                    <td>{service.description}</td>
                                    <td>{service.contactEmail}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No government services created yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h4>Government Servants</h4>
                    <table className="rs-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Water Issues</th>
                            <th>Assigned Channels</th>
                        </tr>
                        </thead>
                        <tbody>
                        {govServants.length > 0 ? (
                            govServants.map((servant) => (
                                <tr key={servant.id}>
                                    <td>{servant.id}</td>
                                    <td>{servant.name}</td>
                                    <td>{servant.email}</td>
                                    <td>{servant.contactNumber}</td>
                                    <td>{servant.governmentDepartment}</td>
                                    <td>{servant.role}</td>
                                    <td>{servant.waterIssues}</td>
                                    <td>{servant.assignedChannels.join(', ')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No government servants created yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GovernmentServices;
