const express = require("express");
const mysql = require("mysql2");

const app = express();
const jsonParser = express.json();

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "jap_order",
    password: "admin"
});

app.use(express.static(__dirname + "/public"));

app.get("/api/orders", function(req, res){
    pool.query("SELECT * FROM jap_order.order", function(err, data){
        if (err) return res.sendStatus(404);
        res.send(data);
    })
});

app.get("/api/orders/:id", function(req, res){
    const id = req.params.id; // получаем id

    pool.query("SELECT * FROM jap_order.order WHERE o_id=?", [id], function(err, data) {
        if(err) return res.sendStatus(404);
        res.send(data[0]);
    });
});

app.post("/api/orders", jsonParser, function (req, res){
    if(!req.body) return res.sendStatus(400);

    const o_date = req.body.date;
    const o_user = req.body.client;
    const o_status = req.body.status;
    const o_sum = req.body.sum;

    pool.query("INSERT INTO jap_order.order (o_date, o_user, o_status, o_sum) VALUES (?,?,?,?,?)", 
                [o_date, o_user, o_status, o_sum], function(err, data) {
        if(err) return res.sendStatus(404);
        res.send(data);
    });
});

app.put("/api/orders", jsonParser, function (req, res){
    if(!req.body) return res.sendStatus(400);

    const o_id = req.body.id;
    const o_date = req.body.date;
    const o_user = req.body.client;
    const o_status = req.body.status;
    const o_sum = req.body.sum;

    pool.query("UPDATE jap_order.order SET o_date=?, o_user=?, o_status=?, o_sum=? WHERE o_id=?",
            [o_date, o_user, o_status, o_sum, o_id], function(err, data){
        if(err) return res.sendStatus(404);
        res.send(data);
    });
})

app.delete("/api/orders/:id", function(req, res){
    const id = req.params.id;

    pool.query("DELETE FROM jap_order.order WHERE o_id=?", [id], function(err, data) {
      if(err) return res.sendStatus(404);
      res.send(id);
    });
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения.. (Порт: 3000)");
});