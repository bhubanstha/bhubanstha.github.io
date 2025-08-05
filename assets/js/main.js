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
