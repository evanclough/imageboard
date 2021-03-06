import ThreadCover from './ThreadCover';
import Axios from 'axios';
import {useState, useEffect} from 'react'
import ThreadInput from './ThreadInput'
import Header from './Header'

const Catalog = (props) => {
    const [threads, setThreads] = useState([]);
    const [showThreadForm, setShowThreadForm] = useState(false);
    useEffect(() => {
        Axios.get(`http://localhost:3001/api/${props.board}/fetchThreads`)
        .then(result => {
            setThreads(result.data);
        })
    }, [props.board])
    return (
        <>
        <Header/>
        <h1 style = {{textAlign: 'center'}}>
            {props.board}
        </h1>
        <div>
            <div>   
                    
                    <a href = '#'><h1 

                        style = {{textAlign: 'center'}}
                        onClick = {() => setShowThreadForm(!showThreadForm)}
                    > 
                    [Make a New Thread]
                    </h1></a>
                    
                    {showThreadForm ? <ThreadInput board = {props.board}/> : ""}
            </div>
            {threads.map((thread) => (
                <span key = {props.board + thread.postID}>
                        <ThreadCover
                            key = {props.board + thread.postID}
                            postID = {thread.postID}
                            title = {thread.title}
                            board = {props.board}
                        /> 
                </span>
            ))}
        </div>
        </>
    )
}

export default Catalog