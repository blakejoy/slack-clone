 class Namespace{

    constructor(id, nsTitle,img, endpoint) {
        this.id = id;
        this.nsTitle = nsTitle;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = new Map();
    }

    addRoom(roomObj){
        if(this.rooms.has(roomObj.roomTitle)){
            return this.rooms.get(roomObj.roomTitle);
        }else {
            this.rooms[roomObj.roomTitle] = roomObj;
        }
    }
 }


 module.exports = Namespace;
