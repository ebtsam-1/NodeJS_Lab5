const express = require('express');
const morgan = require('morgan');

const layout =require('./webpages/html');
const logger = require('./middlewares/logger');
const userRouter = require('./users/userRouter');

// require('express-async-errors');

const app = express();
const port = 3000;
require('./db');
app.use(express.json());
// app.use(express.urlencoded());
// app.use(morgan('tiny'));

app.use(express.static('public',{
  index: 'home.html'
}));
// app.use(logger);
// app.use(['/style', '/'],logger);

// app.get('/style/style.css' , logger, (req, res) => {
//   const filePath = path.join(__dirname, 'styles', 'style.css');
//   res.sendFile(filePath);
// });

app.use(['/users', '/user'], userRouter);


app.use((err, req, res, next) => {
    err.code === 'SERVER_ERROR'? err.message = 'something went wrong' : err.message;
    res.status(err.statusCode || 500).json({
      message: err.message,
      status: err.statusCode || 500,
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
