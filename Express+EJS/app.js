// подключение express
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const multer  = require("multer");
const upload = multer({dest:"uploads"});

// создаем объект приложения
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "japfood",
    password: "admin"
  });

app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// получение списка заказов
app.get("/", function(req, res){
    pool.query("SELECT * FROM _order", function(err, data) {
      if(err) return console.log(err);
      res.render("index", {
          orders: data
      });
    });
});

// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create");
});

// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, upload.single("filedata"), function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const date = req.body.date;
    const client = req.body.client;
    const status = req.body.status;
    const sum = req.body.sum;

    let fileinfo = req.file;
    let file = "";

    if (fileinfo)
      file = fileinfo.path;

    pool.query("INSERT INTO _order (o_date, o_client, o_status, o_sum, o_file) VALUES (?,?,?,?,?)", [date, client, status, sum, file], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
});
 
// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  pool.query("SELECT * FROM _order WHERE o_id=?", [id], function(err, data) {
    if(err) return console.log(err);
     res.render("edit", {
        order: data[0]
    });
  });
});

// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, upload.single("filedata"), function (req, res) {
         
  if(!req.body) return res.sendStatus(400);

  const id = req.body.id;
  const date = req.body.date;
  const client = req.body.client;
  const status = req.body.status;
  const sum = req.body.sum;

  let fileinfo = req.file;
  let file = "";

  if (fileinfo)
    file = fileinfo.path;
   
  pool.query("UPDATE _order SET o_date=?, o_client=?, o_status=?, o_sum=?, o_file=? WHERE o_id=?", [date, client, status, sum, file, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});
 
// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM _order WHERE o_id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});
 
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});