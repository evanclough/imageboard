import React, {useState, useEffect} from 'react'
import Axios from 'axios'

const Header = () => {
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
        <div 
            style = {{margin: 'auto', width: '30%', border: '3px solid green', padding: '10px'}}
        >
            
            <div style = {{textAlign: 'center', padding: '10px'}}>boards: {boards.map((board) => (<a href = {`/${board.boardName}`} key = {board.boardName}>{board.boardName} / </a>))}</div><h1 style = {{textAlign: 'center'}}><i>REACTCHAN (SCUFFED)</i></h1>
        </div>
    )
}

export default Header;