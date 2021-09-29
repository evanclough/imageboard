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
            
            <div style = {{textAlign: 'center', padding: '10px'}}>boards: {boards.map((board, index) => (<React.Fragment key = {board.boardName}><a href = {`/${board.boardName}`} >{board.boardName}  </a> {index != boards.length - 1 ? '/ ' : ''}</React.Fragment>))}</div><h1 style = {{textAlign: 'center'}}><i>Image Board</i></h1>
        </div>
    )
}

export default Header;