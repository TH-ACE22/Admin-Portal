import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/ChannelManagement.css';

const ChannelManagement = () => {
  // Add state for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const [channels, setChannels] = useState([
    {
      _id: 'channelId123',
      name: 'General Discussion',
      community: 'Mahalapye',
      members: ['Alice', 'Bob', 'Charlie']
    },
    {
      _id: 'channelId456',
      name: 'Announcements',
      community: 'Gaborone',
      members: ['Dave', 'Eve']
    }
  ]);

  const [newChannel, setNewChannel] = useState({
    name: '',
    community: '',
    members: ''
  });

  // State for editing a channel
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [editChannel, setEditChannel] = useState({
    name: '',
    community: '',
    members: ''
  });

  // State for modal popup
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Handler for adding a new channel
  const handleAddChannel = () => {
    const newId = `channelId${Date.now()}`;
    const membersArr = newChannel.members.split(',').map((m) => m.trim());
    const newObj = {
      _id: newId,
      name: newChannel.name,
      community: newChannel.community,
      members: membersArr
    };
    setChannels([...channels, newObj]);
    setNewChannel({ name: '', community: '', members: '' });
  };

  // Handler for deleting a channel
  const handleDeleteChannel = (id) => {
    setChannels(channels.filter((ch) => ch._id !== id));
  };

  // Start editing a channel
  const handleEditChannel = (channel) => {
    setEditingChannelId(channel._id);
    // Pre-fill edit form; convert members array to comma-separated string
    setEditChannel({
      name: channel.name,
      community: channel.community,
      members: channel.members.join(', ')
    });
  };

  // Save edited changes
  const handleSaveChannel = (id) => {
    const updatedChannels = channels.map((ch) => {
      if (ch._id === id) {
        return {
          ...ch,
          name: editChannel.name,
          community: editChannel.community,
          members: editChannel.members.split(',').map(m => m.trim())
        };
      }
      return ch;
    });
    setChannels(updatedChannels);
    setEditingChannelId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingChannelId(null);
  };

  // Open modal to view members
  const handleViewMembers = (members) => {
    setSelectedMembers(members);
    setModalOpen(true);
  };

  // Close the modal popup
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMembers([]);
  };

  return (
      <div className="channel-management-page">
        {/* Sidebar for navigation */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />

        {/* Main container for top bar and content */}
        <div className="channel-management-container">
          {/* Elevated Top Bar */}
          <div className="cm-topbar">
            {/* Home icon in top bar */}
            <Link to="/dashboard" className="cm-home-btn">
              <img src="/icons/home.svg" alt="Home" />
            </Link>
            {/* Menu button to collapse/expand sidebar */}
            <button className="cm-menu-btn" onClick={handleToggleSidebar}>
              <img src="/icons/menu.svg" alt="Toggle Sidebar" />
            </button>
            <h2>Channel Management</h2>
          </div>

          <div className="cm-content">
            {/* Add Form */}
            <div className="cm-add-form">
              <input
                  type="text"
                  placeholder="Channel Name"
                  value={newChannel.name}
                  onChange={(e) =>
                      setNewChannel({ ...newChannel, name: e.target.value })
                  }
              />
              <input
                  type="text"
                  placeholder="Community"
                  value={newChannel.community}
                  onChange={(e) =>
                      setNewChannel({ ...newChannel, community: e.target.value })
                  }
              />
              <input
                  type="text"
                  placeholder="Members (comma separated)"
                  value={newChannel.members}
                  onChange={(e) =>
                      setNewChannel({ ...newChannel, members: e.target.value })
                  }
              />
              <button onClick={handleAddChannel}>Add Channel</button>
            </div>

            {/* Table Container */}
            <div className="cm-table-container">
              <table className="cm-table">
                <thead>
                <tr>
                  <th>_id</th>
                  <th>Channel Name</th>
                  <th>Community</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {channels.map((ch) => (
                    <tr key={ch._id}>
                      <td>{ch._id}</td>
                      {editingChannelId === ch._id ? (
                          <>
                            <td>
                              <input
                                  type="text"
                                  value={editChannel.name}
                                  onChange={(e) =>
                                      setEditChannel({ ...editChannel, name: e.target.value })
                                  }
                              />
                            </td>
                            <td>
                              <input
                                  type="text"
                                  value={editChannel.community}
                                  onChange={(e) =>
                                      setEditChannel({ ...editChannel, community: e.target.value })
                                  }
                              />
                            </td>
                            <td>
                              <input
                                  type="text"
                                  value={editChannel.members}
                                  onChange={(e) =>
                                      setEditChannel({ ...editChannel, members: e.target.value })
                                  }
                              />
                            </td>
                            <td>
                              <button onClick={() => handleSaveChannel(ch._id)}>
                                Save
                              </button>
                              <button onClick={handleCancelEdit}>Cancel</button>
                            </td>
                          </>
                      ) : (
                          <>
                            <td>{ch.name}</td>
                            <td>{ch.community}</td>
                            <td>{ch.members.join(', ')}</td>
                            <td>
                              <button onClick={() => handleEditChannel(ch)}>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteChannel(ch._id)}>
                                Delete
                              </button>
                              <button onClick={() => handleViewMembers(ch.members)}>
                                View
                              </button>
                            </td>
                          </>
                      )}
                    </tr>
                ))}
                {channels.length === 0 && (
                    <tr>
                      <td colSpan="5">No channels available</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Popup for Viewing Members */}
        {modalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Channel Members</h3>
                <div className="modal-members-list">
                  {selectedMembers.length > 0 ? (
                      <ul>
                        {selectedMembers.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))}
                      </ul>
                  ) : (
                      <p>No members found.</p>
                  )}
                </div>
                <button className="modal-close-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default ChannelManagement;
