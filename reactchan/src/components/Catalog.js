import ThreadCover from './ThreadCover';
import Axios from 'axios';
import {useState, useEffect} from 'react'
import ThreadInput from './ThreadInput'
import Header from './Header'

const Catalog = (props) => {
    const [threads, setThreads] = useState([]);
    const [showThreadForm, setShowThreadForm] = useState(false);
    useEffect(() => {
        Axios.get('http://localhost:3001/api/fetchThreads')
        .then(result => {
            setThreads(result.data);
        })
    }, [])
    return (
        <>
        <Header/>
        <div>
            <div>   
                
                    <a href = '#'><h1 

                        style = {{textAlign: 'center'}}
                        onClick = {() => setShowThreadForm(!showThreadForm)}
                    > 
                    [Make a New Thread]
                    </h1></a>
                    
                    {showThreadForm ? <ThreadInput/> : ""}
            </div>
            {threads.map((thread) => (
                <span>
                        <ThreadCover
                            postID = {thread.postID}
                            title = {thread.title}
                        /> 
                </span>
            ))}
            
        </div>
        </>
    )
}

export default Catalog