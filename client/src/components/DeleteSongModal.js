import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
function DeleteSongModal() {
    let title = "";
    const { store } = useContext(GlobalStoreContext);
    function handleDeleteSong(){
        store.addDeleteSongTransaction(store.markSongForDeletionId)
        store.hideDeleteSong()
    }
    function handleHideDeleteSong(){
        store.hideDeleteSong()
    }
    if(store.markSongForDeletion!=null){
        title = store.markSongForDeletion.title;
    }
  
    return (
        <div
            class="modal"
            id="delete-song-modal"
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-song-root'>
                    <div class="modal-north">
                        Remove Song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently remove the <span>{title}</span> &nbsp;from the playlist?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button"
                            id="delete-song-confirm-button"
                            class="modal-button"
                            onClick={handleDeleteSong}
                            value='Confirm' />
                        <input type="button"
                            id="delete-song-cancel-button"
                            class="modal-button"
                            onClick={handleHideDeleteSong}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal;