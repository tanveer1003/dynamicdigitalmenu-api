const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});