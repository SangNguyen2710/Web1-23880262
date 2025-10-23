const API = "https://web1-api.vercel.app/api";
const AUTH_API = "https://web1-api.vercel.app/users";

async function getData(request, template, destination) {
  const url = `${API}/${request}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    var source = document.getElementById(template).innerHTML;
    var template = Handlebars.compile(source);
    var data = { data: result };

    var target = document.getElementById(destination);
    target.innerHTML = template(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function getBlogsData(request, template, destination, page = 1) {
  const url = `${API}/${request}?page=${page}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    result.currentPage = page;
    result.request = request;
    console.log(result);
    var source = document.getElementById(template).innerHTML;
    var template = Handlebars.compile(source);
    var target = document.getElementById(destination);
    target.innerHTML = template(result);
  } catch (error) {
    console.error(error.message);
  }
}

function setActiveImage(imgTag, imagepath, isActive = true) {
  if (isActive) {
    imgTag.src = imagepath.replace(".png", "-active.png");
    setElementActive(imgTag.nextElementSibling);
  } else {
    imgTag.src = imagepath.replace("-active.png", ".png");
    setElementActive(imgTag.nextElementSibling, false);
  }
}
function setElementActive(elementtag, isActive = true) {
  if (isActive) elementtag.id = "active";
  else {
    elementtag.id = "";
  }
}

async function getAuth(username, password) {
  const url = `${AUTH_API}/authenticate`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    let result = response.json();
    if (result.status == 200) {
      console.log("Lay thanh cong token: " + result.token);
      return result.token;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}
