// Store connected users
const connectedUsers = new Set();

export function broadcastToAllUsers(data) {
  console.log(
    `📢 Broadcasting to ${connectedUsers.size} connected users:`,
    data,
  );

  connectedUsers.forEach((res) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error("Error sending to user:", error);
      connectedUsers.delete(res);
    }
  });
}

export function addUser(res) {
  connectedUsers.add(res);
  console.log(`✓ User connected. Total users: ${connectedUsers.size}`);
}

export function removeUser(res) {
  connectedUsers.delete(res);
  console.log(`✗ User disconnected. Total users: ${connectedUsers.size}`);
}

export function getUserCount() {
  return connectedUsers.size;
}
