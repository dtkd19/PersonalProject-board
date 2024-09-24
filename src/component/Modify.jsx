import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './free_board.css';

const Modify = () => {

    const {id} = useParams();

    const [ modify, setModify ] = useState(null);

    const [ form, setForm ] = useState({
        title : '',
        writer : '',
        contents : ''
    });

    const getModifyData = async () => {
        try{
            const board = await axios.get(`/detail/${id}`);
            setModify(board.data[0]);
            setForm({
                title : board.data[0].title,
                contents : board.data[0].contents,
                writer : board.data[0].writer
            })
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getModifyData();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const onModify = async () => {

        if(form.title === ''){
            alert('제목을 입력해주세요.');
            return;
        }
        if(form.writer === ''){
            alert('작성자를 입력해주세요.');
            return;
        }
        if(form.contents === ''){
            alert('내용을 입력해주세요.');
            return;
        }
        if(window.confirm('수정하시겠습니까?')){
            try{
               await axios.post(`/modify/${id}`, form);           
                window.location.href = `/detail/${id}`;
            }catch(error){
                console.log(error);
            }
        }
    }

    if(modify !== null){
        return (
            <div className='modify'>

                <h2>자유게시판 글쓰기</h2>
                <hr />

                <div className='inputBox'>
                    <div>
                        <input className='titleInput' type="text" name='title' placeholder='제목을 입력해주세요' onChange={onChange} value={form.title}/>
                        <input className='nameInput' type="text" name='writer' placeholder='작성자' onChange={onChange} value={form.writer}/>
                    </div>
                </div>

                <textarea type="text" name='contents' placeholder='내용을 입력해주세요' onChange={onChange} value={form.contents}/>

                <br />

                <button onClick={onModify}>수정</button>
            </div>
        );
    };
};

export default Modify;