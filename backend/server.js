import express from "express";
import dotenv from 'dotenv';
import routes from './routes/index.js'
import cors from "cors";
import databaseConnection from "./database/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// CORS configuration - must be before other middleware
const corsOptions = {
    origin: ["*"],
    methods: ["*"],
    credentials: true
  };

// Apply CORS first
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api', routes);

databaseConnection();

// health route
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});