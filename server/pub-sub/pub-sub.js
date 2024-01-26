import { PubSub } from "@google-cloud/pubsub";
import { addNotification } from "../sqlserver/database.js";

const keyPath = './config/pubsubServiceAccount.json'

// Create an instance of PubSub with the provided service account key
const pubSubClient = new PubSub({
    keyFilename: keyPath,
  });
  

export async function publishMessage (topicName, payload) {
    const dataBuffer = Buffer.from(JSON.stringify(payload));
    try {
        const messageId = await pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
        return messageId;
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
    }
};

// pull messages, so retrive message with a direct api request
export async function listenForPullMessages (subscriptionName, timeout) {
    const subscription = pubSubClient.subscription(subscriptionName);
    let messageCount = 0;
    let data = [];
    const messageHandler = message => {
      const jsonData = JSON.parse(message.data);
  
      data.push({
        id: message.id,
        attributes: message.attributes,
        ...jsonData,
      });
      messageCount += 1;
      message.ack();
    };
    subscription.on("message", messageHandler);

  
    setTimeout(async () => {
        console.log("Message Pulled: \n", data);
        console.log(`${messageCount} message(s) received.`);
        subscription.removeListener("message", messageHandler);

        const promises = data.map(el => addNotification(el))
    
        try {
            console.log('something');
            await Promise.all(promises)
            
        }catch(err){
            throw new Error("Cannot Add data");
        }
        
    }, timeout * 100);
    
    
  };
