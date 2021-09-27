import Axios from 'axios';
import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";

const ThreadCover = (props) => {
    const [initialPost, setInitialPost] = useState([])
    const [totalReplies, setTotalReplies] = useState(0)
    const [imageReplies, setImageReplies] = useState(0)
    useEffect(() => {
        Axios.post(`http://localhost:3001/api/${props.board}/fetchPost`, 
        {ID: props.postID})
        .then(result => {
            setInitialPost(result.data)
        })
        Axios.post(`http://localhost:3001/api/${props.board}/fetchTotalReplies`,
        {ID: props.postID})
        .then(result => {
            setTotalReplies(result.data.totalReplies);
        })
        Axios.post(`http://localhost:3001/api/${props.board}/fetchImageReplies`, 
        {ID: props.postID})
        .then(result => {
            setImageReplies(result.data.imageReplies);
        })
    }, [props.postID, props.board])
    return (
        <>
            {initialPost.map((initialPost) => (
                <span key = {initialPost.ID}style = {{ display: 'inline-block', padding: '10px', width: '150px', textAlign: 'center'}}>
                    <Link 
                        
                        key = {props.postID}
                        to = {`/${props.board}/${props.postID}`}
                    >
                    <img src = {initialPost.imgURL} alt = "" style = {{maxWidth: '150px', maxHeight: '150px'}}></img>
                    </Link>
                    <p><b> {props.title}{props.title !== "" ? ": " : ""}</b> {initialPost.textContent.substring(0, 100)}</p>
                    <p style = {{fontSize: '12px'}}>R: <b>{totalReplies}</b> / I: <b>{imageReplies}</b></p>
                    
                </span>
            ))}
            
        </>
    )
}
export default ThreadCover