import Catalog from './components/Catalog';

import {BrowserRouter, Route, Switch } from "react-router-dom";
import Thread from "./components/Thread";
import Axios from 'axios'
import Header from './components/Header';
import React, {useState, useEffect} from 'react'
function Routes() {
    const [aThreads, aSetThreads] = useState([]);
    const [bThreads, bSetThreads] = useState([]);
    useEffect(() => {
        
        Axios.get(`http://localhost:3001/api/b/fetchThreads`)
        .then(result => {
            bSetThreads(result.data);
        })
            Axios.get(`http://localhost:3001/api/a/fetchThreads`)
            .then(result => {
                aSetThreads(result.data);
            })
    }, [])
    
    return (  
        <BrowserRouter forceRefresh = {true}>
            <Switch>
            <Route
                    path = '/'
                    exact
                    component = {Header}
                />
                
                    <Route
                        path = {`/a`}
                        exact
                        render = {(props) => (
                            <Catalog
                                {...props} 
                                board = 'a'
                            />
                        )}
                    />
                    <Route
                        path = {`/b`}
                        exact
                        render = {(props) => (
                            <Catalog
                                {...props} 
                                board = 'b'
                            />
                        )}
                    />
                
                    {aThreads.map((thread) => (
                            <Route 
                                key = {thread.postID}
                                path = {`/a/${thread.postID}`} 
                                exact 
                                render={(props) => (
                                    <Thread 
                                        {...props} 
                                        ID = {thread.postID}
                                        title = {thread.title}
                                        board = {'a'}
                                    />
                                )}
                            />
                        ))}
                        {bThreads.map((thread) => (
                            <Route 
                                key = {thread.postID}
                                path = {`/b/${thread.postID}`} 
                                exact 
                                render={(props) => (
                                    <Thread 
                                        {...props} 
                                        ID = {thread.postID}
                                        title = {thread.title}
                                        board = {'b'}
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
