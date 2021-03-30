class Book{
    constructor(title, author, year)
    {
        this.title = title;
        this.author = author;
        this.year = year;
    }
}

// include express and create an app object
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set('views', 'C:/Users/SAI-HOME/Desktop/Projects/UrBook/Express+EJS/views');

// module for reading
const fs = require("fs");
const jsonParser = express.json();
const filePath = __dirname + '/books.json';

app.use("/", function(request, response){
    const content = fs.readFileSync(filePath,"utf8");
    const MyBooks = JSON.parse(content);

    response.render("urlist",{
        books: MyBooks
    });
});

app.use(function (request, response) {
    response.sendStatus(404)
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000)
{
    console.log("Сервер начал прослушивание запросов на порту 3000");
};