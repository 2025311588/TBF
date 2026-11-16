import "./components.js";
import { listarLivros, pesquisarLivros } from "./api.js";

const corpo = document.querySelector("#lista-livros");
const mensagem = document.querySelector("#mensagem");

function mostrarMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.className = `message ${tipo}`;
}
function desenharTabela(livros) {
  if (!livros.length) {
    corpo.innerHTML = '<tr><td colspan="5" class="empty">Nenhum livro encontrado.</td></tr>';
    return;
  }
  corpo.innerHTML = livros.map(livro => `
    <tr>
      <td>${livro.titulo}</td><td>${livro.autor}</td>
      <td>${livro.ano ?? "—"}</td><td>${livro.genero || "—"}</td>
      <td><div class="table-actions">
        <a class="button button-secondary" href="editar.html?id=${livro.id}">Editar</a>
        <a class="button button-danger" href="excluir.html#${livro.id}">Excluir</a>
      </div></td>
    </tr>`).join("");
}
async function carregar() {
  try { desenharTabela(await listarLivros()); mostrarMensagem(""); }
  catch (erro) { mostrarMensagem(`Não foi possível carregar os livros: ${erro.message}`, "error"); }
}
document.querySelector("#form-busca").addEventListener("submit", async evento => {
  evento.preventDefault();
  const termo = document.querySelector("#busca").value.trim();
  try {
    const livros = termo ? await pesquisarLivros(termo) : await listarLivros();
    desenharTabela(livros);
    mostrarMensagem(`${livros.length} registro(s) encontrado(s).`);
  } catch (erro) { mostrarMensagem(`Erro na pesquisa: ${erro.message}`, "error"); }
});
document.querySelector("#limpar-busca").addEventListener("click", () => {
  document.querySelector("#busca").value = "";
  carregar();
});
carregar();
