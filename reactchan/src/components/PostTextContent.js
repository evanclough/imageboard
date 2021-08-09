import {useEffect, useState} from 'react'


const PostTextContent = (props) => {
    const [TC, setTC] = useState([]);
    useEffect(() => { 
        const regex = RegExp('>>\\d+', 'g');
        let array1;
        let resultJSX = [];
        let lastI = 0;
        while((array1 = regex.exec(props.textContent)) !== null){
            resultJSX.push(<>{props.textContent.substring(lastI, regex.lastIndex - array1[0].length)}</>);
            resultJSX.push(<a href = {`#${array1[0].substring(2, regex.lastIndex)}`}>{array1[0]}</a>);
            lastI = regex.lastIndex;
        }
        resultJSX.push(<>{props.textContent.substring(lastI)}</>)
        setTC(resultJSX);
    }, [props.textContent])
    
    return (
        <p>
            {TC}
        </p>
    )
}

export default PostTextContent;