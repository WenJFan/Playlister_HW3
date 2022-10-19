import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    
    const { store } = useContext(GlobalStoreContext);
    let canAddSong = store.canAddSong();//store.currentList !== null;
    let canUndo = store.canUndo();
    let canRedo = store.canRedo();
    let canClose = store.canClose();//store.currentList !== null;
    let addSongClass = "toolbar-button";
    let undoClass = "toolbar-button";
    let redoClass = "toolbar-button";
    let closeClass = "toolbar-button";
    if (!canAddSong) addSongClass += " disabled";
    if (!canClose) closeClass += " disabled";
    //if(!store.ModalOpen) addSongClass += " disabled";
    if (!canUndo) undoClass += " disabled";
    if (!canRedo) redoClass += " disabled";
    
    const history = useHistory();

    let enabledButtonClass = "playlister-button";
    function handleAdd(){
        store.addAddSongTransaction();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAddSong}
                value="+"
                className={enabledButtonClass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;