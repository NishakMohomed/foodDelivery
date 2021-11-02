const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');
const ejs = require('ejs');
require('dotenv').config();

//Initialise express
const app = express();


//Connect to database
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true},
 () => {console.log('Database connection established')});


//static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));


//Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter)


//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}, //Expire in 24 hours
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}));


//Passport config
app.use(passport.initialize());
app.use(passport.session());
const passportInit = require('./config/passport');
passportInit(passport);


//Middlewares
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());



//Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next()
});


//set views
app.set('views', './views');
app.set('view engine', 'ejs');


//routes
require('./routes/routes')(app);



//listen in port 3000
const server =  app.listen(3000, () => console.info('Listening on port 3000'));



//Socket.io
const io = require('socket.io')(server);
io.on('connection', (socket) => {

    //join
    socket.on('join', (orderId) => {
        socket.join(orderId);
    });
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${ data.id }`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('employeeRoom').emit('orderPlaced', data);
})