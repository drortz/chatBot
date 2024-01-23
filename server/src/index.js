import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fetch from 'node-fetch';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = express();

app.use(cors());
const http =  httpServer.createServer(app);

http.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

io.on('connection', (socket) => {
    console.log('new connection');
    io.emit('new connection', 'new connection');
});


// var express = require('express')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// New endpoint for inserting data into Elasticsearch
app.post('/insertData', jsonParser, (req, res) => {
    const elasticsearchURL = 'http://localhost:9200/chatBot/_doc';
    const threadData = req.body.threadData;

    // Make an HTTP POST request to insert data
    fetch(elasticsearchURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadData }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data inserted successfully:', data);
            res.status(200).json({ message: 'Data inserted successfully' });
        })
        .catch(error => {
            console.error('Error inserting data:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
