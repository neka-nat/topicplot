import React, { useState } from "react";

interface TopicConfigProps {
  onAddTopic: (topicName: string, messageType: string) => void;
}

export const TopicConfig: React.FC<TopicConfigProps> = ({ onAddTopic }) => {
  const [topicName, setTopicName] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTopic(topicName, messageType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Topic Name:
        <input type="text" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
      </label>
      <label>
        Message Type:
        <input type="text" value={messageType} onChange={(e) => setMessageType(e.target.value)} />
      </label>
      <button type="submit">Add Topic</button>
    </form>
  );
};
