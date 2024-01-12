import express from 'express'
import cors from 'cors'
import admin from './config/firebase-config.js'

const app = express();
app.use(express.json())
app.use(cors())


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

import { getUserByUID, addUser } from './authentication.js';

async function checkStatus(decodedValue, uid, role, res, next) {
  try {
    // check if it's a logged-in user
    if (decodedValue) {
      // check if role fits
      const user = await getUserByUID(uid);
      if (user != undefined){
        // admin can do everything
        if (user.role === 'ADMIN') {
          next();
        }
        // farmer can do farmer stuff as well as user stuff, we check database status as well as header provided status
        else if ((user.role === 'FARMER' && role.toUpperCase() === 'USER') || role.toUpperCase() === 'FARMER') {
          next();
        }
        else if (user.role === 'USER' && role.toUpperCase() === 'USER') {
          next();
        }
        else {
          res.status(401).send("Unauthorized");
        }
      }else {
        const id = await addUser(uid);
        // grant access to user pages if the user stuff was requested
        if (role == 'USER'){
          console.log('elo');
          next()
        }else {
          res.status(401).send("Unauthorized");
        }
      }
    }
    else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error in checkStatus:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function authorize(req, res, next) {
  try {
    // frontend przekazuje w headers swój klucz JWT
    const token = req.headers.authorization.split(" ")[1]; // pobieramy tylko token, bez Bearer
    const uid = req.headers.uid.split(" ")[1];
    const role = req.headers.role.split(" ")[1];
    const decodedValue = await admin.auth().verifyIdToken(token);

    // Call the checkStatus function
    await checkStatus(decodedValue, uid, role, res, next);
  } catch (error) {
    console.error("Error in authorize:", error);
    res.status(401).send("Unauthorized");
  }
}

app.get('/', authorize, (req, res) => {
  res.send({message: "udało się"})
})

// API HANDLING
import { getAllProducts, getProduct, addProduct, deleteProduct, updateProduct} from './database.js';

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProduct(id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error);
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, description, category, price, stock_quantity } = req.body;
    const product = await addProduct(name, description, category, price, stock_quantity);
    res.status(201).send(product);
  } catch (error) {
    next(error);
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await deleteProduct(id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error);
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { col_name, col_val } = req.body;
    const id = req.params.id;
    const product = await updateProduct(col_name, col_val, id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error);
  }
});
const port = 8001
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
}); 