// 
export const toggleShow = (element, shouldShow = false) => {
    console.log(element)
    console.log(shouldShow)
}

export const unMountFactory = (element) => {
    return function(element) {
        
    }
}

export const createGifElement = (src = "", alt = "", classStr = "") => {
    const imgEl = document.createElement('img');
    
    imgEl.setAttribute("src", src);
    imgEl.setAttribute("alt", alt);
    imgEl.setAttribute("class", classStr);

    return imgEl;
}

export const getIsEmptyString = (stringIn) => !!!stringIn.replace(/\s/g, '').length;

export const fetchData = async (endPoint, requestInit = {}, paramsString = '',) => {
    const apiKey = "cJk753VT5aQzpNGrGxgOrlL4LSnXnKa8";
    const params = paramsString.length ? `&${paramsString}` : ""
    const url = `https://api.giphy.com/v1/gifs/${endPoint}?api_key=${apiKey}${params}`;

    try {
        const res = await fetch(url, requestInit);
        return await res.json();
    } catch (err) {
        return err;
    }
}

export const createSVGFactory = (config) => {
    let path = "";
    switch(config) {
        case 'loading': {
            path = "M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z";
            break;
        }
        case 'error': {
            path = "M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
            break;
        }
        case 'refresh': {
            path = "M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z";
            break;
        }
        default: break;
    }

    return function() {
        const nameSpace = "http://www.w3.org/2000/svg"
        const svgEl = document.createElementNS(nameSpace,'svg');
        const pathEl = document.createElementNS(nameSpace,'path');

        
        // attributes
        svgEl.setAttribute('aria-hidden', 'true');
        svgEl.setAttribute('viewBox', "0 0 512 512");
        svgEl.setAttribute('class', 'widget__svg');

        
        pathEl.setAttribute(
            'd', 
            path
            );
            
            // Create Tree
            svgEl.appendChild(pathEl);
            
            return svgEl;
    }
}
        const createWidgetSVG = (config) => {
    const nameSpace = "http://www.w3.org/2000/svg"
    const svgEl = document.createElementNS(nameSpace,'svg');
    const pathEl = document.createElementNS(nameSpace,'path');

    // attributes
    svgEl.setAttribute('aria-hidden', 'true');
    svgEl.setAttribute('viewBox', "0 0 512 512");
    svgEl.setAttribute('class', 'widget__svg');

    pathEl.setAttribute(
        'd', 
        config === 'loading' ?
        "M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z"
        : "M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
    );

    // Create Tree
    svgEl.appendChild(pathEl);

    return svgEl;
}

export const createWidget = (config) => {
    const container = document.createElement('div');
    const svg = createWidgetSVG(config);
    const msg = document.createElement("span");

    // Set attributes
    container.setAttribute("class", "widget-container widget--absolute");
    container.style.zIndex = "2";

    // Set Leaves
    msg.innerText = config === 'loading' ? "Giphy's will be here in a jiffy..." : "oh no, something went snap!";

    // Create Tree
    container.appendChild(svg); 
    container.appendChild(msg); 

    return container;
}

export const constructElement = (tag, innerText = "", attributes = [], parent = null, children = []) => {
    const el = document.createElement(tag);
    
    el.innerText = innerText;

    // must take in array of attributes, in the format [{key: "attribute_name", value: "attribute_value"}]
    if(Array.isArray(attributes)) {
        attributes.forEach(attrObject => {
            el.setAttribute(attrObject.key, attrObject.value)
        })
    }


    if(Array.isArray(children)) {
        children.forEach(child => el.appendChild(child))
    }

    if(parent) parent.appendChild(el);
    return el;
    
}

export const getErrorWidget = () => {
    
}