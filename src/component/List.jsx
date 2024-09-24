import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './free_board.css';

const List = () => {

    const [ list, setList ] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [filteredList, setFilteredList] = useState([]);

    const [searchOption, setSearchOption] = useState('title');

    const [currentPage, setCurrentPage] = useState(1);

    const [sort, setSort] = useState('latest');

    const itemsPerPage = 8;
    


    const getListData = async () => {
        const lists = await axios.get('/list');
        setList(lists.data);
        setFilteredList(lists.data);
    }

    useEffect(() => {
        getListData();
    },[]);

    useEffect(() => {
        const sortedList = sortList(filteredList);
        setFilteredList(sortedList);
    }, [sort]); 

    const handleSearch = () => {
        if (searchTerm) {
            const filtered = list.filter(item => {
                if (searchOption === 'title') {
                    return item.title.includes(searchTerm);
                } else if (searchOption === 'writer') {
                    return item.writer.includes(searchTerm);
                } else if (searchOption === 'both') {
                    return item.title.includes(searchTerm) || item.writer.includes(searchTerm);
                }
                return false;
            });
            setFilteredList(filtered);
        } else {
            setFilteredList(list);
        }
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const plusViewCount = async (id) => {
        await axios.post(`/list/${id}`);
        getListData(); 
    };

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const onPre = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const onNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const sortList = (list) => {
        return [...list].sort((a, b) => {
            if (sort === 'latest') {
                return new Date(b.reg_date) - new Date(a.reg_date);
            } else if (sort === 'views') {
                return b.viewCount - a.viewCount;
            }
            return 0;
        });
    };

    if( list.length > 0){
        return (
            <div className='list'>
                <Link  style={{ textDecoration: "none"}} to={'/list'}><h2>자유게시판</h2></Link>
                <hr />
                
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="both">제목+작성자</option>
                </select>

                <input 
                className='search'
                type="text" 
                placeholder="검색어 입력" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyPress}
            />

            <button className='searchBtn' onClick={handleSearch}>검색</button>

            <div className='sort-container'>
                <div className='sort'>
                    <button 
                        className={sort === 'latest' ? 'active' : ''} 
                        onClick={() => setSort('latest')}
                    >
                        최신순
                    </button>
                    <button 
                        className={sort === 'views' ? 'active' : ''} 
                        onClick={() => setSort('views')}
                    >
                        조회순
                    </button>
                </div>
            </div>


                <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회</th>
                    </tr>
                </thead>
                <tbody>
                  {
                     currentItems.map(b => (
                        

                    <tr key={b.id} >
                    <td>{b.id}</td>
                    <td><Link to={`/detail/${b.id}`} onClick={() => plusViewCount(b.id)}>{b.title}
                    {b.commentCount > 0 && <span className="comment-count">({b.commentCount})</span>} </Link></td>
                    <td>{b.writer}</td>
                    <td>{b.reg_date.substring(0,10)}</td>   
                    <td>{b.viewCount}</td>
                    </tr>

                        ))
                    }
                </tbody>
                </table>
                

                <div className='pagination'>


                    <button onClick={onPre} disabled={currentPage === 1}>
                        이전
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => handlePageChange(index + 1)} 
                            disabled={currentPage === index + 1}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button onClick={onNext} disabled={currentPage === totalPages}>
                        다음
                    </button>
     
             
                    <Link to={'/create'}>
                        <button className='wt'>글쓰기</button>
                    </Link>
                
                </div>

                

            </div>
        );
    };
}

export default List;