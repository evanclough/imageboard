import Catalog from './components/Catalog';
import {BrowserRouter, Route, Switch } from "react-router-dom";
import Thread from "./components/Thread";
import Axios from 'axios'
import {useState, useEffect} from 'react'
function Routes() {
    const [threads, setThreads] = useState([]);
    useEffect(() => {
        Axios.get("http://localhost:3001/api/fetchThreads")
        .then(result => {
            setThreads(result.data);
        })
    }, [])
    return (  
        <BrowserRouter forceRefresh = {true}>
            <Switch>
                <Route
                    path = '/'
                    exact
                    component = {Catalog}
                />
                {threads.map((thread) => (
                    <Route 
                        path = {`/${thread.postID}`} 
                        exact 
                        render={(props) => (
                            <Thread 
                                {...props} 
                                ID = {thread.postID}
                                title = {thread.title}
                            />
                        )}
                    />
                ))}
                <Route 
                    path = '/'
                    render = {() => <div>404 :/</div>}
                    />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
