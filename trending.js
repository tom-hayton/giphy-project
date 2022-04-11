import { 
    fetchData,
    createWidget,
    getIsEmptyString,
    createGifElement,
    toggleFunctionsFactory,
    constructElement,
} from './utils.js';

import { 
    isMobile,
} from './script.js';

let offset = 0;

const createStaticElements = () => {
    // Create Elements
    const sectionElement = document.createElement('section');
    const headingElement = document.createElement('h2');
    const imgContainerElement = document.createElement('div');
    
    // Set attributes
    sectionElement.setAttribute('id', 'trending-section');
    sectionElement.setAttribute('role', 'tabpanel');
    headingElement.setAttribute('class', 'h2--left');
    imgContainerElement.setAttribute('class', 'trending__imgContainer');
    
    // Set Text
    headingElement.innerText = "Trending";

    // Create Tree
    sectionElement.appendChild(headingElement);
    sectionElement.appendChild(imgContainerElement);

    return sectionElement;
}

export const init = () => {
    const loadingWidget = createWidget('loading');
    const loadMoreBtn = constructElement('button', 'Load More Gifs', [{key: 'class', value: 'btn trending__loadMoreBtn btn--w100 btn--expandable'}, {key: 'aria-hidden', value: 'true'}]);
    const searchContainer = document.querySelector('.trending__imgContainer');

    // reset class list to remove absolute styling
    loadingWidget.setAttribute("class", "widget__container");

    loadingWidget.style.display = 'none';
    loadMoreBtn.style.display = 'none';
    
    searchContainer.appendChild(loadingWidget);
    searchContainer.insertAdjacentElement('afterend', loadMoreBtn);

    fetchAndDisplay(loadingWidget);
    loadMoreBtn.addEventListener("click", () => fetchAndDisplay(loadingWidget, false));
};

export const mount = () => {
    const mainEl = document.querySelector('main')
    const sectionElement = createStaticElements();
    mainEl.insertAdjacentElement('beforeend', sectionElement);
    init();    
    console.info("mounted trending");
}

export const { unMount, hide, show } = toggleFunctionsFactory('trending');

// Add and remove img each time random gif is requested due to delay in switching from old gif to new gif, even after src attribute loaded
const addImg = (parent, src = "", alt = "", classStr = "", idx = null) => {
    const imgEl = createGifElement(src, alt, classStr, idx, 3);
    parent.appendChild(imgEl);
}

const removeElements = (parent) => {
    const imgEls = parent.querySelectorAll("img");
    if(imgEls.length) imgEls.forEach((img) => parent.removeChild(img));
}

const fetchAndDisplay = async (loadingWidget, isNewQuery) => {
    // API call inputs
    const limit = isMobile ? 5 : 10;
    const requestInit = {};

    const bundleParam = "bundle=clips_grid_picker";
    const limitParam = `limit=${limit}`;
    const offsetParam = `offset=${offset}`;
    const paramString  = `${bundleParam}&${limitParam}&${offsetParam}`;

    // Other variables
    const imgContainer = document.querySelector(".trending__imgContainer");

    if(isNewQuery) {
        removeElements(imgContainer);
        offset = 0;
    };

    loadingWidget.style.display = "flex";
    
    fetchData('trending', requestInit, paramString)
        .then(res => {
            if(res instanceof Error) throw res;
            return res;
        })
        .then(resJson => {
            const { data } = resJson;

            // prevent duplicates
            let processedArry = [];
            data.forEach((dataObj, idx) => {
                const {images, title: alt, id} = dataObj;
                if(!processedArry.includes(id)) {
                    const trueAlt = getIsEmptyString(alt) ? "Gif from giffy" : alt;
                    const src = images["fixed_width"].webp;
                    addImg(imgContainer, src, trueAlt, "trending__img", idx);
                    processedArry.push(id);
                };
            });
            return resJson;
        })
        .then(resJson => {
            const { pagination } = resJson;
            const { count, total_count } = pagination;

            offset += count;
            const loadMoreBtn = document.querySelector('.trending__loadMoreBtn');
            if(total_count > offset + count) {
                loadMoreBtn.setAttribute('aria-hidden', 'false');
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.setAttribute('aria-hidden', 'true');
                loadMoreBtn.style.display = 'none';
            }
        })
        .catch(err => {
            console.log(err);
            const errorWidget = createWidget('error');
            errorWidget.setAttribute("class", "widget__container");
            imgContainer.insertAdjacentElement('beforebegin', errorWidget);
        })
        .finally(() => {
            loadingWidget.style.display = "none";
        });
}