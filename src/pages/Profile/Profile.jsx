import React from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className={styles.profileContainer}>
      <h2>Account Details</h2>
      <div className={styles.details}>
        <p><strong>Username:</strong> {user?.username || "Guest"}</p>
        <p><strong>Email:</strong> {user?.email || "Not available"}</p>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
};

export default Profile;

