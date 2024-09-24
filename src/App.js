import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from './component/List';
import Detail from './component/Detail';
import Create from './component/Create';
import Modify from './component/Modify';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<List />} />
            <Route path='/list' element={<List />} />
            <Route path='/detail/:id' element={<Detail/>} />
            <Route path='/create' element={<Create />} />
            <Route path='/modify/:id' element={<Modify/>} />
        </Routes>
    </BrowserRouter>
);
}

export default App;
