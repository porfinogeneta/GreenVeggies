import express from 'express'
import cors from 'cors'
import admin from './config/firebase-config.js'

const app = express();
app.use(express.json())
app.use(cors())


// API HANDLING
import { getAllProducts, getProduct, addProduct, deleteProduct, updateProduct} from './database.js';


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

function authorize(req,res,next) {
  // frontend przekazuje w headers swój klucz JWT
  const token = req.headers.authorization.split(" ")[1]; // pobieramy tylko token, bez Bearer
  const decodedValue = admin.auth().verifyIdToken(token)

  if (decodedValue){
    next()
  }else {
    res.status(401)
  }

  
}

app.get('/', authorize, (req, res) => {
  res.send({message: "udało się"})
})

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