import {Route} from "react-router-dom";
import Thread from "./Thread";
const RenderThreads = (props) => {
        return (
        <>
        {props.board.threads[0].map((thread) => (
            <Route 
            key = {props.board.boardName + thread.postID.toString()}
            path = {`/${props.board.boardName}/${thread.postID}`} 
            
            render={(p) => (
                <Thread 
                    key = {props.board.boardName + thread.postID.toString()}
                    {...p} 
                    ID = {thread.postID}
                    title = {thread.title}
                    board = {props.board.boardName}
                />
            )}
        />
        ))}
        </>
    )
}
export default RenderThreads