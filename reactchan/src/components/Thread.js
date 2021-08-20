import Axios from 'axios'
import {useState, useEffect} from 'react'
import PostInput from './PostInput';
import ExpandableImage from './ExpandableImage';
import Header from './Header';
import Post from './Post';

const Thread = (props) => {
    console.log(props);
    const [initialPost, setInitialPost] = useState([]);
    const [posts, setPosts] = useState([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [replyingTo, setReplyingTo] = useState(-1)
    const [isThreadFull, setIsThreadFull] = useState(false);
    const [postersInThread, setPostersInThread] = useState(0);
    const [totalReplies, setTotalReplies] = useState(0)
    const [imageReplies, setImageReplies] = useState(0)
    useEffect(() => {
        Axios.post(`http://localhost:3001/api/${props.board}/fetchPost`, 
        {ID: props.ID})
        .then(result => {
            setInitialPost(result.data)
        })
        Axios.post(`http://localhost:3001/api/${props.board}/fetchPostsForThread`,
        {parentThread: props.ID})
        .then(result => {
            setPosts(result.data);
        })
        Axios.post(`http://localhost:3001/api/${props.board}/checkIfThreadFull`, 
        {parentThread: props.ID})
        .then(result => {
            setIsThreadFull(result.data.threadFull);
        })
        Axios.post(`http://localhost:3001/api/${props.board}/postersInThread`,
        {parentThread: props.ID})
        .then(result => {
            setPostersInThread(result.data.postersInThread);
        })
        Axios.post(`http://localhost:3001/api/${props.board}/fetchTotalReplies`,
        {ID: props.ID})
        .then(result => {
            setTotalReplies(result.data.totalReplies);
        })
        Axios.post(`http://localhost:3001/api/${props.board}/fetchImageReplies`, 
        {ID: props.ID})
        .then(result => {
            setImageReplies(result.data.imageReplies);
        })
    }, [props.ID, props.board]);
    return (
        <>
        <Header/>
        <a href = '#'><h1 

                        style = {{textAlign: 'center'}}
                        onClick = {() => setShowPostForm(!showPostForm)}
                    > 
                    [Reply to this thread]
                    </h1></a>
                    <div style = {{ padding: '5px'}}><p style = {{textAlign: 'right'}}>Posters: {postersInThread} / Total Replies: {totalReplies - 1} / Image Replies: {imageReplies - 1} </p></div>
        {showPostForm && !isThreadFull ? <PostInput board = {props.board}parentThread = {props.ID} replyingTo = {replyingTo}/> : ""}
        {initialPost.map((initialPost) => (
            <div
                className = 'post'
                style = {{display: 'inline'}}
            >
                <p>
                    <b>
                        {props.title}{": "}
                    </b>
                    <b style = {{color: 'green'}}>
                        {initialPost.name}{" "}
                    </b> 
                    No. {props.ID}
                    {" "}
                    {initialPost.timestamp.substring(0, 10)}
                    {" "}
                    {initialPost.timestamp.substring(11, 19)}
                    {"  "}
                    {posts.map((searchForReply) => (
                        searchForReply.ID > initialPost.ID 
                        && searchForReply.textContent.includes(`>>${initialPost.ID}`)
                        ? <a 
                        style = {{fontSize: '12px'}}
                        href = {`#${searchForReply.ID}`}> 
                           {`>>${searchForReply.ID}`}
                        </a>
                        :<></>
                    ))}
                </p>
                <ExpandableImage imgURL = {initialPost.imgURL}/>
                    <div>
                        {initialPost.textContent}
                    </div>
            </div>
        ))}
        
        {posts.map((post) => (
            <div style = {{paddingTop: '5px', maxWidth:"40%"}}
                onDoubleClick = {() => { setReplyingTo(post.ID);setShowPostForm(true);}}
            >
            <Post
                post = {post}
                posts = {posts}
            />
            </div>
        ))}
        </>
        
    )
}

export default Thread