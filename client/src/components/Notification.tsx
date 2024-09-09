import React from 'react';

interface NotificationProps {
  title: string;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ title, message }) => {
  return (
    <div className="notification">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};

export default Notification;