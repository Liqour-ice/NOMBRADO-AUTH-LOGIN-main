import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="center-wrap">
      <div className="frame">
        <div className="card" style={{ width: '400px', margin: '0 auto' }}>
          {user ? (
            <div>
              <div className="center">
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.email || "User"
                    )}&background=ddd&color=555&size=128`
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                  style={{ width: '120px', height: '120px' }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#333' }}>{user.name}</h2>
              <div className="field" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px', color: '#555' }}>
                  <span style={{ color: '#888', fontSize: '0.9em' }}>Email</span><br/>
                  {user.email}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button
                  onClick={() => navigate('/')}
                  className="btn primary w-full"
                  style={{ 
                    marginTop: '20px',
                    background: '#3b57ff',
                    borderRadius: '8px',
                    padding: '12px 0',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Back to Home
                </button>
                <button
                  onClick={handleLogout}
                  className="btn w-full"
                  style={{ 
                    marginTop: '10px',
                    background: '#ff3b3b',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '12px 0',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p className="muted center">Please log in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;