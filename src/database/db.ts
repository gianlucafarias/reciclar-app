import mongoose from "mongoose";

export async function connect() {
    const MONGODB_PASSWORD = process.env.NEXT_PUBLIC_MONGODB_PASSWORD;

    if (!MONGODB_PASSWORD) {
      console.error("MONGODB_PASSWORD no está definida en las variables de entorno");
      process.exit(1); // Detiene el proceso si la variable de entorno no está definida
    }
    try {
        await mongoose.connect(`mongodb+srv://contenidos:${encodeURIComponent(MONGODB_PASSWORD)}@reciclar-app.o0uzeno.mongodb.net/?retryWrites=true&w=majority&appName=reciclar-app?tls=true` || "mongodb://localhost:27017", {
            dbName: "reciclar-app",     
        });
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
            process.exit();
        });
    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
    }
}
