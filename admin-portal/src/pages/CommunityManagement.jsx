
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // ← named import
import Sidebar from '../components/Sidebar';
import '../styles/CommunityManagement.css';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const CommunityManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [availableChannels, setAvailableChannels] = useState([]);

  // We'll auto-fill createdBy from the token
  const token = localStorage.getItem('accessToken');
  let adminUsername = '';
  try {
    const decoded = jwtDecode(token);
    // use either preferred_username or name claim
    adminUsername = decoded.preferred_username || decoded.name || '';
  } catch {
    adminUsername = '';
  }

  const [newComm, setNewComm] = useState({
    name: '',
    location: '',
    description: '',
    channelIds: [],
    createdBy: adminUsername
  });

  const [errors, setErrors] = useState({
    fetch: '',
    create: '',
    delete: ''
  });
  const [loading, setLoading] = useState({
    fetch: true,
    create: false,
    deleteId: null
  });

  // Fetch communities & channels
  useEffect(() => {
    const fetchAll = async () => {
      setLoading((l) => ({ ...l, fetch: true }));
      try {
        const [comRes, chRes] = await Promise.all([
          fetch(`${API_URL}/communities`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/channels`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        if (!comRes.ok) throw new Error('Failed to load communities');
        if (!chRes.ok) throw new Error('Failed to load channels');
        const [comData, chData] = await Promise.all([
          comRes.json(),
          chRes.json()
        ]);
        setCommunities(comData);
        setAvailableChannels(chData);
        setErrors((e) => ({ ...e, fetch: '' }));
      } catch (err) {
        setErrors((e) => ({ ...e, fetch: err.message }));
      } finally {
        setLoading((l) => ({ ...l, fetch: false }));
      }
    };
    fetchAll();
  }, [token]);

  // Create
  const handleAddCommunity = async () => {
    setErrors((e) => ({ ...e, create: '' }));
    if (!newComm.name) {
      setErrors((e) => ({ ...e, create: 'Name is required.' }));
      return;
    }
    if (!newComm.location) {
      setErrors((e) => ({ ...e, create: 'Location is required.' }));
      return;
    }
    if (newComm.channelIds.length === 0) {
      setErrors((e) => ({ ...e, create: 'Please select at least one channel.' }));
      return;
    }

    setLoading((l) => ({ ...l, create: true }));
    try {
      const res = await fetch(`${API_URL}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newComm, members: [] })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to create community');
      }
      const created = await res.json();
      setCommunities((prev) => [...prev, created]);
      setNewComm({
        name: '',
        location: '',
        description: '',
        channelIds: [],
        createdBy: adminUsername
      });
    } catch (err) {
      setErrors((e) => ({ ...e, create: err.message }));
    } finally {
      setLoading((l) => ({ ...l, create: false }));
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setLoading((l) => ({ ...l, deleteId: id }));
    setErrors((e) => ({ ...e, delete: '' }));
    try {
      const res = await fetch(`${API_URL}/communities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to delete');
      }
      setCommunities((prev) => prev.filter((c) => (c.id || c._id) !== id));
    } catch (err) {
      setErrors((e) => ({ ...e, delete: err.message }));
    } finally {
      setLoading((l) => ({ ...l, deleteId: null }));
    }
  };

  return (
      <div className="community-management-page">
        <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        <div className="community-management-container">
          <div className="cm-topbar">
            <Link to="/dashboard" className="cm-home-btn">
              <img src="/icons/home.svg" alt="Home" />
            </Link>
            <h2>Community Management</h2>
          </div>

          <div className="cm-content">
            {errors.fetch && (
                <div className="cm-error">Error: {errors.fetch}</div>
            )}

            {loading.fetch ? (
                <div>Loading...</div>
            ) : (
                <>
                  {/* Add Form */}
                  <div className="cm-add-form">
                    <input
                        type="text"
                        placeholder="Name *"
                        value={newComm.name}
                        onChange={(e) =>
                            setNewComm({ ...newComm, name: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Location *"
                        value={newComm.location}
                        onChange={(e) =>
                            setNewComm({ ...newComm, location: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={newComm.description}
                        onChange={(e) =>
                            setNewComm({ ...newComm, description: e.target.value })
                        }
                    />

                    <select
                        multiple
                        value={newComm.channelIds}
                        onChange={(e) => {
                          const vals = Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                          );
                          setNewComm((c) => ({ ...c, channelIds: vals }));
                        }}
                    >
                      {availableChannels.length === 0 ? (
                          <option disabled>No available channels</option>
                      ) : (
                          availableChannels.map((ch) => (
                              <option key={ch.id} value={ch.id}>
                                {ch.name}
                              </option>
                          ))
                      )}
                    </select>

                    {/* createdBy shown but not editable */}
                    <input
                        type="text"
                        value={newComm.createdBy}
                        readOnly
                        className="cm-createdby"
                    />

                    <button
                        onClick={handleAddCommunity}
                        disabled={loading.create}
                    >
                      {loading.create ? 'Adding…' : 'Add Community'}
                    </button>
                  </div>
                  {errors.create && (
                      <div className="cm-error">Error: {errors.create}</div>
                  )}

                  {/* Communities Table */}
                  <div className="cm-table-container">
                    <table className="cm-table">
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Channels</th>
                        <th>Created By</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {communities.map((comm) => {
                        const id = comm.id || comm._id;
                        const channels = comm.channelIds || comm.channels;
                        return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td>{comm.name}</td>
                              <td>{comm.location}</td>
                              <td>{comm.description}</td>
                              <td>
                                {channels
                                    .map((id) => {
                                      const channel = availableChannels.find((ch) => ch.id === id || ch._id === id);
                                      return channel?.name || id;
                                    })
                                    .join(', ')}
                              </td>

                              <td>{comm.createdBy}</td>
                              <td>
                                <button
                                    onClick={() => alert('Edit not implemented')}
                                >
                                  Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(id)}
                                    disabled={loading.deleteId === id}
                                >
                                  {loading.deleteId === id
                                      ? 'Deleting…'
                                      : 'Delete'}
                                </button>
                              </td>
                            </tr>
                        );
                      })}
                      {communities.length === 0 && (
                          <tr>
                            <td colSpan="7">No communities available</td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                    {errors.delete && (
                        <div className="cm-error">Error: {errors.delete}</div>
                    )}
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default CommunityManagement;
