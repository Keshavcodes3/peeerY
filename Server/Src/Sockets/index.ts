import { Server } from "socket.io";
import onlineUsers from "./onlineUsers.js";
import { handlePresence } from "./Handlers/presence.handler.js";
import MessageModel from "../Modules/Messages/Models/Message.model.js";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                callback(null, true);
            },
            credentials: true,
        },
    });

    // Authentication middleware for Socket.io — verifies Clerk JWT
    io.use(async (socket, next) => {
        try {
            let token = socket.handshake.auth?.token;

            // Fallback to headers or query params
            if (!token && socket.handshake.headers?.authorization) {
                const authHeader = socket.handshake.headers.authorization;
                token = authHeader.startsWith("Bearer ")
                    ? authHeader.split(" ")[1]
                    : authHeader.trim();
            }

            if (!token && socket.handshake.query?.token) {
                token = socket.handshake.query.token as string;
            }

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            // Verify using Clerk — resolves the Clerk userId (clerkId)
            const { verifyToken } = await import("@clerk/express");
            const payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY!,
            });

            if (!payload?.sub) {
                return next(new Error("Authentication error: Invalid Clerk token"));
            }

            // Look up local user by clerkId so we have our own userId for messages
            const { default: authModel } = await import("../Modules/Auth/Models/auth.model.js");
            const dbUser = await authModel.findOne({ clerkId: payload.sub }).lean();

            if (!dbUser) {
                return next(new Error("Authentication error: User not found in database"));
            }

            (socket as any).user = {
                userId: dbUser._id.toString(),
                clerkId: payload.sub,
                email: dbUser.email,
            };
            next();
        } catch (error) {
            console.error("[Socket Auth]", error);
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = (socket as any).user?.userId;
        if (userId) {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
            
            // Register presence handlers
            handlePresence(socket, io);
        }

        // ─── Direct chat message relay ───────────────────────────
        // Client emits: { matchId: string, text: string }
        // Server relays to all sockets in that match room.
        socket.on("direct:message", async (data: { matchId: string; text: string; id?: string }) => {
            if (!userId || !data?.matchId || !data?.text) return;
            try {
                // Save to MongoDB first
                const savedMessage = await MessageModel.create({
                    matchId: data.matchId,
                    sender: userId,
                    text: data.text
                });

                const payload = {
                    matchId: data.matchId,
                    from: userId,
                    text: data.text,
                    ts: new Date(savedMessage.createdAt).getTime(),
                    id: data.id || savedMessage._id.toString()
                };

                // Broadcast to everyone in the room (including sender for consistency)
                io.to(data.matchId).emit("direct:message", payload);
            } catch (err) {
                console.error("Failed to save and relay direct message:", err);
            }
        });

        // Join a match room so messages are scoped per match
        socket.on("join:match", (matchId: string) => {
            if (!matchId) return;
            socket.join(matchId);
        });

        socket.on("disconnect", () => {
            if (userId) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
};

export const getIO = () => io;
export { onlineUsers };
