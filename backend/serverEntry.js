import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

const port = 3000;
app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mittal_clinic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

export default app;