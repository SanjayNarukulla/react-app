// frontend/src/components/Profile/UserProfile.js
import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setProfile(data);
  };

  const handleUpdate = async () => {
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      fetchProfile();
      setIsEditing(false);
    } else {
      alert("Profile update failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {isEditing ? (
        <>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <button onClick={handleUpdate}>Update</button>
        </>
      ) : (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
