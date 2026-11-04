const repositoryList = document.querySelector("#repository-list");

function renderRepositories(events) {
  const starredEvents = events.filter((event) => event.type === "starred");
  repositoryList.replaceChildren();

  if (starredEvents.length === 0) {
    repositoryList.textContent = "No starred repositories yet.";
    return;
  }

  for (const event of starredEvents) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const date = document.createElement("time");

    link.href = event.repository.url;
    link.textContent = event.repository.name;
    description.textContent = event.repository.description;
    date.className = "starred-date";
    date.dateTime = event.created_at;
    date.textContent = `Starred on ${new Date(event.created_at).toLocaleDateString()}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }
}

fetch("./events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load starred repositories (${response.status}).`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch((error) => {
    console.error(error);
    repositoryList.textContent = "Unable to load starred repositories. Please try again later.";
  });
