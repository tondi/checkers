var fs = require("fs");
var http = require("http");
var qs = require("querystring");
var io = require("socket.io");

var users = users || {}

// TODO: When attempting to login, server adds user and then tests its amount / See ADD_USER /
// Change AJAX to socket.io // Use express instead of fs
users = {
    addUser: function(userName) {
        //console.log("-> Adding user")
        this.userList.push(userName)

        // console.log(this.userList)

    },
    deleteUsers: function() {
        this.userList = []
    },
    test: function() {
        if (this.userList.length <= 2) {
            if (this.userList[0] !== this.userList[1]) {
                if (this.userList.length === 1) {
                    return ["login", "one_waiting"];
                } else {
                    return "login";
                }
            } else {
                return "user_with_that_name_already_logged"
            }
        } else {
            return "too_many_users <br/> close and reopen page to refresh user list"
        }

    },
    userList: []
}

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case "GET":

            console.log("Requested address: " + req.url)

            if (req.url === "/") {
                fs.readFile("static/index.html", function(error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });

                    res.write(data);
                    res.end();
                })
            } else {
                if (req.url === "/js/Game.js") {
                    fs.readFile("static/js/Game.js", function(error, data) {
                        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });

                        res.write(data);
                        res.end();
                    })
                }
                if (req.url === "/js/socket.io.min.js") {
                    fs.readFile("static/js/socket.io.min.js", function(error, data) {
                        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });

                        res.write(data);
                        res.end();
                    })
                }
                if (req.url === "/js/Net.js") {
                    fs.readFile("static/js/Net.js", function(error, data) {
                        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });

                        res.write(data);
                        res.end();
                    })
                }

                if (req.url === "/js/UI.js") {
                    fs.readFile("static/js/UI.js", function(error, data) {
                        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });

                        res.write(data);
                        res.end();
                    })
                }

                if (req.url === "/libs/three.js") {
                    fs.readFile("static/libs/three.js", function(error, data) {
                        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });

                        res.write(data);
                        res.end();
                    })
                }

            }

            break;
        case "POST":

            var servResp = function() {
                var allData = "";

                req.on("data", function(data) {
                    //console.log("data: " + data)
                    allData += data;
                })

                req.on("end", function(data) {
                    console.log(allData)

                    var finishObj = qs.parse(allData)
                    console.log(finishObj)

                    switch (finishObj.akcja) {
                        //dodanie nowego usera
                        case "ADD_USER":
                            users.addUser(finishObj.user);

                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            //console.log("allData: " + allData)

                            // PRODUCTION MODE
                            // Allow user to login instantly
                            // var loginRes = { loginResponse: "login" }
                            var loginRes = { loginResponse: users.test() }

                            //console.log(loginRes)
                            res.end(JSON.stringify(loginRes));

                            //console.log("dodaj")
                            break;
                        case "DELETE_USERS":
                            users.deleteUsers()
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            //console.log("allData: " + allData)
                            var loginRes = { loginResponse: "users_deleted" }
                                //console.log(loginRes)
                            res.end(JSON.stringify(loginRes));

                            break;
                            // Not required now. Using socket.io
                        case "INTERVAL":
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                            //console.log(users.test)
                            var loginRes = { loginResponse: users.test() }
                                //console.log(loginRes)
                            res.end(JSON.stringify(loginRes));

                            break;

                    }
                })
            }
            servResp(req, res)
            break;
    }
})


// Here conception changes - sockets are better
// http://stackoverflow.com/questions/7193033/nodejs-ajax-vs-socket-io-pros-and-cons
server.listen(3000);
console.log("serwer running on port 3000");

io = io(server);
io.on('connection', (socket) => {
    console.log("NEW CONNECT SOCKET");
    socket.on("connected", (data) => {
        console.log("CLIENT CONNECTED: ", data);
        socket.emit("hello", "Hello from server");
    });
    socket.on("user/connected", (data) => {
        io.emit("user/connected", data);
        console.log("-----USER CONNECTED----")
        console.log(data);
    })

    var planszaServ;
    socket.on("game/move", (data) => {
        console.log("move: ", data)
        planszaServ = data;
        io.emit("game/move", planszaServ)
    })
    socket.on("disconnect", () => {
        console.log("-> User disconnected. Game reset");
        users.deleteUsers();
        // Inform others that player dc
        io.emit("user/disconnect");
        planszaServ = null;
    })

})