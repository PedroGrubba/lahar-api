const express       = require("express");
const bodyParser    = require("body-parser");
const cors          = require("cors");
const mongoose      = require('mongoose');
const dotenv        = require('dotenv');
const session       = require('express-session');
const fileUpload = require('express-fileupload')

const app = express();

// View engine
app.set("view engine", "ejs");

//Static
app.use(express.static('public'));

//Session (Login)
app.use(session({
    secret: 'Portal Parcelei',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 14400000 }
  }))

// Usar Model que permite configurar os acessos externos a API
// Deixando vazio, permite todo o tipo de acesso externo
app.use(cors());

dotenv.config();

//Connect to DB
// mongoose.connect(
//     process.env.DB_CONNECT, 
//     { useNewUrlParser: true, useUnifiedTopology: true  },
//     () => console.log('Concected to DB!')
// ); 

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// file upload
app.use(fileUpload());

//Rotas do sistema
app.use('/', require('./src/routes'));

app.set('views', __dirname + '/views');

//redirecionando a página inicial
app.get("/", (req, res) => {
    res.render(__dirname + '/src/views/login');
});

//Iniciando o servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
    console.log(" > Server is runnig in: ", PORT);
});