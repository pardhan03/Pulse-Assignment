import express from "express";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// health route
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});