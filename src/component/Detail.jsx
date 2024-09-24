import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './free_board.css';

const Detail = () => {

    const {id} = useParams();

    const [ detail , setDetail ] = useState(null);

    const [writer, setWriter] = useState('');

    const [commentContent, setCommentContent] = useState(''); 

    const [comments, setComments] = useState([]); 
    
    

    const getDetaildata = async () => {
        try{
            const board = await axios.get(`/detail/${id}`);
            setDetail(board.data[0]);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getDetaildata();
        getComments();
    }, []);

    const onDelete = async () => {
        if(window.confirm('삭제하시겠습니까?')){
            try{
                await axios.post(`/detail/${id}`, detail);
                window.location.href = '/list';
            }catch(err){
                console.log(err);
            }
        }
    }

    const getComments = async () => {
        try {
            const response = await axios.get(`/comments/${id}`);
            setComments(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addComment = async () => {
        if (!writer || !commentContent) {
            alert('작성자 이름과 댓글 내용을 모두 입력하세요.');
            return;
        }
        try {
            await axios.post(`/comments/${id}`, { contents: commentContent, writer });
            setCommentContent('');
            setWriter(''); 
            getComments(); 
        } catch (err) {
            console.log(err);
        }
    };

    const onDeleteComment = async (commentId) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/comments/${commentId}`);
                getComments(); 
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addComment();
        }
    };


    if(detail !== null){
        return (
            <div className='detail'>

                <div className='container'>
                    <div className='header'>
                    <a href="/list">자유게시판</a> <br />
                    <span className='title'>{detail.title}</span>
                    </div>

                    <div className='userInfo'>
                    <div>
                    <span className='writer'>{detail.writer}</span>
                    <span className='date'>({detail.reg_date.substring(0,10)})</span>    
                    </div>
                    <span className='viewCount'>조회   {detail.viewCount}</span>
                    </div>
                </div>
    
                <hr />
                <textarea name="contents" id="" readOnly>{detail.contents}</textarea>

                <div className='buttons'>
                        <div className='button1'>
                        <Link to={'/list'}><button>목록</button></Link>
                        </div>
                        <div className='button2'>
                        <Link to={`/modify/${id}`}><button className='btn1'>수정</button></Link>
                        <button onClick={onDelete}>삭제</button>      
                        </div>     
                </div>

                <div className='comments'>
                <input 
                    className='shortInput'
                    type="text" 
                    value={writer} 
                    onChange={(e) => setWriter(e.target.value)} 
                    placeholder="작성자" 
                />
                <textarea
                    className='longText' 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글 내용을 입력하세요."
                    onKeyDown={handleKeyPress}
                />
                <button onClick={addComment}>댓글 쓰기</button>
                </div>

                <h3>댓글</h3>
                <table className='comment_table'>
                <tbody>
                    {comments.map(comment => (
                        <tr key={comment.co_id}>
                            <td>{comment.writer}</td>
                            <td>{comment.contents}
                            <button className='delBtn' onClick={() => onDeleteComment(comment.co_id)}>X</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
          </div>
        );
    };
};

export default Detail;