import {useState} from 'react';

const ExpandableImage = (props) => {
    const [expandImageBool, setExpandImageBool] = useState(false);
    return (
        <img 
            src = {props.imgURL} 
            onClick = {() => setExpandImageBool(expandImageBool ? false : true)} 
            style = {expandImageBool ? {height: 'initial'} : {height: '150px'}}
            alt = ""
        />
    )
}

export default ExpandableImage