import express from 'express'


const router = express()

// API HANDLING
import { getAllProducts, getProduct, addProduct, deleteProduct, updateProduct, getNotifications, deleteNotification} from '../sqlserver/database.js';
import { authenticate } from '../authentication/authentication.js';

router.get("/products", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.get("/products/:id", async (req, res) => {
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

router.post("/products", authenticate, async (req, res, next) => {
  try {
    const { name, description, category, price, stock_quantity } = req.body;
    const product = await addProduct(name, description, category, price, stock_quantity);
    res.status(201).send(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/products/:id", authenticate, async (req, res, next) => {
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

router.put("/products/:id", authenticate, async (req, res, next) => {
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


router.get("/notifications", async (req, res, next) => {
  try {
    const notifications = await getNotifications()
    res.send(notifications)
  }catch {
    next(error);
  }
})

router.delete("/notifications/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await deleteNotification(id)
    res.send(result)
  }catch(error) {
    next(error);
  }
})




export default router;
