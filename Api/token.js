function makeid(length, onlyNumbers) {
    let result           = '';
    let characters = ""
    if (onlyNumbers === true)
    {
        characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    }else{
        characters = '0123456789';
    }

    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
async function routes(fastify) {
    fastify.post("/user/api/v2.0/game-identity/token", async (request, reply)=>{

        let data = {"access_token":"eyJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE3MjM5NDA3NDUsImV4cCI6MTcyMzk0NDM0NSwiaXNzIjoiZ2kiLCJhdWQiOiJnaSwgY2xpZW50LCBiaS1hY2NvdW50IiwiZ2lkIjoiYmNkM2NkMDctZjg3ZC00YzUwLTk3ZmItMzcyNWU5NGUzYTcxIiwiZ21lIjoicmVmb3JnZXIiLCJwbHQiOiJzdGVhbSJ9.INGYyPfKS2bkGk1nWLnydzczwHtHCycAUE5QRMHrL0f3nAIA3cv6uXVwHOUpqdEgDqdqo49YCTBE6BHam8MbWHQysilTX04e-Z2XXWX6YePIukQ6fjyH0xw1C_KKXzTOekbmlU-KCZ9dLi3D8vVC-4fkWwrL3czxpCclbwRxYQPOTmoTy5G-Fv3-U4edKET3a5-RyVMRsD5p0K_6wba3l6j8cET0SXH-5P46yxxyp1mUu76SdLT2nDDmEYdIgNWkWpXO-ONyxd0CJr_M3RQaTSIMF2r5A4gyMMpzlvF5kmnhOkiO0p1i1-1WAG21yrMrz6xM0DjAPLJF" + makeid(10,true),"user":{"username":"Silvius 21","email":"rabotnik753@gmail.com","google_id":"117409776291768584651","activated":true,"subscribed":false,"created_at":"2024-02-01T16:55:44Z","updated_at":"2024-04-11T12:02:40Z","id":"51dcf826-17db-4f87-91d5-4e95cdb853cf"}}

        return reply.send(data);

    })
}module.exports = routes;