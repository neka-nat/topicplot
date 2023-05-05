import React, { useState, useEffect } from "react";
import * as ROSLIB from "roslib";


export const TopicList: React.FC<{ rosClient: ROSLIB.Ros | undefined }> = ({ rosClient }) => {
  const [topics, setTopics] = useState<any[]>([]);

  type TopicInfo = {
    topic: string;
    messageType: string;
    messageDetails: any;
  };
  
  const getTopicsPromise = (rosClient: ROSLIB.Ros): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      rosClient.getTopics((result) => {
        console.log("getTopics result:", result);
        if (result) {
          resolve(result.topics);
        } else {
          reject("Error fetching topics");
        }
      });
    });
  };

  const getTopicTypePromise = (rosClient: ROSLIB.Ros, topic: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      rosClient.getTopicType(topic, (type) => {
        if (type) {
          resolve(type);
        } else {
          reject("Error fetching topic type");
        }
      });
    });
  };
  
  const getMessageDetailsPromise = (rosClient: ROSLIB.Ros, messageType: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      rosClient.getMessageDetails(messageType, (details) => {
        if (details) {
          resolve(details);
        } else {
          reject("Error fetching message details");
        }
      });
    });
  };

  useEffect(() => {
    if (!rosClient) return;

    const fetchTopics = async () => {
      try {
        const topicList = await getTopicsPromise(rosClient);
        const topicsWithTypePromises = topicList.map(async (topic: string): Promise<TopicInfo> => {
            const messageType = await getTopicTypePromise(rosClient, topic);
            const messageDetails = await getMessageDetailsPromise(rosClient, messageType);
            return { topic, messageType, messageDetails };
        });
        const topicsWithType = await Promise.all(topicsWithTypePromises);
        setTopics(topicsWithType);
      } catch (error) {
        console.error("Error fetching topic list:", error);
      }
    };

    fetchTopics();
  }, [rosClient]);

  return (
    <div>
      <ul>
        {topics.map(({ topic, messageType, messageDetails }) => (
          <li key={topic}>
            <div>Topic: {topic}</div>
            <div>Type: {messageType}</div>
            <div>
              Fields:
              <ul>
                {messageDetails.fields.map((field: any) => (
                  <li key={field.name}>
                    {field.name}: {field.type}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
