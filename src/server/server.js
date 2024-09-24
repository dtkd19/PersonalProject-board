const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

//express 사용하기 위한 app 생성
const app = express();

//express 사용할 서버포트 설정
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

//DB 접속
const db = mysql.createConnection({
    host : 'localhost',
    user: 'react',
    password: 'mysql',
    port:'3306',
    database:'db_react'
});

// express 접속
app.listen(PORT, ()=>{
    console.log(`server connecting on : http://localhost:${PORT}`);
});

//db 연결
db.connect((err)=>{
    if(!err){
        console.log("seccuss");

    }else{
        console.log("fail");
    }
});


// --------- DB에서 값을 가져오기 -------------

// / => root 연결시 보여지는 기본화면 설정
app.get('/', (req, res) =>{
    res.send('React Server Connect Success!!');
});

app.get('/list', (req, res) => {
    console.log('/list');
    const sql = `
        SELECT fb.*, COUNT(c.co_id) AS commentCount 
        FROM free_board fb 
        LEFT JOIN comments c ON fb.id = c.board_id 
        GROUP BY fb.id 
        ORDER BY fb.id DESC
    `;
    db.query(sql, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
            res.send('전송오류');
        }
    })
});

app.get('/detail/:id' , (req,res) => {
    const id = req.params.id;
    const sql = ` select * from free_board where id = ${id} `;
    db.query(sql, (err, data) => {
        if(!err){
            res.send(data);
        } else {
            console.log(err);
            res.send('전송오류');
        }
    })
})

app.post('/detail/:id', (req, res) => {
    const id = req.params.id;
    const deleteCommentsSql = `DELETE FROM comments WHERE board_id = ?`;
    const deleteBoardSql = `DELETE FROM free_board WHERE id = ?`;

    db.query(deleteCommentsSql, [id], (err) => {
        if (err) {
            console.log(err);
            return res.send('전송오류');
        }

        // 게시글 삭제
        db.query(deleteBoardSql, [id], (err, data) => {
            if (!err) {
                res.sendStatus(200);
            } else {
                console.log(err);
                res.send('전송오류');
            }
        });
    })
})

app.post('/create' , (req, res) => {
    
    const { title, writer, contents } = req.body;

    const sql = `insert into free_board(title, writer, contents) value (?,?,?)`;
    db.query(sql, [title,writer,contents], (err, data) => {
        if(!err){         
            res.sendStatus(200); 
        } else {
            console.log(err);
            res.send('전송오류');
        }
    });
});

app.post('/modify/:id', (req, res) => {

    const { title, writer, contents } = req.body;

    const id = req.params.id;

    const sql = `update free_board set title = ? , writer =? , contents = ? where id = ${id}`;

    db.query(sql, [title, writer, contents], (err, data) => {
        if(!err){
            res.sendStatus(200); 
        } else {
            console.log(err);
            res.send('전송오류');
        }
    })
})

app.post('/list/:id', async (req, res) => {
    const { id } = req.params;

    const sql = `update free_board set viewCount = viewCount + 1 where id = ${id}`;

    db.query(sql, (err, data) => {
        if(!err){
            res.sendStatus(200); 
        } else {
            console.log(err);
            res.send('전송오류');
        }
    })
});

app.get('/comments/:id', (req, res) => {
    const boardId = req.params.id;
    const sql = `SELECT * FROM comments WHERE board_id = ?`;
    db.query(sql, [boardId], (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
            res.send('전송오류');
        }
    });
});

app.post('/comments/:id', (req, res) => {
    const boardId = req.params.id;
    const { writer, contents } = req.body;
    const sql = `INSERT INTO comments (board_id, writer, contents) VALUES (?, ?, ?)`;
    db.query(sql, [boardId, writer, contents], (err, data) => {
        if (!err) {
            res.sendStatus(201); // Created
        } else {
            console.log(err);
            res.send('전송오류');
        }
    });
});

app.delete('/comments/:commentId', (req, res) => {
    const commentId = req.params.commentId;
    const sql = `DELETE FROM comments WHERE co_id = ?`;
    db.query(sql, [commentId], (err, data) => {
        if (!err) {
            res.sendStatus(200); // OK
        } else {
            console.log(err);
            res.send('전송오류');
        }
    });
});

