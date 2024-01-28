import express from 'express'
import cors from 'cors'
import { authenticate } from './authentication/authentication.js';
import productsRouter from './routes/products.js'
import moderationRouter from './routes/moderation.js'
import accessImageRouter from './routes/image_access.js'



const app = express();
app.use(express.json())
app.use(cors())


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// every time in private route we authenticate through this request
app.get('/authenticate', authenticate, (req, res) => {
  res.send({message: "user authenticated"})
})

app.use('/', productsRouter)
app.use('/', moderationRouter)
app.use('/', accessImageRouter)

const port = 8001
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
}); 