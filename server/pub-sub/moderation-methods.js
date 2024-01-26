import { publishMessage,listenForPullMessages } from "./pub-sub.js"

// pub-sub configs
const topicName = 'product_added'
const subscriptionName = "product_added_pull";
const timeout = 60;

export async function createProduct(req,res) {
    const content = req.body

    let messageId = await publishMessage(topicName, content);
    return res.status(200).json({
        success: true,
        message: `Message ${messageId} published :)`,
    });
}

export async function pullProduct (req, res) {
    try {
        // retrive messeges content
        await listenForPullMessages(subscriptionName, timeout);
        return res.status(200).json({
            success: true,
            message: "Pull message received successfully :",
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Couldn't receive pull message :(",
        data: error.message,
      });
    }
  };