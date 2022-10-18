import jsTPS_Transaction from "../common/jsTPS.js"
/**
* MoveSong_Transaction
*
* This class represents a transaction that works with drag
* and drop. It will be managed by the transaction stack.
*
* @author McKilla Gorilla
* @author ?
*/
export default class AddSong_Transaction extends jsTPS_Transaction {
   constructor(initstore,index,inittitle,initartist,initid) {
       super();
       this.store = initstore;
       this.index = index;
       this.title = inittitle;
       this.artist = initartist;
       this.id=initid;  
   }
 
   doTransaction() {
       this.store.addNewSong(this.index,this.title,this.artist,this.id);
   }
 
   undoTransaction() {
       this.store.deleteSongfunc(this.index);
   }
}
