export function render(el) {
    document.body.appendChild(el);
}

export function createElement(tagName, attrs, html) {
    let el = document.createElement(tagName);
    if (attrs) {
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    if (html) {
        el.innerHTML = html;
    }
    return el;
}

export function withEvent(eventName, eventHandler) {
    return function(el) {
        el.addEventListener(eventName, eventHandler);
        return el;
    };
}

export function withStyle(styleName, styleValue) {
    return function(el) {
        el.style[styleName] = styleValue;
        return el;
    };
}

export function withExtraElement(child) {
    return function(el) {
        el.appendChild(child);
        return el;
    };
}

