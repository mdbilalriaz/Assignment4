const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


const UserSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    email: String
});
const User = mongoose.model('User', UserSchema);

app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
    const updatedUser = await User.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
    );
    res.json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
    await User.findOneAndDelete({ id: req.params.id });
    res.sendStatus(204);
});

app.listen(3000, () => console.log('Server running on port 3000'));
