document.addEventListener("DOMContentLoaded", async () => {
  const params = window.location.search.replace("?", "").split("&");

  let x = false;
  let art = "";
  for (const p of params)
    if (p.split("=")[0] === "article") {
      x = true;
      art = p.split("=")[1];
    }

  if (x && art && art !== "") {
    {
      const articles = document.getElementById("articles");

      const li = document.createElement("li");
      li.id = "home";
      li.classList.add("article-li");

      const a = document.createElement("a");
      a.classList.add("article-a");
      a.href = `/`;
      a.textContent = "home";
      li.appendChild(a);
      articles.appendChild(li);
    }
    {
      const main = document.querySelector("main");
      const req = await fetch(art);
      if (req.status !== 200)
        throw new Error(
          `Error fetching article ${art}! ${req.status} ${req.statusText}`
        );

      const text = await req.text();
      if (text)
        main.innerHTML = `<article id="article">${marked.parse(
          text
        )}</article>`;
      const end = document.getElementById("article");
      end.lastElementChild.classList.add("no-margin");
      if (end.lastElementChild.lastElementChild)
        end.lastElementChild.lastElementChild.classList.add("no-margin");
    }
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const params = window.location.search.replace("?", "").split("&");

  let x = false;
  let that = "";
  for (const p of params)
    if (p.split("=")[0] === "article") {
      x = true;
      that = p.split("=")[1];
    }

  const req = await fetch("/articles");
  if (req.status !== 200)
    throw new Error(`Error fetching articles! ${req.status} ${req.statusText}`);

  const data = await req.json();
  const articles = document.getElementById("articles");

  for (const art of data) {
    const article = art.replace("/wiki/", "");

    const li = document.createElement("li");
    li.id = art;
    li.classList.add("article-li");

    const a = document.createElement("a");
    a.classList.add("article-a");
    a.href = `/?article=${art}`;
    a.textContent = article;
    li.appendChild(a);
    articles.appendChild(li);
  }

  if (x && that && that !== "") {
    const article = document.getElementById(that);
    if (article) document.getElementById("articles").removeChild(article);

    const currentlyViewing = document.getElementById("currently-viewing");
    currentlyViewing.textContent = `Currently Viewing: ${that.replace(
      "/wiki/",
      ""
    )}`;
    currentlyViewing.hidden = false;
    return;
  }
});

