const express = require("express");
const mysql = require("mysql2");

const bodyParser = require("body-parser");
const multer  = require("multer");
const upload = multer({dest:"uploads"});

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false})

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "japfood",
    password: "admin"
});

app.use(express.static(__dirname + "/public"));

app.get("/api/orders", function(req, res){
    pool.query("SELECT * FROM _order", function(err, data){
        if (err) return res.sendStatus(404);
        res.send(data);
    })
});

app.get("/api/orders/:id", function(req, res){
    const id = req.params.id; // получаем id

    pool.query("SELECT * FROM _order WHERE o_id=?", [id], function(err, data) {
        if(err) return res.sendStatus(404);
        res.send(data[0]);
    });
});

app.post("/api/orders", urlencodedParser, upload.single("filedata"), function (req, res){
    if(!req.body) return res.sendStatus(400);

    const o_id = req.body.o_id;
    const o_date = req.body.o_date;
    const o_status = req.body.o_status;
    const o_sum = req.body.o_sum;
    const o_client = req.body.o_client;

    let fileinfo = req.file;
    let file = "";
  
    if (fileinfo)
      file = fileinfo.path;

    pool.query("UPDATE _order SET o_date=?, o_client=?, o_status=?, o_sum=?, o_file=? WHERE o_id=?", 
                [o_date, o_client, o_status, o_sum, file, o_id], function(err, data) {
        if(err) return res.sendStatus(404);
        res.send(date);
    });
});

app.delete("/api/orders/:id", function(req, res){
    const id = req.params.id;

    pool.query("DELETE FROM _order WHERE o_id=?", [id], function(err, data) {
      if(err) return res.sendStatus(404);
      res.send(id);
    });
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения.. (Порт: 3000)");
});