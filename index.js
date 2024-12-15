require("./db").Init(function (){
        require("./server").Init(function (){
                console.log("Server started!")
        });
});