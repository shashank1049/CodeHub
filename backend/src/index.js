import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const { default: connectDB } = await import("./db/index.js");
const { app } = await import("./app.js");

connectDB()
    .then(() => {
        app.listen(8000, () => {
            console.log(
                "Server is running on http://localhost:8000"
            );
        });
    })
    .catch((error) => {
        console.error(
            "Server failed to start:",
            error
        );
    });