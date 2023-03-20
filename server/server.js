const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connected successfuly'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
