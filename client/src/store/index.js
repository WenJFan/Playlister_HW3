import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    STORE: "STORE",
    DRAG: "DRAG",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markSongForEditionId:null,
        markSongForEdition: null,
        markSongForDeletion: null,
        markSongForDeletionId: null,
        markListForDeletionId: null,
        markListForDeletion: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            case GlobalStoreActionType.DRAG:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            case GlobalStoreActionType.STORE:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    markSongForEditionId: payload.markSongForEditionId,
                    markSongForEdition: payload.markSongForEdition,
                    markSongForDeletion: payload.markSongForDeletion,
                    markSongForDeletionId: payload.markSongForDeletionId,
                    markListForDeletionId: payload.markListForDeletionId,
                    markListForDeletion: payload.markListForDeletion,
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.deleteList = function(id){
        async function asyncDeleteList(id){
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                //playlist.name = newName;
                async function deleteList(playlist) {
                    response = await api.deletePlaylist(playlist._id);
                    if (response.data.success) {
                        async function getListPairs() {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                deleteList(playlist);
            }
        }
        asyncDeleteList(id);
    }
    store.createNewList = function(){
        async function asyncCreateList(){
            let newList = {
                name:"Untitled"+store.newListCounter,
                songs: []
            }
            let response = await api.createPlaylist(newList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function getListPairs(playlist){
                    response = await api.getPlaylistPairs();
                    if (response.data.success){
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                playlist: playlist
                            }
                        });
                    }store.setCurrentList(playlist._id)   
                }
                getListPairs(playlist);
            }
        }
        asyncCreateList();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.showDeleteList = function(id){
        async function asyncSetListForDeletion(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.STORE,
                        payload: {
                            markSongForEditionId:null,
                            markSongForEdition:null,
                            markSongForDeletion:null,
                            markSongForDeletionId:null,
                            markListForDeletionId: id,
                            markListForDeletion: playlist,}
                    });
                    //store.history.push("/playlist/" + playlist._id);
                    let modal = document.getElementById("delete-list-modal");
                    modal.classList.add("is-visible");
                }
            }
            
        }
        asyncSetListForDeletion(id);
        
        /*storeReducer({
            type: GlobalStoreActionType.STORE,
            payload: {
                markListForDeletionId: id,
                markListForDeletionName: name
            }
        });*/
        
    }

    store.hideDeleteList = function(){
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    

    store.hideDeleteSong = function(){
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    store.addAddSongTransaction = function(){
        let t ="Untitle";
        let a = "Unknown";
        let i = "dQw4w9WgXcQ";
        let s = store.getPlaylistSize();
        let transaction = new AddSong_Transaction(store,s,t,a,i);
        tps.addTransaction(transaction);
    }
    store.addNewSong = function(index,t,a,i){
        let cur = store.currentList;
        let currentId = store.currentList._id
        let newSong = {
            title:t,
            artist:a,
            youTubeId:i
        }  
        cur.songs.splice(index, 0, newSong);
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(store.currentList._id, cur);;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + currentId);
                //store.setCurrentList(response.data.playlist._id);
            }
        }
        asyncAddSong(currentId,cur);
        
    }

    store.showDeleteSong = function(index){
        async function asyncsetDeleteSong(index){
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let deleteSong = playlist.songs[index]
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.STORE,
                        payload: {
                            markSongForEditionId:null,
                            markSongForEdition:null,
                            markSongForDeletion: deleteSong,
                            markSongForDeletionId: index,
                            markListForDeletionId: null,
                            markListForDeletion: null}
                    });
                    let modal = document.getElementById("delete-song-modal");
                    modal.classList.add("is-visible");
                }
            }
        }
        asyncsetDeleteSong(index);
    }
    store.addDeleteSongTransaction = function(id){
        let song = store.markSongForDeletion;
        let transaction = new DeleteSong_Transaction(store,id,song.title,song.artist,song.youTubeId);
        tps.addTransaction(transaction);
    }
    store.deleteSongfunc = function(id){
        let cur = store.currentList;
        let currentId = store.currentList._id;
        let tempArray=cur.songs.filter(song=>cur.songs.indexOf(song)!==id);
        cur.songs = tempArray;
        async function asyncDeleteSong() {
            let response = await api.updatePlaylistById(store.currentList._id, cur);;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + currentId);
            }
        }
        asyncDeleteSong(currentId,cur);
    }
    store.showEditSong = function(index){
        async function asyncsetEditSong(index){
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let editSong = playlist.songs[index]
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.STORE,
                        payload: {
                            markSongForEditionId: index,
                            markSongForEdition: editSong,
                            markSongForDeletion: null,
                            markSongForDeletionId: null,
                            markListForDeletionId: null,
                            markListForDeletion: null}
                    });
                    let modal = document.getElementById("edit-song-modal");
                    let est = document.getElementById("text1");
                    let esa = document.getElementById("text2");
                    let esi = document.getElementById("text3");
                    est.value = editSong.title;
                    esa.value = editSong.artist;
                    esi.value = editSong.youTubeId;
                    modal.classList.add("is-visible");
                }
            }
        }
        asyncsetEditSong(index);
    }
    store.hideEditSong= function (){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    store.addEditSongTransaction = function(index,Ot,Nt,Oa,Na,Oi,Ni){
        let transaction = new EditSong_Transaction(store,index,Ot,Nt,Oa,Na,Oi,Ni);
        tps.addTransaction(transaction);
    }
    store.editSongfunc = function(index,t,a,i){
        let list = store.currentList;
        let currentId = store.currentList._id;
        list.songs[index].title = t;
        list.songs[index].artist = a;
        list.songs[index].youTubeId = i;
        async function asyncEditSong() {
            let response = await api.updatePlaylistById(store.currentList._id, list);;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + currentId);
            }
        }
        asyncEditSong(currentId,list);
    }
    store.addMoveSongtransaction = function(start,end){
        let transaction = new MoveSong_Transaction(this, start, end);
        tps.addTransaction(transaction);
    }
    store.moveSong = function(start,end){
        let list = store.currentList;
        let currentId = store.currentList._id;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        async function asyncMoveSong(list) {
            let response = await api.updatePlaylistById(store.currentList._id, list);;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.DRAG,
                    payload: {playlist:list}
                });
                store.history.push("/playlist/" + currentId);
            }
        }
        asyncMoveSong(list);
    }
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}