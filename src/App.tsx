import React, { useState } from "react";
import { Plot } from "./components/Plot";
import { TopicConfig } from "./components/TopicConfig";
import { TopicList } from "./components/TopicList";
import { useRosClient } from "./hooks/useRosClient";
import ROSLIB from "roslib";


function App() {
  const [plotData, setPlotData] = useState<{ [key: string]: Array<{ x: number; y: number }> }>({});
  const { rosClient, subscribeTopic, unsubscribeTopic, topicsInfo } = useRosClient("ws://localhost:9090");
  const messageType = "std_msgs/Float32";

  const handleAddTopic = (topicName: string, messageType: string) => {
    if (!rosClient) return;
    const callback = (message: ROSLIB.Message) => {
      if (messageType === "std_msgs/Float32") {
        const data = (message as any).data as number;
        const timestamp = new Date().getTime();

        const newDataPoint = { x: timestamp, y: data };
        setPlotData((prevData) => ({
          ...prevData,
          [topicName]: [...(prevData[topicName] || []), newDataPoint],
        }));
      }
    };
    subscribeTopic(topicName, messageType, callback);
  };

  const handleUnsubscribeTopic = (topicName: string) => {
    if (!rosClient) return;

    unsubscribeTopic(topicName, messageType);
    setPlotData((prevData) => {
      const newData = { ...prevData };
      delete newData[topicName];
      return newData;
    });
  };

  return (
    <div>
      <h1>ROS Topic Plotter</h1>
      {topicsInfo ? <TopicList {...topicsInfo} /> : <p>Connecting to ROS...</p>}
      <TopicConfig onAddTopic={handleAddTopic} />
      {Object.keys(plotData).map((topicName) => (
        <div key={topicName}>
          <h2>{topicName}</h2>
          <button onClick={() => handleUnsubscribeTopic(topicName)}>Unsubscribe</button>
          <Plot data={plotData[topicName]} />
        </div>
      ))}
    </div>
  );
};

export default App;
