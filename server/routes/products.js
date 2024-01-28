import express from 'express'


const router = express()

// API HANDLING
import { getAllProducts, getProduct, getProductsByFarmer,
   addProduct, deleteProduct, updateOneColumnProduct, updateProduct,
    getNotifications, deleteNotification} from '../sqlserver/database.js';
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

router.get("/products/farmer/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const products = await getProductsByFarmer(id);
    if (!products) {
      res.status(404).send('Product not found');
    } else {
      res.send(products);
    }
  } catch (error) {
    next(error)
  }
})

router.post("/products", authenticate, async (req, res, next) => {
  try {
    const { name, description, category, price, stock_quantity, farmer_id, image } = req.body;
    const product = await addProduct(name, description, category, price, stock_quantity, farmer_id, image);
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

router.put("/products/order_change/:id", authenticate, async (req, res, next) => {
  try {
    const { col_name, col_val } = req.body;
    console.log(col_name, col_val);
    const id = req.params.id;
    const product = await updateOneColumnProduct(col_name, col_val, id);
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
    const product = req.body;
    const id = req.params.id;
    const new_product = await updateProduct(product, id);
    if (!new_product) {
      res.status(404).send('Product not found');
    } else {
      res.send(new_product);
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
