(() => {
  const overlays = [
    {
      element: document.querySelector("#modal"),
      open: document.querySelector("[data-modal-open]"),
      close: document.querySelector("[data-modal-close]"),
    },
    {
      element: document.querySelector("#mobile-menu"),
      open: document.querySelector("[data-menu-open]"),
      close: document.querySelector("[data-menu-close]"),
      mobile: true,
    },
  ];
  const background = [
    ...document.querySelectorAll("body > header, body > main, body > footer"),
  ];
  const focusable = 'a[href], button, input, textarea, [tabindex="0"]';
  function setOpen(item, open, restoreFocus = true) {
    item.element.classList.toggle("is-open", open);
    item.open.setAttribute("aria-expanded", String(open));
    const anyOpen = overlays.some((other) =>
      other.element.classList.contains("is-open"),
    );
    document.body.classList.toggle("overlay-open", anyOpen);
    background.forEach((element) => {
      element.inert = anyOpen;
    });
    if (open)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (item.element.classList.contains("is-open")) item.close.focus();
        }),
      );
    else if (restoreFocus) item.open.focus();
  }
  overlays.forEach((item) => {
    item.open.addEventListener("click", () => setOpen(item, true));
    item.close.addEventListener("click", () => setOpen(item, false));
    item.element.addEventListener("click", (event) => {
      if (event.target === item.element && !item.mobile) setOpen(item, false);
      if (item.mobile && event.target.closest('a[href^="#"]'))
        setOpen(item, false);
    });
    item.element.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(item, false);
      }
      if (event.key !== "Tab") return;
      const controls = [...item.element.querySelectorAll(focusable)].filter(
        (control) => !control.disabled,
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });
  window
    .matchMedia("(min-width: 768px)")
    .addEventListener("change", (event) => {
      const menu = overlays.find((item) => item.mobile);
      if (event.matches && menu.element.classList.contains("is-open"))
        setOpen(menu, false, false);
    });
})();
