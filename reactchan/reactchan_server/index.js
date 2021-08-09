const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const { response } = require('express');
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reactchan',
});
const testDB = () => {
    const a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    for(let i = 0; i < 10; i++){
        db.query("INSERT INTO posts (name, imgURL, textContent, parentThread) VALUES (?, ?, ?, ?)", ["Anonymous", "#", a[i], i / 5]);
    }
    for(let i = 0; i < 2; i++){
        db.query("INSERT INTO threads (title, postID) VALUES (?, ?)", [a[i * 3], 31 + i]);
    }
}
// testDB();

app.post('/api/checkIfThreadFull', (request, response) => {
    sqlInsert = `SELECT COUNT(*) AS numOfPostsInThread from posts WHERE parentThread = ${request.body.parentThread}`
    db.query(sqlInsert, (err, result) => {
        response.send({threadFull: result[0].numOfPostsInThread == 250})
    })
})

app.post('/api/postersInThread', (req, res) => {
    const sqlInsert = `SELECT COUNT(DISTINCT IP) as postersInThread FROM posts WHERE parentThread = ${req.body.parentThread}`
    db.query(sqlInsert, (err, result) => {
        res.send({postersInThread: result[0].postersInThread})
    })
})

app.post('/api/makePost', (request, response) => {
    
    const ip = request.header('x-forwarded-for') || request.socket.remoteAddress;
    const regex = new RegExp('(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?');
    if(!regex.test(request.body.imgURL)) request.body.imgURL = '#';
    if(request.body.name == "") request.body.name = "Anonymous";
    let sqlInsert = `SELECT ABS(MAX(TIMESTAMPDIFF(SECOND, NOW(), timestamp))) AS secondsElapsed from reactchan.posts WHERE IP = '${ip}'`
    db.query(sqlInsert, (err, result) => {
        if(result[0].secondsElapsed < 60){
            response.send({successfulPost: false, message: `You must wait ${60 - result[0].secondsElapsed} seconds before making another post.`})
        }else{
            const sqlInsert = "INSERT INTO posts (textContent, imgURL, name, parentThread, IP) VALUES (?, ?, ?, ?, ?)";
            db.query(sqlInsert, [request.body.textContent, request.body.imgURL, request.body.name, request.body.parentThread, ip]);
            response.send({successfulPost: true,parentThread: request.body.parentThread});
            highestID++;
        }
    })
    
})

app.post('/api/makeThread', (request, response) => {
    sqlInsert = `SELECT COUNT(*) AS active_threads from threads`;
    db.query(sqlInsert, (err, result) => {
        if(result[0].active_threads == 100){
            db.query(`SELECT * FROM threads WHERE chronologicalOrder = (SELECT MIN(chronologicalOrder) FROM threads)`, (err, result) => {
                sqlInsert = `DELETE FROM threads WHERE postID = ${result[0].postID}`
                db.query(sqlInsert);
                sqlInsert = `DELETE FROM posts where parentThread = ${result[0].postID}`
                db.query(sqlInsert);
            })
        }
    })
        const ip = request.header('x-forwarded-for') || request.socket.remoteAddress;
        sqlInsert = `SELECT ABS(MAX(TIMESTAMPDIFF(SECOND, NOW(), timestamp))) AS secondsElapsed from reactchan.posts WHERE IP = '${ip}'`
        db.query(sqlInsert, (err, result) => {
            if(result[0].secondsElapsed != null && result[0].secondsElapsed < 60){
                response.send({successfulPost: false, message: `You must wait ${60 - result[0].secondsElapsed} seconds before making another thread.`})
            }else{
                sqlInsert = `INSERT INTO threads (title, postID) VALUES (?, ?)`;
                db.query(sqlInsert, [request.body.title, highestID + 1]);
                if(request.body.name == "") request.body.name = "Anonymous";
                sqlInsert = `INSERT INTO posts (name, imgURL, textContent, parentThread, IP) VALUES (?, ?, ?, ?, ?)`
                db.query(sqlInsert, [request.body.name, request.body.imgURL, request.body.textContent, highestID + 1, ip]);
                response.send({successfulPost: true, postID: highestID + 1});    
                highestID++;
            }
        })
})

app.get('/api/fetchThreads', (req, res) => {
    const sqlInsert = "SELECT * FROM threads";
    db.query(sqlInsert, (err, result) => {
        if(err) console.log(err);
        res.send(result);
    })
})

app.post('/api/fetchPost', (req, res) => {
    const sqlInsert = "SELECT * FROM posts WHERE ID = (?)";
    db.query(sqlInsert, [req.body.ID], (err, result) => {
        res.send(result);
    })
})

app.post('/api/fetchPostsForThread', (req, res) => {
    const sqlInsert = "SELECT * FROM posts WHERE parentThread = (?) AND ID != parentThread";
    db.query(sqlInsert, [req.body.parentThread], (err, result) => {
        res.send(result);
    })
})

app.post('/api/fetchTotalReplies', (req, res) => {
    let sqlInsert = `SELECT COUNT(*) AS totalReplies from posts WHERE parentThread = ${req.body.ID}` 
    db.query(sqlInsert, (err, result) => {
        res.send({totalReplies: result[0].totalReplies});
    })
})

app.post('/api/fetchImageReplies', (req, res) => {
    let sqlInsert = `SELECT COUNT(*) AS imageReplies FROM posts WHERE parentThread = ${req.body.ID} AND imgURL != '#'`
    db.query(sqlInsert, (err, result) => {
        res.send({imageReplies: result[0].imageReplies});
    })
})

let sqlInsert = "SELECT MAX(ID) AS maxID FROM posts";
let highestID;
db.query(sqlInsert, (err, result) => {
    if(err) console.log(err);
    highestID = result[0].maxID == null ? 0 : result[0].maxID;
})

app.listen(3001, () => {
    console.log('running on port 3001');
});