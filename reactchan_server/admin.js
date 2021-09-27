const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const prompt = require("prompt");
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'a',
});

async function isValidBoard(board){
    const mysql = require('mysql2/promise')
    connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password', database: 'boards'}
    );
    boardList = await connection.execute(`SELECT * FROM board_list`)
    boardList = boardList[0];
    for(let i = 0; i < boardList.length; i++){
        if(boardList[i].board == board) return true;
    }
    return false;
}

function clearBoard(board){
    db.query(`DELETE FROM ${board}.threads WHERE postID > -1;`)
    db.query(`DELETE FROM ${board}.posts WHERE ID > -1`)
    db.query(`ALTER TABLE ${board}.posts AUTO_INCREMENT = 1`)
}

function executeAdminCommand(command){
    const currentCommand = command.split(' ')
    if(currentCommand.length < 2){
        console.log("you mistyped LOOOL");
        return
    }
    for(const c of commands){
        if(c.command == currentCommand[0]){
            for(let i = 1; i < currentCommand.length; i++){
                if(isValidBoard(currentCommand[i])){
                    c.f(currentCommand[i])
                }else{
                    console.log(`${currentCommand[i]} isn't a board`)
                }
            }
            return
        }
    }
}

const logBoardPosts = (board) => {
    db.query(`SELECT * FROM ${board}.posts`,(err, result) => console.log(result))
}

const testBoard = (board) => {
    const a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    for(let i = 0; i < 10; i++){
        db.query(`INSERT INTO ${board}.posts (name, imgURL, textContent, parentThread, IP) VALUES (?, ?, ?, ?, ?)`, ["Anonymous", "#", a[i], Math.floor(i / 5) + 1, "::1"]);
    }
    for(let i = 0; i < 2; i++){
        db.query(`INSERT INTO ${board}.threads (title, postID) VALUES (?, ?)`, [a[i * 3], i + 1]);
    }
}

prompt.start()

const commands = [{command: 'clear', f: clearBoard}, {command: 'test', f: testBoard}, {command: 'posts', f: logBoardPosts}];
function rec(){
    console.log("enter a command or ctrl+c to quit :P")
    prompt.get(["command"], function (err, result){
        if(err) {
            console.log(err)
        }
        executeAdminCommand(result.command)
        rec()   
    })
}

rec()
