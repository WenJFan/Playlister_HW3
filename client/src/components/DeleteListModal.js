import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
function DeleteListModal() {
    let text = "aaa";
    const { store } = useContext(GlobalStoreContext);
    function handleDeleteList(){
        store.deleteList(store.markListForDeletionId)
        store.hideDeleteList()
    }
    function handleHideDeleteList(){
        store.hideDeleteList()
    }
    if(store.markListForDeletion!=null){
        text = store.markListForDeletion.name;
    }
        
    return (
        <div
               class="modal"
               id="delete-list-modal"
               data-animation="slideInOutLeft">
                   <div class="modal-root" id='verify-delete-list-root'>
                       <div class="modal-north">
                           Delete playlist?
                       </div>
                       <div class="modal-center">
                           <div class="modal-center-content">
                               Are you sure you wish to permanently delete the <span>{text}</span> playlist?
                           </div>
                       </div>
                       <div class="modal-south">
                           <input type="button"
                               id="delete-list-confirm-button"
                               class="modal-button"
                               onClick={handleDeleteList}
                               value='Confirm' />
                           <input type="button"
                               id="delete-list-cancel-button"
                               class="modal-button"
                               onClick={handleHideDeleteList}
                               value='Cancel' />
                       </div>
                   </div>
           </div>
    );
}

export default  DeleteListModal;