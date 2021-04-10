const postsContainer = document.getElementById("posts-container");
const loading = document.querySelector(".loader");
const filter = document.getElementById("filter");
let renderInfinite = true;
let page = 1;

// Fetch posts from API
async function getPosts() {
  // const res = await fetch(
  //   `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  // );

  const res = await fetch(
    `https://hn.algolia.com/api/v1/search?page=${page}&tags=story`
  );

  const data = await res.json();

  return data;
}

// Show posts in DOM
async function showPosts() {
  if (!renderInfinite) return;
  console.log("showPosts - ", renderInfinite);
  const posts = await getPosts();
  const { hits } = posts;
  console.log(posts);
  let count = 0;
  hits.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `
    <a target="_blank" href=${post.url}>
      <div class="number">${post.points}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.author}</p>
      </div>
    `;
    count++;
    postsContainer.appendChild(postEl);
  });
}

// Show loader & fetch more posts
function showLoading() {
  if (!renderInfinite) return;
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts(e) {
  console.log(renderInfinite);
  const term = e.target.value.toUpperCase();
  if (e.target.value === "") renderInfinite = true;
  else renderInfinite = false;
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const title = post.querySelector(".post-title").innerText.toUpperCase();
    const body = post.querySelector(".post-body").innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
}

// Show initial posts
showPosts();

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

filter.addEventListener("input", filterPosts);
filter.addEventListener("blur", () => {
  renderInfinite = true;
  console.log("renderInfinite", renderInfinite);
});
