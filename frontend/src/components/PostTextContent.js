import React, {useEffect, useState} from 'react'


const PostTextContent = (props) => {
    const [TC, setTC] = useState([]);
    useEffect(() => { 
        const regex = RegExp('>>\\d+', 'g');
        let array1;
        let resultJSX = [];
        let lastI = 0;
        while((array1 = regex.exec(props.textContent)) !== null){
            resultJSX.push(<React.Fragment key = {lastI}>{props.textContent.substring(lastI, regex.lastIndex - array1[0].length)}</React.Fragment>);
            resultJSX.push(<a key = {'a' + lastI.toString()}href = {`#${array1[0].substring(2, regex.lastIndex)}`}>{array1[0]}</a>);
            lastI = regex.lastIndex;
        }
        resultJSX.push(<React.Fragment key = {-1}>{props.textContent.substring(lastI)}</React.Fragment>)
        setTC(resultJSX);
    }, [props.textContent])
    
    return (
        <p>
            {TC}
        </p>
    )
}

export default PostTextContent;