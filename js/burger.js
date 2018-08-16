let Burger = function(){
    let modal = false,
    modalCreated = false,
    created = false,
    selfClass,
    func,
    hide = function(){
        this.self.style.display = "none";
        [].slice.call(this.self.children).forEach((elem, i) => elem.classList.remove("cross" + (i+1)));
        this.menu.classList.remove(selfClass);
    };
    this.create = function(pos){
        pos = document.querySelector(pos);
        if(!created){
            pos.innerHTML = "<div id='burger'>" +
                                "<span class='line'></span>" +
                                "<span class='line'></span>" +
                                "<span class='line'></span>" +
                            "</div>" + pos.innerHTML;
            this.modalEl = document.createElement("div");
            this.modalEl.classList.add("burger-modal");
            document.body.appendChild(this.modalEl);
        }else if(created && this.self.style.display === "none") this.self.style.display = "flex";
        this.self = document.getElementById("burger");
        created = "true";
        return this;
    };
    this.line = function(each){
        let lines = document.querySelectorAll(".line");
        return {
            css: function(obj){
                if(each === "all" || each === "*"){
                    lines.forEach(el => {
                        for(let key in obj){
                            el.style[key] = obj[key];
                        }
                    });
                }else{
                    for(let key in obj){
                        lines[each-1].style[key] = obj[key];
                    }
                }
                return burger;
            }
        }
    };
    this.show = function(el, className, fn){
        selfClass = className;
        el = document.querySelector(el);
        this.menu = el;
        let cross = function(){
            [].slice.call(burger.self.children).forEach((elem, i) => {
                elem.classList.toggle("cross" + (i+1));
            });
        }
        this.self.onclick = function(){
            if(!modal){
                cross();
                el.classList.toggle(className);
            }else{
                if(modalCreated){
                    cross();
                    burger.modalEl.classList.add(className);
                }else{
                    cross();
                    burger.modalEl.innerHTML = "<ul id='burger-ul'>" + "<button id='burger-close'>&times</button>" + burger.menu.innerHTML + "</ul>";
                    burger.closeBtn = document.getElementById("burger-close");
                    burger.closeBtn.onclick = function(){
                        burger.modalEl.classList.remove(className);
                        cross();
                    }
                    burger.modalEl.classList.add(className);
                    modalCreated = true;
                }
            }
            if(fn) fn(el);
        }
        return this;
    };
    this.css = function(obj){
        for(let key in obj){
            this.self.style[key] = obj[key];
        }
        return this;
    };
    this.hide = function(width, fn){
        if(created && !width) hide.call(this);
        else if(created && width){
            window.addEventListener("load", function(){
                if(window.innerWidth >= width) hide.call(this);
                else burger.create();
            }.bind(this));
            window.addEventListener("resize", function(){
                if(window.innerWidth >= width) hide.call(this);
                else {
                    if(fn) fn();
                    burger.create();
                }
            }.bind(this));
        }
        return this;
    };
    this.modalHide = function(width, fn){
        if(modal && !width) this.modalEl.classList.remove(selfClass);
        else if(modal && width){
            window.addEventListener("load", function(){
                if(window.innerWidth >= width) this.modalEl.classList.remove(selfClass);
                else if(fn) fn();
            }.bind(this));
            window.addEventListener("resize", function(){
                if(window.innerWidth >= width) this.modalEl.classList.remove(selfClass);
                else if(fn) fn();
            }.bind(this));
        }
        if(fn) fn();
        return this;
    };
    this.isModalCreated = function(){
        if(modal) return true;
        return false;
    };
    this.isBurgerCreated = function(){
        if(created) return true;
        return false;
    };
    this.createModal = function(){
        modal = true;
        return this;
    };
};

// create - добавить в html выбранного элемента
//show - какой элемент показывать при клике, какую функцию выполнить при клике (можно не указывать)
//line, css - выбрать линию, all или * - выбрать все линии, прменить стили к бургеру/линии(ям)