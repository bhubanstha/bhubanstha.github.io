var savedTheme, mybutton;
$(document).ready(function () {
  mybutton = document.getElementById("myBtn");

  window.onscroll = function () {
    scrollFunction();
  };

  // Load saved theme
  savedTheme = localStorage.getItem("bsTheme") || "dark";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  setThemeIcon(savedTheme);

  if (typeof setCodeHighlightTheme === "function") {
    setCodeHighlightTheme(savedTheme);
  }

  $(".btn-theme-selector").on("click", function (e) {
    const newTheme = $(this).attr("data-bs-theme-value") || "light";
    if (newTheme === "auto") {
      setAutoTheme(document);
      return;
    }
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    setGiscusTheme(newTheme);
    if (typeof setCodeHighlightTheme === "function") {
      setCodeHighlightTheme(newTheme);
    }

    localStorage.setItem("bsTheme", newTheme);
    setThemeIcon(newTheme);
  });

  $(".collapsible-list .has-children").on("click", function (e) {
    if (e.target === this) {
      this.classList.toggle("open");
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", setAutoTheme);
});

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

function setGiscusTheme(theme) {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) return;

  iframe.contentWindow.postMessage(
    {
      giscus: {
        setConfig: {
          theme: theme,
        },
      },
    },
    "https://giscus.app"
  );
}

window.addEventListener("message", (event) => {
  if (event.origin !== "https://giscus.app") return;
  setGiscusTheme(savedTheme);
  // if (event.data?.giscus?.discussion) {
  //   console.log("✅ Giscus is ready and discussion has loaded!");
  //   // You can now safely send theme updates or do other things
  // }
});

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
