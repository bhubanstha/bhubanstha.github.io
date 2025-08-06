var width, height, minWidth, minHeight, ypos;
var canvasCtx;
$(document).ready(function () {
  // Load saved theme
  const savedTheme = localStorage.getItem("bsTheme") || "dark";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  setThemeIcon(savedTheme);

  $(".btn-theme-selector").on("click", function (e) {
    const newTheme = $(this).attr("data-bs-theme-value") || "light";
    if (newTheme === "auto") {
      setAutoTheme(document);
      return;
    }
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("bsTheme", newTheme);
    setThemeIcon(newTheme);
  });

  const canvas = document.getElementById("canv");
  if (canvas != null) {
    const canasContainer = document.getElementById("home");
    canvasCtx = canvas.getContext("2d");

    width = canvas.width = canasContainer.offsetWidth; //document.body.offsetWidth;
    height = canvas.height = canasContainer.offsetHeight; // document.body.offsetHeight;
    const cols = Math.floor(width / 20) + 1;
    ypos = Array(cols).fill(0);

    const styles = getComputedStyle(document.documentElement);
    const matrixColor = styles.getPropertyValue("--bs-tertiary-bg-rgb").trim();
    canvasCtx.fillStyle = `rgba(${matrixColor}, 0.15)`; //"#000";
    //ctx.fillRect(0, 0, w, h);
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    setInterval(matrix, 50);

    window.addEventListener("resize", reportWindowSize);
  }
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", setAutoTheme);

  (async function () {
    const kb = await loadKnowledgeBase();
    var typed;
    $("#aboutMeQuestion").on("keydown", function (event) {
      if (event.key === "Enter") {
        $("#response").empty();
        const typewriter = new Typewriter("#response", {
          loop: false,
          delay: 50,
          deleteSpeed: 50,
          cursor: "",
        });
        const userInput = $(this).val().trim();
        if (userInput !== "") {
          const reply = matchInputToAnswer(userInput, kb);
          reply.forEach((command) => {
            eval("typewriter" + command);
          });
          eval("typewriter.start()");
          // typed = new Typed("#response", {
          //   strings: [reply],
          //   typeSpeed: 50,
          //   smartBackspace: false,
          //   showCursor: false,
          //   contentType: "html", // Use HTML content
          // });

          //$("#response").html(reply);
          $(this).val("").focus(); // Clear input after response
        }
      }
    });
  })();
});

function reportWindowSize() {
  const element = document.getElementById("home");
  const cardElement = document.getElementById("home-content");
  width = element.offsetWidth; // document.body.offsetWidth;
  height = element.offsetHeight; //document.getElementById('home').offsetHeight;
  minWidth = cardElement.offsetWidth;
  minHeight = cardElement.offsetHeight;
  width = Math.max(width, minWidth);
  height = Math.max(height, minHeight);
  $("#canv").attr({ width: width, height: height });
}

function matrix() {
  const styles = getComputedStyle(document.documentElement);
  const matrixColor = styles.getPropertyValue("--bs-tertiary-bg-rgb").trim();
  canvasCtx.fillStyle = `rgba(${matrixColor}, 0.15)`; //"#000";
  //canvasCtx.fillStyle = "#0000001a"; //"#0000001a";

  canvasCtx.fillRect(0, 0, width, height);

  canvasCtx.fillStyle = "#de072b"; //"#00ff00";
  canvasCtx.font = "15pt monospace";
  var matrixText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  matrixText += "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञ";
  matrixText += "अआइईउऊऋएऐओऔअं"; // Nepali digits
  matrixText += "०१२३४५६७८९";
  matrixText += "あいうえおかきくけこしすせそたちつてとなにぬねのはひふへほ";

  ypos.forEach((y, ind) => {
    //var text = String.fromCharCode(Math.random() * 128);
    const randomIndex = Math.floor(Math.random() * matrixText.length);
    const text = matrixText[randomIndex];
    const x = ind * 30 + 10;
    canvasCtx.fillText(text, x, y);
    if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
    else ypos[ind] = y + 30;
  });
}

function setAutoTheme(document) {
  const preferredDark = isDarkModePreferred();
  const theme = preferredDark ? "dark" : "light";
  // Set the theme on <html> (Bootstrap 5.3+ uses this)
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("bsTheme", theme);
  setThemeIcon(theme);
}

function isDarkModePreferred() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function setThemeIcon(theme) {
  if (theme === "dark") {
    $("#activeTheme").removeClass("fa-moon").addClass("fa-sun");
  } else {
    $("#activeTheme").removeClass("fa-sun").addClass("fa-moon");
  }
}

async function loadKnowledgeBase() {
  const response = await fetch("/assets/data/data.json");
  return await response.json();
}

function matchInputToAnswer(input, knowledgeBase) {
  const inputWords = input.replace("?", "").toLowerCase().split(/\s+/);
  let bestMatch = null;
  let maxMatches = 1;

  for (const item of knowledgeBase) {
    const keywords = item.question.replace("?", "").split(" ") || [];
    const matches = keywords.filter((keyword) =>
      inputWords.includes(keyword.toLowerCase())
    ).length;
    if (matches > maxMatches) {
      bestMatch = item;
      maxMatches = matches;
    }
  }
  return bestMatch
    ? bestMatch.answer
    : [".typeString('I am not sure how to respond to that.')"];
}
