const express = require("express");
const session = require("express-session");
const path = require("path");
const usuarios = require("./usuarios.json");

const app = express();

/* ====== CONFIGURAÇÕES ====== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "gc420t-secret",
  resave: false,
  saveUninitialized: false
}));

/* ====== SERVIR ARQUIVOS ESTÁTICOS ====== */
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

/* ====== ROTAS ====== */

// Página inicial → login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Login page
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Página de etiquetas (protegida)
app.get("/etiquetas.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "etiquetas.html"));
});

// Login POST
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const valido = usuarios.find(
    u => u.usuario === usuario && u.senha === senha
  );

  if (valido) {
    req.session.user = usuario;
    res.redirect("/etiquetas.html");
  } else {
    res.send(`
      <script>
        alert("Usuário ou senha inválidos");
        window.location.href = "/login.html";
      </script>
    `);
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

/* ====== START SERVER (OBRIGATÓRIO PRO RENDER) ====== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});