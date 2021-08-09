import Axios from 'axios';
import {useState} from 'react';
import {useHistory} from 'react-router-dom'


const PostInput = (props) => {
    const history = useHistory()
    const [name, setName] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [textContent, setTextContent] = useState(props.replyingTo !== -1 ? `>>${props.replyingTo} \n` : "");
    const [failedThreadMessage, setFailedThreadMessage] = useState("");
    const [showFailedInput, setShowFailedInput] = useState(false);
    const submitPost = () => {
        const checkIfValidImageRegex = new RegExp('(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?');
        const isValidImage = checkIfValidImageRegex.test(imgURL);
        const isTextContentNonNull = textContent.length > 0;
        const isValidInput = isTextContentNonNull || isValidImage;
        if(!isValidInput){
            setShowFailedInput(true);
        }else{
            const post = {
                name: name.substring(0, 44),
                imgURL: imgURL.substring(0 ,1023),
                textContent: textContent.substring(0, 4095),
                parentThread: props.parentThread
            }
            Axios.post('http://localhost:3001/api/makePost', post)
            .then(result => {
                if(result.data.successfulPost){
                    history.push(`/${result.data.parentThread}`)
                }else{
                    setFailedThreadMessage(result.data.message);
                }
            })
        }
    }
    return (
        <div style = {{margin: 'auto', width: '15%'}}>
            <p> 
                Name: {" "}   
                <input
                    placeholder = "Anonymous"
                    value = {name}
                    onChange = {e => setName( e.target.value)}
                />
            </p>
            <p> 
                Image URL: {" "}   
                <input
                    value = {imgURL}
                    onChange = {e => setImgURL( e.target.value)}
                />
            </p>
            <p> 
                Text Content: {" "}   
                <input
                    value = {textContent}
                    onChange = {e => setTextContent( e.target.value)}
                />
            </p>
            <button 
                onClick = {submitPost}
                type = "button"
            >
                Submit Post
            </button>
            {showFailedInput ? (<p style = {{color: 'red'}}>You must have either text or an image in your reply.</p>) : ""}
            <p>{failedThreadMessage}</p>
        </div>
    )
}

export default PostInput;