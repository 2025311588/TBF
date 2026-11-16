class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header"><div class="header-inner">
        <a class="brand" href="index.html">Biblioteca<span>+</span></a>
      </div></header>`;
  }
}
class SiteNav extends HTMLElement {
  connectedCallback() {
    const pagina = location.pathname.split("/").pop() || "index.html";
    const links = [
      ["index.html", "Consultar"],
      ["cadastrar.html", "Cadastrar"],
      ["editar.html", "Editar"],
      ["excluir.html", "Excluir"]
    ];
    this.innerHTML = `<nav class="nav"><div class="nav-inner">${
      links.map(([url, nome]) => `<a href="${url}" ${pagina === url ? 'aria-current="page"' : ""}>${nome}</a>`).join("")
    }</div></nav>`;
  }
}
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="footer"><p>Biblioteca+ · Trabalho Final de JavaScript — API e Custom Elements</p></footer>`;
  }
}
customElements.define("site-header", SiteHeader);
customElements.define("site-nav", SiteNav);
customElements.define("site-footer", SiteFooter);
