let parallax = (el, speed = 2) => {
    el = document.querySelectorAll(el);
    speed = speed < 2 ? 2 : speed;
    let tops = [].map.call(el, elem => elem.offsetTop);
    window.addEventListener("scroll", () => {
        let position = window.pageYOffset,
            blockPos = tops.map(top => position - top);
        el.forEach((elem, i) => {
            elem.style.position = "relative";
            elem.style.zIndex = 1;
            elem.style.top = blockPos[i]/speed + "px";
        });
    });
};