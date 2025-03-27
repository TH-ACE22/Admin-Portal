import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Sidebar from '../components/Sidebar'; // Ensure the correct import path
import '../styles/CommunityManagement.css';

const CommunityManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle the sidebar open/collapsed state
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const [communities, setCommunities] = useState([
    {
      _id: 'communityId123',
      name: 'Mahalapye',
      description: 'Central Botswana Region',
      channels: ['water-utilities', 'bpc', 'health'],
      createdBy: 'adminId'
    },
    {
      _id: 'communityId456',
      name: 'Gaborone',
      description: 'Capital city region',
      channels: ['utilities', 'tourism'],
      createdBy: 'adminId'
    }
  ]);

  const [newComm, setNewComm] = useState({
    name: '',
    description: '',
    channels: '',
    createdBy: ''
  });

  // Add community
  const handleAddCommunity = () => {
    const newId = `communityId${Date.now()}`;
    const channelsArr = newComm.channels.split(',').map((ch) => ch.trim());

    const newObject = {
      _id: newId,
      name: newComm.name,
      description: newComm.description,
      channels: channelsArr,
      createdBy: newComm.createdBy
    };

    setCommunities([...communities, newObject]);
    setNewComm({ name: '', description: '', channels: '', createdBy: '' });
  };

  // Delete community
  const handleDelete = (_id) => {
    setCommunities(communities.filter((c) => c._id !== _id));
  };


  return (
    <div className="community-management-page">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={handleToggleSidebar} />

      {/* Main container for top bar + content */}
      <div className="community-management-container">
        {/* Elevated Top Bar */}
        <div className="cm-topbar">
          {/* Menu button to collapse/expand the sidebar */}
          <button className="cm-menu-btn" onClick={handleToggleSidebar}>
            <img src="/icons/menu.svg" alt="Toggle Sidebar" />
          </button>
          {/* Home icon: clicking it navigates to /dashboard */}
          <Link to="/dashboard" className="cm-home-btn">
            <img src="/icons/home.svg" alt="Home" />
          </Link>
          {/* Back button */}

          <h2>Community Management</h2>
        </div>

        <div className="cm-content">
          {/* Add Form */}
          <div className="cm-add-form">
            <input
              type="text"
              placeholder="Name"
              value={newComm.name}
              onChange={(e) =>
                setNewComm({ ...newComm, name: e.target.value })
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
            <input
              type="text"
              placeholder="Channels (comma separated)"
              value={newComm.channels}
              onChange={(e) =>
                setNewComm({ ...newComm, channels: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Created By"
              value={newComm.createdBy}
              onChange={(e) =>
                setNewComm({ ...newComm, createdBy: e.target.value })
              }
            />
            <button onClick={handleAddCommunity}>Add Community</button>
          </div>

          {/* Table */}
          <table className="cm-table">
            <thead>
              <tr>
                <th>_id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Channels</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((comm) => (
                <tr key={comm._id}>
                  <td>{comm._id}</td>
                  <td>{comm.name}</td>
                  <td>{comm.description}</td>
                  <td>{comm.channels.join(', ')}</td>
                  <td>{comm.createdBy}</td>
                  <td>
                    <button onClick={() => alert(`Edit ${comm._id}`)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(comm._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {communities.length === 0 && (
                <tr>
                  <td colSpan="6">No communities available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommunityManagement;
