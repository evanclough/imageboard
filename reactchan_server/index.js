const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const mv = require("mv")
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

async function fetchBoards(){
    const mysql = require('mysql2/promise')
    let connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password', database: 'boards'}
    );
    boardList = await connection.execute(`SELECT * FROM board_list`)
    boardList = boardList[0];
    connection.end()
    for(let i = 0; i < boardList.length; i++){
        const connection = await mysql.createConnection(
            {host:'localhost', user: 'root', password: 'password', database: boardList[i].board}
        );  
        const a = await connection.execute(`SELECT MAX(ID) AS MAXID FROM posts`)
        boardList[i] = {b: boardList[i].board, highestID: a[0][0].MAXID == null ? 0 : a[0][0].MAXID}
        connection.end()
    }
    return boardList
}

async function fetchThreadsForBoard(boardName){
    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection(
        {host:'localhost', user: 'root', password: 'password', database: boardName}
    );
    const threads = await connection.execute(`SELECT * FROM threads`)
    connection.end()
    return threads;
}

async function f2(){
    const response = [];
    boards = await fetchBoards()
    for(let i = 0; i < boards.length; i++){
        threads = await fetchThreadsForBoard(boards[i].b);
        response.push({threads: threads, boardName: boards[i].b})
    }
    return response;
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.get('/api/fetchEverything', asyncMiddleware(async (req, res, next) => {
    response = await f2();
    res.send(response);
}))

app.get('/api/fetchBoardList', (req, res) => {
    res.send(boards)
})

async function api(){
    boards = await fetchBoards()
    for(let i = 0; i < boards.length; i++){
        const db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: boards[i].b,
        });
        let sqlInsert = "SELECT MAX(ID) AS maxID FROM posts";
        db.query(sqlInsert, (err, result) => {
            if(err) console.log(err);
            boards[i].highestID = result == null ? 0 : result[0].maxID;
        })
        app.post(`/api/${boards[i].b}/checkIfThreadFull`, (request, response) => {
            sqlInsert = `SELECT COUNT(*) AS numOfPostsInThread from posts WHERE parentThread = ${request.body.parentThread}`
            db.query(sqlInsert, (err, result) => {
                response.send({threadFull: result[0].numOfPostsInThread == 250})
            })
        })
        
        app.post(`/api/${boards[i].b}/postersInThread`, (req, res) => {
            const sqlInsert = `SELECT COUNT(DISTINCT IP) as postersInThread FROM posts WHERE parentThread = ${req.body.parentThread}`
            db.query(sqlInsert, (err, result) => {
                res.send({postersInThread: result[0].postersInThread})
            })
        })
        
        app.post(`/api/${boards[i].b}/makePost`, (request, response) => {
            const ip = request.header('x-forwarded-for') || request.socket.remoteAddress;
            const regex = new RegExp('(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?');
            if(!regex.test(request.body.imgURL)) request.body.imgURL = '#';
            if(request.body.name == "") request.body.name = "Anonymous";
            let sqlInsert = `SELECT ABS(MAX(TIMESTAMPDIFF(SECOND, NOW(), timestamp))) AS secondsElapsed from posts WHERE IP = '${ip}'`
            db.query(sqlInsert, (err, result) => {
                if(result[0].secondsElapsed < 60){
                    response.send({successfulPost: false, message: `You must wait ${60 - result[0].secondsElapsed} seconds before making another post.`})
                }else{
                    const sqlInsert = "INSERT INTO posts (textContent, imgURL, name, parentThread, IP) VALUES (?, ?, ?, ?, ?)";
                    db.query(sqlInsert, [request.body.textContent, request.body.imgURL, request.body.name, request.body.parentThread, ip]);
                    response.send({successfulPost: true,parentThread: request.body.parentThread});
                    boards[i].highestID++;
                }
            })
            
        })
        
        app.post(`/api/uploadImage`, (request, response) => {
            if (req.files === null){
                return res.status(400).json({msg:'no file uploaded'});
            }
    
            const file = req.files.file;
            file.mv()
            let imageURL
            res.json({imageURL: imageURL})
        })
    
        app.post(`/api/${boards[i].b}/makeThread`, (request, response) => {
            sqlInsert = `SELECT COUNT(*) AS active_threads from threads`;
            db.query(sqlInsert, (err, result) => {
                if(result != null && result[0].active_threads == 100){
                    db.query(`SELECT * FROM threads WHERE chronologicalOrder = (SELECT MIN(chronologicalOrder) FROM threads)`, (err, result) => {
                        sqlInsert = `DELETE FROM threads WHERE postID = ${result[0].postID}`
                        db.query(sqlInsert);
                        sqlInsert = `DELETE FROM posts where parentThread = ${result[0].postID}`
                        db.query(sqlInsert);
                    })
                }
            })
                const ip = request.header('x-forwarded-for') || request.socket.remoteAddress;
                sqlInsert = `SELECT ABS(MAX(TIMESTAMPDIFF(SECOND, NOW(), timestamp))) AS secondsElapsed from posts WHERE IP = '${ip}'`
                db.query(sqlInsert, (err, result) => {
                    if(result[0].secondsElapsed != null && result[0].secondsElapsed < 60){
                        response.send({successfulPost: false, message: `You must wait ${60 - result[0].secondsElapsed} seconds before making another thread.`})
                    }else{
                        sqlInsert = `INSERT INTO threads (title, postID) VALUES (?, ?)`;
                        db.query(sqlInsert, [request.body.title, boards[i].highestID + 1]);
                        if(request.body.name == "") request.body.name = "Anonymous";
                        sqlInsert = `INSERT INTO posts (name, imgURL, textContent, parentThread, IP) VALUES (?, ?, ?, ?, ?)`
                        db.query(sqlInsert, [request.body.name, request.body.imgURL, request.body.textContent, boards[i].highestID + 1, ip]);
                        response.send({successfulPost: true, postID: boards[i].highestID + 1});    
                        boards[i].highestID++;
                    }
                })
        })
        
        app.get(`/api/${boards[i].b}/fetchThreads`, (req, res) => {
            const sqlInsert = "SELECT * FROM threads";
            db.query(sqlInsert, (err, result) => {
                if(err) console.log(err);
                res.send(result);
            })
        })
        
        app.post(`/api/${boards[i].b}/fetchPost`, (req, res) => {
            const sqlInsert = "SELECT * FROM posts WHERE ID = (?)";
            db.query(sqlInsert, [req.body.ID], (err, result) => {
                res.send(result);
            })
        })
        
        app.post(`/api/${boards[i].b}/fetchPostsForThread`, (req, res) => {
            const sqlInsert = "SELECT * FROM posts WHERE parentThread = (?) AND ID != parentThread";
            db.query(sqlInsert, [req.body.parentThread], (err, result) => {
                res.send(result);
            })
        })
        
        app.post(`/api/${boards[i].b}/fetchTotalReplies`, (req, res) => {
            let sqlInsert = `SELECT COUNT(*) AS totalReplies from posts WHERE parentThread = ${req.body.ID} AND parentThread != ID` 
            db.query(sqlInsert, (err, result) => {
                res.send({totalReplies: result[0].totalReplies});
            })
        })
        
        app.post(`/api/${boards[i].b}/fetchImageReplies`, (req, res) => {
        let sqlInsert = `SELECT COUNT(*) AS imageReplies FROM posts WHERE parentThread = ${req.body.ID} AND imgURL != '#' AND parentThread != ID`
            db.query(sqlInsert, (err, result) => {
                res.send({imageReplies: result[0].imageReplies});
            })
        })
    }
}

api()

app.listen(3001, () => {
    console.log('running on port 3001!');
});