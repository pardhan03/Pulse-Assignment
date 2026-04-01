import express from "express";
import dotenv from 'dotenv';
import routes from './routes/index.js'
import cors from "cors";
import databaseConnection from "./database/database.js";
import { setupSocket } from "./SocketIO/socket.js";
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 5000;

// CORS configuration - must be before other middleware
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
// Apply CORS first
const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

setupSocket(server);

app.use('/api', routes);

databaseConnection();

// health route
app.get('/', (req, res) => {
    res.send('Hello World');
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});