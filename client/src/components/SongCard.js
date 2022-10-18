import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    function handleDeleteSong(event){
        let id = index;
        event.stopPropagation();
        store.showDeleteSong(id);
    }
    function handleClick(event){
        if (event.detail === 2) {
            let id = index;
            event.stopPropagation();
            store.showEditSong(id);
        }
    }
    function handleDragStart(event){
        event.dataTransfer.setData("song", index);
    }
    function handleDragOver(event){
        event.preventDefault();
    }
    function handleDragEnter(event){
        event.preventDefault();
    }
    function handleDragLeave(event){
        event.preventDefault();
    }
    function handleDrop(event){
        event.preventDefault();
        let targetId = index;
        let sourceId = Number(event.dataTransfer.getData("song"));
        // ASK THE MODEL TO MOVE THE DATA
        store.addMoveSongtransaction(sourceId,targetId);
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
      
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;