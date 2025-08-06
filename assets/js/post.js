var mybutton;

$(document).ready(function () {
  mybutton = document.getElementById("myBtn");

  window.onscroll = function () {
    scrollFunction();
  };
});

function setCodeHighlightTheme(mode) {
  const themeLink = document.getElementById("hljs-theme");
  if (!themeLink) return;

  const themes = {
    light:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/foundation.min.css",
    dark: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark-dimmed.min.css",
  };
  // console.log("theme: " + mode);
  themeLink.href = themes[mode] || themes.dark;
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
