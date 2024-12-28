import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    console.log('Connecting to MongoDB...')
    if (connection.isConnected) {
        console.log('Already connected')
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log('Connected to MongoDB Successfully')
    }
    catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default dbConnect;  
