const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const mv = require("mv")
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
});


async function createBoards(){
    const mysql = require('mysql2/promise')
    let connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password'}
    );
    const createSchema = "CREATE SCHEMA `boards` ;"
    await connection.execute(createSchema)
    connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password', database: 'boards'}
    );
    const createBoardTable = 'CREATE TABLE `boards`.`board_list` (`board` VARCHAR(31) NOT NULL,PRIMARY KEY (`board`));'
    await connection.execute(createBoardTable)
}

async function configureBoards(boardList){
    const mysql = require('mysql2/promise')
    let connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password', database: 'boards'}
    );
    boards = boardList.split(" ")
    for(let i = 0; i < boards.length; i++){
        await connection.execute(`INSERT INTO board_list (board) VALUES (?)`, [boards[i]])
    }
    for(let i = 0; i < boards.length; i++){
        connection = await mysql.createConnection(
            {host:'localhost', user: 'root', password: 'password'}
        );
        await connection.execute(`CREATE SCHEMA ${boards[i]}`)
        connection = await mysql.createConnection(
            {host:'localhost', user: 'root', password: 'password', database: boards[i]}
        );
        await connection.execute('CREATE TABLE `posts` (`ID` INT NOT NULL AUTO_INCREMENT,`parentThread` INT NOT NULL,`name` VARCHAR(45) NOT NULL,`timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,`textContent` VARCHAR(4095) NOT NULL,`imgURL` VARCHAR(511) NOT NULL,`IP` VARCHAR(45) NOT NULL,PRIMARY KEY (`ID`));')
        await connection.execute('CREATE TABLE `threads` (`postID` INT NOT NULL,`title` VARCHAR(127),PRIMARY KEY (`postID`))')
    }
    return
}

createBoards();

const prompt = require("prompt");

console.log("enter the boards you would like to initialize the site with in the following format:")
console.log("a b c")

prompt.get(["boardList"], function (err, result){
    if(err) {
        console.log(err)
    }
    configureBoards(result.boardList)
})


