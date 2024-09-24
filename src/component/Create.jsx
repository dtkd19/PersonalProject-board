import axios from 'axios';
import React, { useState } from 'react';
import './free_board.css';

const Create = () => {


    const [ board , setBoard ] = useState({
        title : '',
        writer : '',
        contents : ''
    });


    const onChange =  (e) => {
        const { name , value } = e.target;
        setBoard({
            ...board,
            [name]:value
        });
    }


    const onAdd = async () => {

        if(board.title === ''){
            alert('제목을 입력해주세요.');
            return;
        }
        if(board.writer === ''){
            alert('작성자를 입력해주세요.');
            return;
        }
        if(board.contents === ''){
            alert('내용을 입력해주세요.');
            return;
        }
        if(window.confirm('작성하시겠습니까?')){
            try{
                await axios.post('/create', board);
                window.location.href = "/list";
            }catch(error){
                console.log(error);
            }
        }
    }


    return (
        <div className='create'>

            <h2>자유게시판 글쓰기</h2>
            <hr />
            

            <div className='container'>

                <div className='inputBox'>
                    <input className='titleInput' type="text" name='title' placeholder='제목을 입력해주세요' onChange={onChange} value={board.title}/>
                    <input className='nameInput' type="text" name='writer' placeholder='작성자' onChange={onChange} value={board.writer}/>
                </div>

                <textarea type="text" name='contents' placeholder='내용을 입력해주세요' onChange={onChange} value={board.contents}/>
                <br />
                
                <button onClick={onAdd}>등록</button>
            </div>
        </div>
    );
};

export default Create;