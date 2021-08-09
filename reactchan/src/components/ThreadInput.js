import Axios from 'axios';
import {useState} from 'react';
import {useHistory} from 'react-router-dom'

const ThreadInput = () => {
    const history = useHistory()
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [imgURL, setImgURL] = useState("");
    const [textContent, setTextContent] = useState("");
    const [showFailedImgURLInput, setShowFailedImgURLInput] = useState(false);
    const [failedThreadMessage, setFailedThreadMessage] = useState("");
    const [showFailedTextContentInput, setShowFailedTextContentInput] = useState(false);
    const submitThread = () => {
        const checkIfValidImageRegex = new RegExp('(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?');
        const isValidImage = checkIfValidImageRegex.test(imgURL);
        const isTextContentNonNull = textContent.length > 0;
        const isValidInput = isValidImage && isTextContentNonNull;
        if(!isValidInput){
            if(!isTextContentNonNull) setShowFailedTextContentInput(true);
            else setShowFailedTextContentInput(false);
            if(!isValidImage) setShowFailedImgURLInput(true);
            else setShowFailedImgURLInput(false);
        }else{
            Axios.post('http://localhost:3001/api/makeThread', 
            {
                title: title.substring(0, 44),
                name: name.substring(0, 44),
                imgURL: imgURL.substring(0, 1023),
                textContent: textContent.substring(0, 4095)
            })
            .then(result => {
                if(result.data.successfulPost){
                    history.push(`/${result.data.postID}`)
                }else{
                    setFailedThreadMessage(result.data.message);
                }
            })
        }
    }
    return (
        <div style = {{margin: 'auto', width: '15%'}}>
            <p> Title: {" "} <input
                    value = {title}
                    onChange = {e => setTitle( e.target.value)}
            />
            </p>
            
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
                onClick = {submitThread}
                type = "button"
            >
                Submit Thread
            </button>
            {showFailedTextContentInput ? (<p style = {{color: 'red'}}>You must enter some text for your thread.</p>) : ""}
            {showFailedImgURLInput ? (<p style = {{color: 'red'}}>Please enter a valid image URL.</p>) : ""}
            <p>{failedThreadMessage}</p>
        </div>
    )
}

export default ThreadInput;