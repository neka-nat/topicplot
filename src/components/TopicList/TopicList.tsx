import React from "react";

type TopicsInfo = {
  topics: string[];
  types: string[];
};

export const TopicList: React.FC<TopicsInfo> = ({ topics, types }) => {
  return (
    <div>
      <ul>
        {topics.map((topic, index) => (
          <li key={topic}>
            <div>Topic: {topic}</div>
            <div>Type: {types[index]}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
