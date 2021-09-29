import React from "react"
import ExpandableImage from "./ExpandableImage"
import PostTextContent from './PostTextContent'

const Post = (props) => {
    

    return (
        <div
            className = "post"
            id = {props.post.ID}
            key = {props.post.ID}
            style = {{overflow: 'auto', display: 'table',border: '1px solid #b7c5d9', backgroundColor: '#d6daf0', paddingRight: '20px', paddingLeft: '20px'}}
            >
                <div>
                    <p>
                    <b style = {{color: 'green'}}>
                        {props.post.name}{" "}
                    </b> 
                        {" "}
                        No. {props.post.ID} 
                        {" "}
                        {props.post.timestamp.substring(0, 10)}
                        {" "}
                        {props.post.timestamp.substring(11, 19)}
                        {" "}
                        {props.posts.map((searchForReply) => (
                        searchForReply.ID > props.post.ID 
                        && searchForReply.textContent.includes(`>>${props.post.ID}`)
                        ? 
                        <React.Fragment key = {searchForReply.ID}>
                        {" "}
                        <a 
                        style = {{fontSize: '12px'}}
                        href = {`#${searchForReply.ID}`}> 
                           {`>>${searchForReply.ID}`}
                        </a>
                        </React.Fragment>
                        :
                        <React.Fragment key = {Math.random()}></React.Fragment>
                    ))}
                    </p>
                </div>
                <div>
                    {props.post.imgURL === '#' ? "" : (
                    <ExpandableImage imgURL = {props.post.imgURL}/>
                    )}
                    <PostTextContent textContent = {props.post.textContent} />
                </div>
            </div>
    )
}

export default Post