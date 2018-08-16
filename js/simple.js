"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var use = function use(list) {
    if (list instanceof HTMLElement) list = [list];else if (list instanceof NodeList || list instanceof HTMLCollection) list = list;else if (list === document) list = [document];else if (list === window) list = [window];else list = document.querySelectorAll(list);
    if (!window.lastElStyles) window.lastElStyles = {};
    var setProp = function setProp(prop) {
        return this.list.length > 1 ? [].map.call(this.list, function (el) {
            return el[prop];
        }) : this.el[prop];
    };
    list = Array.from(list);
    // this !== obj, this === list
    var obj = {
        list: [].concat(_toConsumableArray(list)),
        el: list[0],
        saveCss: function saveCss() {
            this.list.forEach(function (elem, i) {
                var styles = getComputedStyle(elem);
                var stylesCopy = Object.assign({}, styles);
                lastElStyles[i] = {};
                for (var key in stylesCopy) {
                    lastElStyles[i][key] = styles.getPropertyValue(key);
                }
            });
            return this;
        },
        resetCss: function resetCss() {
            this.list.forEach(function (elem, i) {
                for (var key in lastElStyles[i]) {
                    elem.style[key] = lastElStyles[i][key];
                }
                if (elem.getAttribute("data-draggable") === "true") elem.style.position = "absolute";
            });
            return this;
        },
        css: function css(obj) {
            this.list.forEach(function (elem) {
                for (var key in obj) {
                    elem.style[key] = obj[key];
                }
                if (elem.getAttribute("data-draggable") === "true") elem.style.position = "absolute";
            });
            return this;
        },
        anim: function anim(dur, css, repeat) {
            var lastStyles = {};
            for (var key in css) {
                for (var j = 0; j < obj.list.length; j++) {
                    lastStyles[key] = getComputedStyle(obj.list[j])[key];
                }
            }
            var lastDur = dur;

            function animate(styles) {
                for (var i = 0; i < obj.list.length; i++) {
                    (function (i) {
                        var timer = setTimeout(function () {
                            for (var _key in styles) {
                                obj.list[i].style[_key] = styles[_key];
                            }
                        }, lastDur);
                    })(i);
                    lastDur += dur;
                }
            }

            if (repeat > 0) {
                lastDur -= dur * obj.list.length + dur;
                for (var t = 0; t <= repeat; t++) {
                    animate(lastStyles);
                    animate(css);
                }
            } else if (repeat <= 0 || repeat == undefined) {
                animate(css);
            }
            return this;
        },
        setSpan: function setSpan(className) {
            var arr = [];
            for (var n = 0; n < obj.list.length; n++) {
                arr[n] = obj.list[n].innerHTML.split("");
            }
            for (var t = 0; t < arr.length; t++) {
                for (var j = 0; j < arr[t].length; j++) {
                    arr[t][j] = "<span class='" + className + "'>" + arr[t][j] + "</span>";
                }
                obj.list[t].innerHTML = arr[t].join("");
            }
            obj.list = document.querySelectorAll("." + className);
            return this;
        },
        num: function num(from, int, speed, symb, sum) {
            var elem = obj.list[0];
            var value = elem.innerText;
            elem.innerText = from;
            if (sum == undefined) sum = 1;
            if (symb == undefined) symb = "+";
            var mem = elem.innerText;
            function time() {
                var timer = setTimeout(function () {
                    if (symb == "+") {
                        if (+elem.innerText >= value) clearTimeout(timer);else {
                            if (symb == "+") elem.innerText = +elem.innerText + sum;
                            if (symb == "-") elem.innerText = +elem.innerText - sum;
                            if (speed != undefined && speed != 0) int -= speed;
                            time();
                        }
                    } else if (symb == "-") {
                        if (+elem.innerText <= 0) clearTimeout(timer);else {
                            if (symb == "+") elem.innerText = +elem.innerText + sum;
                            if (symb == "-") elem.innerText = +elem.innerText - sum;
                            if (speed != undefined && speed != 0) int -= speed;
                            time();
                        }
                    }
                }, int);
            }
            time();
            return this;
        },
        do: function _do(event, func) {
            this.list.forEach(function (elem) {
                return elem.addEventListener(event, func);
            });
            return this;
        },
        scroll: function scroll(type, behaviour) {
            var scrolling = function scrolling() {
                if (type === "top") return obj.list[0].offsetTop - window.pageYOffset;
                if (type === "bottom") return obj.list[0].offsetTop + obj.list[0].offsetHeight - document.documentElement.clientHeight - window.pageYOffset;
            };
            window.scrollBy({
                top: scrolling(),
                behavior: behaviour
            });
            return this;
        },
        scrolling: function scrolling() {
            var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
            var actions = arguments[1];

            var to = obj.list[0].offsetTop,
                pos = window.pageYOffset,
                start = pos,
                int = 5,
                timer = void 0,
                add = function add() {
                if (pos < to) {
                    pos += (to - start) / speed * int;
                    window.scrollTo(0, pos);
                    if (pos >= to) {
                        window.scrollTo(0, to);
                        clearTimeout(timer);
                        if (actions && actions.finish) actions.finish();
                        return;
                    }
                } else if (pos > to) {
                    pos -= (start - to) / speed * int;
                    window.scrollTo(0, pos);
                    if (pos <= to) {
                        window.scrollTo(0, to);
                        clearTimeout(timer);
                        if (actions && actions.finish) actions.finish();
                        return;
                    }
                }
                timer = setTimeout(add, int);
            };
            if (actions && actions.start) actions.start();
            add();
            return this;
        },
        drag: function drag() {
            for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var arr = [].slice.call(arguments);
            var move = function move(e, x, y) {
                if (arr.includes("top")) this.style.top = e.pageY - y + "px";
                if (arr.includes("left")) this.style.left = e.pageX - x + "px";
            };
            var reset = function reset(object) {
                obj.list.forEach(function (el) {
                    for (var key in object) {
                        el.style[key] = object[key];
                    }
                });
            };
            var border = "2px solid #333";
            obj.list.forEach(function (elem) {
                var lastStyles = {
                    border: getComputedStyle(elem).border,
                    zIndex: getComputedStyle(elem).zIndex
                };
                elem.style.position = "absolute";
                elem.style.zIndex = "9999";
                elem.setAttribute("data-draggable", "true");
                elem.onmousedown = function (e) {
                    var _this = this;

                    var shiftX = e.pageX - this.offsetLeft;
                    var shiftY = e.pageY - this.offsetTop;
                    var self = this;
                    reset(lastStyles);
                    this.style.zIndex = "99999";
                    if (arr.includes("border")) this.style.border = border;
                    document.onmousemove = function (e) {
                        return move.call(self, e, shiftX, shiftY);
                    };
                    this.onmouseup = function () {
                        document.onmousemove = null;
                        _this.onmouseup = null;
                    };
                };
                elem.ondragstart = function () {
                    return false;
                };
                document.onclick = function (e) {
                    if (![].includes.call(obj.list, e.target)) reset(lastStyles);
                };
            });
            if (arr.includes("border")) {
                return {
                    css: function css(str) {
                        border = str;
                    }
                };
            }
            return this;
        },
        blow: function blow(value) {
            obj.list.forEach(function (el) {
                var pos = function pos() {
                    return Math.floor(Math.random() * value + 1);
                };
                el.style.left = el.offsetLeft + pos() + "px";
                el.style.top = el.offsetLeft + pos() + "px";
                el.style.top = el.offsetLeft - pos() + "px";
                el.style.left = el.offsetLeft - pos() + "px";
            });
            return this;
        },
        attr: function attr(attrName, value) {
            if (!value) return obj.list.length > 1 ? [].map.call(obj.list, function (el) {
                return el.getAttribute(attrName);
            }) : this.el.getAttribute(attrName);
            obj.list.forEach(function (el) {
                return el.setAttribute(attrName, value);
            });
            return this;
        },
        val: function val(_val) {
            if (!_val) return setProp.call(this, "value");
            obj.list.forEach(function (el) {
                return el.value = _val;
            });
            return this;
        },
        html: function html(_html) {
            if (_html === null) return obj.list.forEach(function (el) {
                return el.innerHTML = "";
            }), this;
            if (!_html) return setProp.call(this, "innerHTML");
            obj.list.forEach(function (el) {
                return el.innerHTML = _html;
            });
            return this;
        },
        child: function child(el) {
            if (!el) {
                var collection = setProp.call(this, "children");
                this.length = 0;
                collection.flat = this.flat;
                collection = collection.flat();
                this.push.apply(this, _toConsumableArray(collection));
                return this;
            }
            var elem = [].map.call(obj.list, function (element) {
                return document.createElement(el);
            });
            obj.list.forEach(function (el, i) {
                return el.appendChild(elem[i]);
            });
            obj.list = elem;
            return this;
        },
        class: function _class(className) {
            if (!className) return setProp.call(this, "className");
            this.list.forEach(function (el) {
                return !el.classList.contains(className) && el.classList.add(className);
            });
            return this;
        },
        center: function center() {
            var elems = obj.list;
            this.css({ "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)" });
            this.parent();
            this.css({ "position": "relative" });
            obj.list = elems;
            return this;
        },
        data: function data(name, value) {
            return this.attr("data-" + name, value);
        },
        remove: function remove(el) {
            el = [].map.call(obj.list, function (elem) {
                return elem.querySelector(el);
            });
            obj.list.forEach(function (elem, i) {
                return elem.removeChild(el[i]);
            });
            return this;
        },
        height: function height() {
            return setProp.call(this, "offsetHeight");
        },
        width: function width() {
            return setProp.call(this, "offsetWidth");
        },
        top: function top() {
            return setProp.call(this, "offsetTop");
        },
        left: function left() {
            return setProp.call(this, "offsetLeft");
        },
        parent: function parent() {
            obj.list = this.list.map(function (el) {
                return el.parentNode;
            }); // для центрирования
            return obj.list;
        },
        next: function next() {
            return setProp.call(this, "nextElementSibling");
        },
        prev: function prev() {
            return setProp.call(this, "previousElementSibling");
        },
        fillText: function fillText() {
            var _this2 = this;

            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var int = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

            text = String(text);
            var i = 0;
            var timer = setInterval(function () {
                if (text.type === "removeRight") {
                    _this2.forEach(function (el) {
                        var arr = el.textContent.split("");
                        arr.pop();
                        el.textContent = arr.join("");
                    });
                    return _this2;
                } else if (text.type === "removeLeft") {
                    _this2.forEach(function (el) {
                        var arr = el.textContent.split("");
                        arr.shift();
                        el.textContent = arr.join("");
                    });
                    return _this2;
                } else {
                    if (i >= text.length) return clearInterval(timer);
                    obj.list.forEach(function (el) {
                        return el.textContent += text[i];
                    });
                    i++;
                }
            }, int);
            return this;
        },
        eq: function eq(num) {
            obj.list[0] = this[num];
            obj.list.length = 1;
            obj.list.__proto__ = this.__proto__;
            obj.el = obj.list[0];
            return obj.list[0] ? obj.list : null;
        },
        text: function text(_text) {
            if (!_text) return setProp.call(this, "textContent");
            this.forEach(function (el) {
                return el.textContent = _text;
            });
            return this;
        },
        // Только для внутреннего использования
        forEach: [].forEach,
        map: [].map,
        reduce: [].reduce,
        push: [].push,
        flat: function flat() {
            return this.reduce(function (a, b) {
                return a.concat(Array.from(b));
            }, []);
        }
    };
    list.__proto__ = obj;
    //    for(let key in obj.el){ // Позволяет использовать все свойства и методы из обычного JS
    //        if(obj.el[key] instanceof Function) obj[key] = obj.el[key].bind(obj.el);
    //        else obj[key] = obj.el[key];
    //    }
    return list;
};

use.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//   https://skalman.github.io/UglifyJS-online/