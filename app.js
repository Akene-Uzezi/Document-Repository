// dependencies
const express = require("express");
const session = require("express-session");
const path = require("path");
//middlewares
const notFoundMiddleware = require("./middlewares/not-found");
const serverErrorMiddleware = require("./middlewares/server-error");
//session configuration
const sessionConfig = require("./config/session.config");
//routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
//database connection
const db = require("./database/documentRepository.db");
const app = express();

// server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));
// for rendering static files like css, js, images
app.use(express.static("public"));
//dependency for session management
app.use(session(sessionConfig));

// routes
app.use(authRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use(notFoundMiddleware);
// internal server error handler
app.use(serverErrorMiddleware);

db.connect()
  .then(() => {
    app.listen(3000, () => {
      console.log("connected to database and started the server");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });
