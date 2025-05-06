// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const testimonialsRoutes = require("./routes/testimonialsRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const reservationsRoutes = require("./routes/reservationsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utilisation des routes
app.use("/api", testimonialsRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", reservationsRoutes);
app.use("/api", adminRoutes);

app.get("/test", (req, res) => {
    res.send("Test route works!");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
