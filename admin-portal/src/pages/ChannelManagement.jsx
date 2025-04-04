import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar';
import '../styles/ChannelManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const ChannelManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [channels, setChannels] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  const [newChannel, setNewChannel] = useState({
    name: '',
    communityId: '',
    memberUsernames: []
  });

  const [editingChannelId, setEditingChannelId] = useState(null);
  const [editChannel, setEditChannel] = useState({
    name: '',
    communityId: '',
    memberUsernames: []
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({ fetch: '', create: '', update: '', delete: '' });
  const [loading, setLoading] = useState({ fetch: true, create: false, update: false, deleteId: null });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      setLoading((l) => ({ ...l, fetch: true }));
      try {
        const [chRes, coRes] = await Promise.all([
          fetch(`${API_URL}/channels`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/communities`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!chRes.ok) throw new Error('Failed to fetch channels.');
        if (!coRes.ok) throw new Error('Failed to fetch communities.');

        const [chData, coData] = await Promise.all([chRes.json(), coRes.json()]);
        setChannels(chData);
        setCommunities(coData);
        setErrors((e) => ({ ...e, fetch: '' }));
      } catch (err) {
        setErrors((e) => ({ ...e, fetch: err.message }));
      } finally {
        setLoading((l) => ({ ...l, fetch: false }));
      }
    };
    fetchData();
  }, [token]);

  const fetchMembers = async (communityId) => {
    try {
      const response = await fetch(`${API_URL}/communities/${communityId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch members.');
      const members = await response.json();
      setAvailableMembers(members);
    } catch (err) {
      console.error(err);
      setAvailableMembers([]);
    }
  };

  const handleCommunityChange = (communityId) => {
    setNewChannel((c) => ({ ...c, communityId, memberUsernames: [] }));
    fetchMembers(communityId);
  };

  const handleAddChannel = async () => {
    setErrors((e) => ({ ...e, create: '' }));
    if (!newChannel.name || !newChannel.communityId) {
      setErrors((e) => ({ ...e, create: 'Channel Name and Community are required.' }));
      return;
    }

    setLoading((l) => ({ ...l, create: true }));
    try {
      const payload = { ...newChannel };

      const response = await fetch(`${API_URL}/channels/community/${newChannel.communityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text() || 'Failed to create channel.');

      const created = await response.json();
      setChannels((prev) => [...prev, created]);
      setNewChannel({ name: '', communityId: '', memberUsernames: [] });
      setAvailableMembers([]);
    } catch (err) {
      setErrors((e) => ({ ...e, create: err.message }));
    } finally {
      setLoading((l) => ({ ...l, create: false }));
    }
  };

  const handleDeleteChannel = async (id) => {
    setLoading((l) => ({ ...l, deleteId: id }));
    setErrors((e) => ({ ...e, delete: '' }));
    try {
      const response = await fetch(`${API_URL}/channels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete channel.');
      setChannels((prev) => prev.filter((ch) => ch.id !== id && ch._id !== id));
    } catch (err) {
      setErrors((e) => ({ ...e, delete: err.message }));
    } finally {
      setLoading((l) => ({ ...l, deleteId: null }));
    }
  };

  const handleEditChannel = (ch) => {
    setEditingChannelId(ch.id || ch._id);
    setEditChannel({
      name: ch.name,
      communityId: ch.communityId,
      memberUsernames: ch.memberUsernames || []
    });
    fetchMembers(ch.communityId);
  };

  const handleSaveChannel = async (id) => {
    setErrors((e) => ({ ...e, update: '' }));
    setLoading((l) => ({ ...l, update: true }));
    try {
      const payload = { ...editChannel };

      const response = await fetch(`${API_URL}/channels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text() || 'Failed to update channel.');

      const updated = await response.json();
      setChannels((prev) =>
          prev.map((ch) => (ch.id === id || ch._id === id ? updated : ch))
      );
      setEditingChannelId(null);
    } catch (err) {
      setErrors((e) => ({ ...e, update: err.message }));
    } finally {
      setLoading((l) => ({ ...l, update: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditingChannelId(null);
    setAvailableMembers([]);
  };

  const handleViewMembers = (members) => {
    setSelectedMembers(members);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMembers([]);
  };

  return (
      <div className="channel-management-page">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((o) => !o)} />
        <div className="channel-management-container">
          <div className="cm-topbar">
            <Link to="/dashboard" className="cm-home-btn">
              <img src="/icons/home.svg" alt="Home" />
            </Link>
            <h2>Channel Management</h2>
          </div>

          <div className="cm-content">
            {errors.fetch && <div className="cm-error">Error: {errors.fetch}</div>}

            {loading.fetch ? (
                <div>Loading...</div>
            ) : (
                <>
                  <div className="cm-add-form">
                    <input
                        type="text"
                        placeholder="Channel Name *"
                        value={newChannel.name}
                        onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    />

                    <select
                        value={newChannel.communityId}
                        onChange={(e) => handleCommunityChange(e.target.value)}
                    >
                      <option value="">Select Community *</option>
                      {communities.map((c) => (
                          <option key={c.id || c._id} value={c.id || c._id}>
                            {c.name}
                          </option>
                      ))}
                    </select>

                    <select
                        multiple
                        value={newChannel.memberUsernames}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                          setNewChannel((c) => ({ ...c, memberUsernames: selected }));
                        }}
                    >
                      {availableMembers.length === 0 ? (
                          <option disabled>No Members</option>
                      ) : (
                          availableMembers.map((username) => (
                              <option key={username} value={username}>
                                {username}
                              </option>
                          ))
                      )}
                    </select>

                    <button onClick={handleAddChannel} disabled={loading.create}>
                      {loading.create ? 'Adding...' : 'Add Channel'}
                    </button>
                  </div>

                  {errors.create && <div className="cm-error">Error: {errors.create}</div>}

                  <div className="cm-table-container">
                    <table className="cm-table">
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Channel Name</th>
                        <th>Community</th>
                        <th>Members</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {channels.map((ch) => {
                        const id = ch.id || ch._id;
                        return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td>{ch.name}</td>
                              <td>{ch.communityId}</td>
                              <td>{(ch.memberUsernames || []).join(', ')}</td>
                              <td>
                                <button onClick={() => handleEditChannel(ch)}>Edit</button>
                                <button
                                    onClick={() => handleDeleteChannel(id)}
                                    disabled={loading.deleteId === id}
                                >
                                  {loading.deleteId === id ? 'Deleting...' : 'Delete'}
                                </button>
                                <button onClick={() => handleViewMembers(ch.memberUsernames)}>
                                  View
                                </button>
                              </td>
                            </tr>
                        );
                      })}
                      {channels.length === 0 && (
                          <tr>
                            <td colSpan="5">No channels available</td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                </>
            )}
          </div>

          {modalOpen && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Channel Members</h3>
                  {selectedMembers.length > 0 ? (
                      <ul>
                        {selectedMembers.map((m, i) => (
                            <li key={i}>{m}</li>
                        ))}
                      </ul>
                  ) : (
                      <p>No members found.</p>
                  )}
                  <button onClick={closeModal}>Close</button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ChannelManagement;
