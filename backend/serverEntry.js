import express from 'express';
import mongoose from 'mongoose';
import registerRoutes from './app/route.js';

const app = express();
app.use(express.json());

const port = 3000;
app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});

app.get('/', (req, res) => {
  res.send('API is running');
});

registerRoutes(app);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mettleClinic?directConnection=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

export default app;