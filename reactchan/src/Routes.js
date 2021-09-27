import Catalog from './components/Catalog';
import RenderThreads from './components/RenderThreads';
import {BrowserRouter, Route} from "react-router-dom";
import Axios from 'axios'
import Header from './components/Header';
import React, {useState, useEffect} from 'react'

function Routes() {
    const [boards, setBoards] = useState([])
    useEffect(() => {
        Axios.get('http://localhost:3001/api/fetchEverything')
        .then(result => {
            for(let i = 0; i < result.data.length; i++){
                result.data[i].threads.pop()
            }
            setBoards(result.data)
        })
    }, [])
    return (  
        <BrowserRouter forceRefresh = {true}>
            <Route
                path = '/'
                exact
                component = {Header}
            />
                    {boards.map((board) => (
                        <Route
                            key = {board.boardName}
                            path = {`/${board.boardName}`}
                            exact
                            render = {(props) => (
                                <Catalog
                                    {...props} 
                                    board = {board.boardName}
                                />
                            )}
                        />
                    ))}
                    {boards.map((board) => (
                        <RenderThreads
                            key = {board.boardName}
                            board = {board}
                        />
                    ))}
        </BrowserRouter>
    );
}

export default Routes;
