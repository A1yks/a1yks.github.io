let burger = new Burger();
window.onload = function(){
    use(".h-btn").do("click", e => {
        e.preventDefault();
        use("#plans").scroll("top", "smooth")
    })
    let height = this.innerHeight;
    use("header").anim(400, {"transform": "translateX(0)", "opacity": 1});
    setTimeout(() => {
        use(".anim1").anim(150, {"opacity": 1, "top": 0});
        use(".logo a").anim(250, {"opacity": 1, "left": 0});
        use(".logo img").anim(250, {"transform": "rotate(360deg)", "opacity": 1});
    }, 1000)
    burger.create(".burger").show(".nav-ul", "show").createModal().hide(1200).modalHide(1200).line("*").css({"width": "30px"});
    window.onscroll = function(){
        use(".anim2").anim(200, {"opacity": 1, "top": 0});
        if(this.scrollY >= height + document.querySelector(".plans").offsetHeight - 700){
            use(".anim3").anim(200, {"transform": "scale(1)"});
            use(".anim4").anim(200, {"opacity": 1, "top": 0});
        }
    }
    parallax("header");
};