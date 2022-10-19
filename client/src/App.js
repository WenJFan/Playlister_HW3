import './App.css';
import { React } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar,DeleteListModal,DeleteSongModal,EditSongModal } from './components'
import {GlobalStoreContext} from './store'
import { useContext } from 'react'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const { store } = useContext(GlobalStoreContext);
    let ctrlPressed = false;
    document.onkeydown = handleAppKeyDown;
    document.onkeyup = handleAppKeyUp;
    function handleAppKeyDown(keyEvent){
        let CTRL_KEY_CODE = "17";
        if (keyEvent.which == CTRL_KEY_CODE) {
            ctrlPressed = true;
        }
        else if (keyEvent.key.toLowerCase() == "z") {
            if (ctrlPressed) {
                if (store.canUndo()){
                    store.undo();
                }
            }
        }
        else if (keyEvent.key.toLowerCase() == "y") {
            if (ctrlPressed) {
                if (store.canRedo()){
                    store.redo();
                }
            }
        }
    }
    function handleAppKeyUp(keyEvent){
        if (keyEvent.which == "17")
            ctrlPressed = false;
    }
    
    /*handlectrlKeyPress = (event) => {
        if (event.ctrlKey&&(event.which == 90 || event.keyCode == 90)) {
            if (store.canUndo()){
                store.undo();
            }
        }
        else if (event.ctrlKey&&(event.which == 89 || event.keyCode == 89)) {
            if (store.canRedo()){
                store.redo();
               
            }
        }
    }*/
    
    return (
        
        <Router>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector}/>
                <Route path="/playlist/:id" exact component={PlaylistCards} />
            </Switch>
            <Statusbar />
            <DeleteListModal></DeleteListModal>
            <DeleteSongModal></DeleteSongModal>
            <EditSongModal></EditSongModal>
        </Router>
        
    )
}

export default App