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

app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  if (!req.session.user) return res.redirect("/login.html");
  next();
}

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  const ok = usuarios.find(u => u.usuario === usuario && u.senha === senha);
  if (ok) {
    req.session.user = usuario;
    res.redirect("/etiquetas.html");
  } else {
    res.send("Login inválido");
  }
});

app.get("/etiquetas.html", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "public/etiquetas.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login.html"));
});

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
