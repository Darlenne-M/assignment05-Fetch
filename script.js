

async function submitUser() {

    let params = new FormData(document.getElementById("input-form"));
    let jsonBody = JSON.stringify(Object.fromEntries(params));
    let user = JSON.parse(jsonBody);
    let container = document.querySelector(".container");
    container.innerHTML = "";

    const url = "https://api.github.com/users/" + user.userName + "/repos?sort=created&per_page=10";

    try {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(await res.text());
        }

        res = await res.json();

        if (res.length === 0) {
            const message = document.createElement("p");
            message.textContent = 'User "${user.userName}" has no repository';
            container.appendChild(message);
            return;
        }
        for (const item of res) {
            addParagraph(container, item, user.userName);
        }

    } catch (err) {
        console.log(err);
        const message = document.createElement("p");
        message.textContent = 'This account does not exist. Enter a valid userName.';
        container.appendChild(message);
        return;

    }


}

async function addParagraph(container, productObj, userName) {
    let article = document.createElement("article");
    const userUrl = "https://github.com/" + userName + "/";

    let heading = document.createElement("h3");
    heading.innerHTML = "<a href='" + userUrl + productObj.name + "' >" + "<i class='fa-brands fa-github'></i>" + productObj.name + "</a>";

    let para = document.createElement("p");
    let desciption = document.createTextNode(productObj.description || "No desciption");
    let date = document.createTextNode("Created: " + new Date(productObj.created_at).toLocaleDateString());
    let updated = document.createTextNode("Updated: " + new Date(productObj.updated_at).toLocaleDateString());
    let watchers = document.createTextNode("Watchers: " + productObj.watchers_count);
    let language = document.createTextNode("Languages: " + productObj.language);

    // Get number of commits
    let commitsUrl = productObj.commits_url.replace("{/sha}", "");
    let commitRes = await fetch(commitsUrl);
    commitRes = await commitRes.json();
    let count = commitRes.length;
    let commits = document.createTextNode("Commits: " + count);

    // append elements
    article.appendChild(heading);
    para.appendChild(desciption);
    para.appendChild(document.createElement("br"));
    para.appendChild(date);
    para.appendChild(document.createElement("br"));
    para.appendChild(updated);
    para.appendChild(document.createElement("br"));
    para.appendChild(watchers);
    para.appendChild(document.createElement("br"));
    para.appendChild(language);
    para.appendChild(document.createElement("br"));
    para.appendChild(commits);
    article.appendChild(para);

    container.appendChild(article);


}

document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();
    submitUser();
});


