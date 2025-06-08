const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static('uploads'));