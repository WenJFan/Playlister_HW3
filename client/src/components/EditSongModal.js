import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
function EditSongModal() {
    let title = "";
    const { store } = useContext(GlobalStoreContext);
    function handleEditSong(){
        let newtitle = document.getElementById("text1").value;
        let newartist = document.getElementById("text2").value;
        let newid = document.getElementById("text3").value;
        let oldsong = store.markSongForEdition;
        if (newtitle==""){
            newtitle = "Untitle";
        }
        if (newartist==""){
            newartist = "Unknown";
        }
        if (newid==""){
            newid = "dQw4w9WgXcQ";
        }
        store.addEditSongTransaction(store.markSongForEditionId,oldsong.title,newtitle,oldsong.artist,newartist,oldsong.yuTubeId,newid)
        store.hideEditSong()
    }
    function handleHideEditSong(){
        store.hideEditSong()
    }
    if(store.markSongForDeletion!=null){
        title = store.markSongForDeletion.title;
    }
  
    return (
        <div class="modal" id="edit-song-modal" data-animation="slideInOutLeft">
        <div class="modal-root" id='edit-platform'>
            <div class="modal-north">
                Edit Song
            </div>               
            <div class="editmode-center" >
                <div class="editmode-centerT">
                    Title:&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="text1" />
                </div>
                <div class="editmode-centerA">
                    Artist:&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="text2" />
                </div>
                <div class="editmode-centerI">
                    You Tube Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type='text' id='text3' />
                </div>
            </div>

            <div class="modal-south">
                <input type="button" id="edit-song-confirm-button" class="modal-button" value='Confirm' onClick={handleEditSong}/>
                <input type="button" id="edit-song-cancel-button" class="modal-button" value='Cancel' onClick={handleHideEditSong}/>
               
            </div>
        </div>
    </div>
    );
}

export default EditSongModal;