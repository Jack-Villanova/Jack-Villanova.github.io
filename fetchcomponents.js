fetch("/components/topnav.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("top-nav").innerHTML = data;
});

fetch("/components/sidenav.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("side-nav").innerHTML = data;
});

fetch("/components/socials.html")
  .then(r => r.text())
  .then(data => {

      const container = document.getElementById("socials");

      container.innerHTML = data;

      container.querySelectorAll("script").forEach(oldScript => {

          const newScript = document.createElement("script");

          newScript.textContent = oldScript.textContent;

          document.body.appendChild(newScript);

          oldScript.remove();
      });
  });

// fetch("/components/socials.html")
//   .then(response => response.text())
//   .then(data => {
//     document.getElementById("socials").innerHTML = data;
// });