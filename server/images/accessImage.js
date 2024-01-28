import {Storage} from '@google-cloud/storage';

// Creates a client
const storage = new Storage();

export async function listFiles(req, res) {
  // Lists files in the bucket
  try {
    const [files] = await storage.bucket('greenveggies_images').getFiles();
    const response = files.map(f => f.name)
    res.send(response)
  }catch {
    res.status(400)
  }
  
}
