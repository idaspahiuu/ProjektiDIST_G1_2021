module.exports = function (io) {
    var activeSockets = []
    const activeUsers = new Set();

    io.on('connection', function (socket) {
        console.log("client is connected " + socket.id)

        const existingSocket = activeSockets.find(
            existingSocket => existingSocket === socket.id
        )

        if (!existingSocket) {
            activeSockets.push(socket.id);

            socket.emit("update-user-list", {
                users: activeSockets.filter(
                    existingSocket => existingSocket !== socket.id
                )
            });

            socket.broadcast.emit("update-user-list", {
                users: [socket.id]
            });
        }

        socket.on("call-user", (data) => {
            socket.to(data.to).emit("call-made", {
                offer: data.offer,
                socket: socket.id
            });
        });

        socket.on("make-answer", data => {
            socket.to(data.to).emit("answer-made", {
                socket: socket.id,
                answer: data.answer
            });
        });

        socket.on("reject-call", data => {
            socket.to(data.from).emit("call-rejected", {
                socket: socket.id
            });
        });

        socket.on("disconnect", () => {
            activeSockets = activeSockets.filter(
                existingSocket => existingSocket !== socket.id
            );
            activeUsers.delete(socket.userId);
            io.emit("user disconnected", socket.userId);
            socket.broadcast.emit("remove-user", {
                socketId: socket.id
            });
        });

        socket.on("new user", function (data) {
            socket.userId = data;
            activeUsers.add(data);
            io.emit("new user", [...activeUsers]);
        });

        socket.on("chat message", function (data) {
            io.emit("chat message", data);
        });
    })
};