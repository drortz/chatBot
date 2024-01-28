import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createRequire } from 'module';
import { Client } from '@elastic/elasticsearch';
import {ElasticService} from "./service/elastic-service.js";

const require = createRequire(import.meta.url);
const app = express();

app.use(cors());
const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});

const elasticClient = new Client({
    node: 'https://80e96e76cabb42c49538ccd5f101728c.us-east-2.aws.elastic-cloud.com:443',
    auth: {
        user: 'ApiKey',
        apiKey: 'dWNSeFNJMEI0dzFkMU8wUmowTzY6SHg5ejRZYlJSYnFlY1VBU0x1cTFIZw=='
    }
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('new connection');
    io.emit('new connection', 'new connection');
});

const jsonParser = express.json();

app.put('/insertData', jsonParser, async (req, res) => {
    const index = req.query.index;
    const elasticService = new ElasticService();
    await elasticService.insertData(index, req, res);
});

app.get('/getAllData', async (req, res) => {
    const index = req.query.index;
    const elasticService = new ElasticService();
    await elasticService.getAllData(index, res);
});

app.delete('/deleteAllData', async (req, res) => {
    const index = req.query.index;
    const elasticService = new ElasticService();
    await elasticService.deleteAllData(index, res);
});