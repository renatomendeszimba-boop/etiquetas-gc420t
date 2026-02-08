const express = require("express");
const session = require("express-session");
const path = require("path");
const usuarios = require("./usuarios.json");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "gc420t-secret",
  resave: false,
  saveUninitialized: false
}));

// ROTAS DE PÁGINA
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/etiquetas.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "public", "etiquetas.html"));
});

// LOGIN
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const ok = usuarios.find(
    u => u.usuario === usuario && u.senha === senha
  );

  if (ok) {
    req.session.user = usuario;
    res.redirect("/etiquetas.html");
  } else {
    res.send("Login inválido");
  }
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});