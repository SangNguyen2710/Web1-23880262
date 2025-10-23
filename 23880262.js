/*
user name: web1
password: W3b1@Project
*/

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
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    let result = await response.json();
    if (response.status == 200) {
      console.log("Lay thanh cong token: " + result.token);
      return result.token;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}

async function login(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let pw = document.getElementById("password").value;

  try {
    let token = await getAuth(username, pw);
    if (token) {
      localStorage.setItem("token", token);
      document.getElementsByClassName("btn-close")[0].click();

      displayControls();
    } else {
      throw new Error();
    }
  } catch (error) {
    document.getElementById("errormessagelogin").innerHTML =
      "Username or password wrong";
    displayControls(false);
  }
}

function displayControls(isLogin = true) {
  let login = document.getElementsByClassName("linkLogin");
  let logout = document.getElementsByClassName("linkLogout");

  let displayLogin = "none";
  let displayLogout = "block";
  if (!isLogin) {
    displayLogin = "block";
    displayLogout = "none";
  }

  for (let i = 0; i < 2; i++) {
    login[i].style.display = displayLogin;
    logout[i].style.display = displayLogout;
  }
  let commentInput = document.getElementById("comment-input");
  if (commentInput) {
    commentInput.style.display = displayLogout;
  }
}

async function checkLogin() {
  let isLogin = await verifyToken();
  console.log(isLogin);
  displayControls(isLogin);
}
async function verifyToken() {
  let token = localStorage.getItem("token");
  if (token) {
    let response = await fetch(`${AUTH_API}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status == 200) {
      return true;
    }
  } else {
    return false;
  }
}
function logout() {
  localStorage.clear();
  displayControls(false);
}

async function sendComment(e) {
  e.preventDefault();
  try {
    let token = localStorage.getItem("token");
    if (token) {
      let postData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        comment: document.getElementById("message").value,
        blogId: document.getElementById("id").value,
        agree: document.getElementById("agree-terms").value == 1,
      };
      let response = await fetch(`${AUTH_API}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(postData),
      });
      let result = await response.json();
      if (response.status == 200) {
        document.getElementById("sendmessage-output").innerHTML =
          result.message;
        console.log(result.message);
      }
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    document.getElementById("sendmessage-output").innerHTML = result.message;
  }
}
