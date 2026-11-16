import "./components.js";
import { listarLivros, excluirLivro } from "./api.js";

const corpo = document.querySelector("#lista-livros");
const mensagem = document.querySelector("#mensagem");
async function carregar() {
  try {
    const livros = await listarLivros();
    if (!livros.length) {
      corpo.innerHTML = '<tr><td colspan="4" class="empty">Não há livros cadastrados.</td></tr>';
      return;
    }
    corpo.innerHTML = livros.map(livro => `
      <tr><td>${livro.titulo}</td><td>${livro.autor}</td>
      <td>${livro.ano ?? "—"}</td><td><button class="button-danger" data-id="${livro.id}">Excluir</button></td></tr>
    `).join("");
    corpo.querySelectorAll("button[data-id]").forEach(botao => {
      botao.addEventListener("click", () => remover(botao.dataset.id, botao));
    });
    const idDaUrl = location.hash.slice(1);
    if (idDaUrl) {
      const botao = corpo.querySelector(`button[data-id="${CSS.escape(idDaUrl)}"]`);
      if (botao) botao.focus();
    }
  } catch (erro) {
    mensagem.textContent = `Erro ao consultar registros: ${erro.message}`;
    mensagem.className = "message error";
  }
}
async function remover(id, botao) {
  if (!confirm("Tem certeza de que deseja excluir este livro?")) return;
  botao.disabled = true;
  try {
    await excluirLivro(id);
    mensagem.textContent = "Livro excluído com sucesso.";
    mensagem.className = "message success";
    await carregar();
  } catch (erro) {
    mensagem.textContent = `Não foi possível excluir: ${erro.message}`;
    mensagem.className = "message error";
    botao.disabled = false;
  }
}
carregar();
