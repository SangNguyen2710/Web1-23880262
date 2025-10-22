const API = "https://web1-api.vercel.app/api";

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
