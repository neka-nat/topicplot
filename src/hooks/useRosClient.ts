import { useState, useEffect } from "react";
import * as ROSLIB from "roslib";

type TopicsInfo = {
  topics: string[];
  types: string[];
};


export const useRosClient = (rosbridgeUrl: string) => {
  const [rosClient, setRosClient] = useState<ROSLIB.Ros | undefined>(undefined);
  const [topicsInfo, setTopicsInfo] = useState<TopicsInfo | undefined>(undefined);

  useEffect(() => {
    const client = new ROSLIB.Ros({ url: rosbridgeUrl });

    client.on("connection", () => {
      console.log("Connected to ROS.");
      setRosClient(client);
    });

    client.on("close", () => {
      console.log("Disconnected from ROS.");
      setRosClient(undefined);
    });

    client.on("error", (error) => {
      console.log("Error connecting to ROS:", error);
    });

    return () => {
      if (client) {
        client.close();
      }
    };
  }, [rosbridgeUrl]);

  const subscribeTopic = (topicName: string, messageType: string, callback: (message: ROSLIB.Message) => void) => {
    if (!rosClient) return;
  
    const topic = new ROSLIB.Topic({
      ros: rosClient,
      name: topicName,
      messageType: messageType,
    });
  
    topic.subscribe(callback);
  }

  const unsubscribeTopic = (topicName: string, messageType: string) => {
    if (!rosClient) return;
  
    const topic = new ROSLIB.Topic({
      ros: rosClient,
      name: topicName,
      messageType: messageType,
    });
  
    topic.unsubscribe();
  }

  useEffect(() => {
    if (!rosClient) return;
    rosClient.getTopics((newTopics) => {
      setTopicsInfo(newTopics);
    });
  }, [rosClient]);

  return {
    rosClient,
    subscribeTopic,
    unsubscribeTopic,
    topicsInfo,
  };
};
