import "./components.js";
import { criarLivro, verificarTitulo } from "./api.js";

const formulario = document.querySelector("#form-livro");
const mensagem = document.querySelector("#mensagem");
formulario.addEventListener("submit", async evento => {
  evento.preventDefault();
  mensagem.textContent = "Salvando...";
  mensagem.className = "message";
  const dados = new FormData(formulario);
  const livro = {
    titulo: dados.get("titulo").trim(),
    autor: dados.get("autor").trim(),
    ano: dados.get("ano") ? Number(dados.get("ano")) : null,
    genero: dados.get("genero").trim() || null,
    descricao: dados.get("descricao").trim() || null
  };
  try {
    if (await verificarTitulo(livro.titulo)) throw new Error("Já existe um livro com esse título.");
    await criarLivro(livro);
    mensagem.textContent = "Livro cadastrado com sucesso!";
    mensagem.className = "message success";
    formulario.reset();
  } catch (erro) {
    mensagem.textContent = `Não foi possível cadastrar: ${erro.message}`;
    mensagem.className = "message error";
  }
});