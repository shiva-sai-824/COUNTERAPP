// express-server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/counter')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    myCount: { type: Number, default: 0 }
}, { collection: 'counters' });
const Counter = mongoose.model('Counter', counterSchema);

// Routes
app.get('/api/counter', async (req, res) => {
    console.log("Reached GET method")
    try {
        const counter = await Counter.findOne();
        //console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/increment', async (req, res) => {
    try {
        // console.log(req.body);
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();

        }
        if (req.body.data == "countinc") {

            counter.count++;
            console.log("count in", counter.count);

        }
        if (req.body.data == "mycountinc") {
            counter.myCount++;
            console.log("mycount in", counter.myCount);
        }
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement', async (req, res) => {
    try {

        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        if (req.body.data == "countdec") {
            counter.count--;
            console.log("count de", counter.count);
        }
        if (req.body.data == "mycountdec") {
            counter.myCount--;
            console.log("mycount de", counter.myCount);
        }

        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
