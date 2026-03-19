

async function submitUser() {
    
    let params = new FormData(document.getElementById("input-form"));
    let jsonBody = JSON.stringify(Object.fromEntries(params)); 
    let user = JSON.parse(jsonBody);
    console.log(jsonBody);
    console.log(user);
    console.log(user.userName);
    const url = "https://api.github.com/users/" + user.userName + "/repos?sort=created&per_page=10";
    const userUrl = "https://github.com/" + user.userName + "/";

    try {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(await res.text());
        }

        res = await res.json();
        let containers = document.getElementsByClassName("repo-container");
        console.log(containers);

        for (let i = 0; containers.length && i < res.length; i++) {
            let repo = res[i];
            let box = containers[i];
            box.querySelector(".title").innerHTML = "<a href='" + userUrl + repo.name + "' >" + "<i class='fa-brands fa-github'></i>" + repo.name + "</a>";
            box.querySelector(".description").textContent = repo.description || "No description";
            box.querySelector(".create-at").textContent = "Created: " + new Date(repo.created_at).toLocaleDateString();
            box.querySelector(".updated").textContent = "Updated: " + new Date(repo.updated_at).toLocaleDateString();
            box.querySelector(".watchers").textContent = "Watchers: " + repo.watchers_count;
            box.querySelector(".languages").textContent = "Languages: " + repo.language || "none";

            let commitsUrl = repo.commits_url.replace("{/sha}", "");
            let commitRes = await fetch(commitsUrl);
            commitRes = await commitRes.json();
            console.log(commitRes);
            let count = commitRes.length;
            console.log(count);
            box.querySelector(".commits").textContent = "Commits: " + count;

        }

    } catch (err) {
        alert("This account does not exists. Enter a valid userName.")
        console.error("This account does not exists. Enter a valid userName");
    }


}

document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();
    submitUser();
});


