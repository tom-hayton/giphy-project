import { 
    fetchData,
    createWidget,
    getIsEmptyString,
    createGifElement,
    createSVGFactory,
    constructElement,
    toggleFunctionsFactory,
} from './utils.js';
import { 
    randomImgContainer, 
    isMobile,
} from './script.js';

let offset = 0;
let searchString = '';

const createStaticElements = () => {
    // Create Elements
    const headingElement = constructElement('h2', 'Finder', [{key: 'class', value: 'h2--left'}])
    const formLabelElement = constructElement(
        'label', 
        "Search for a GIPHY", 
        [
            {key: 'class', value: 'finder__label'},
            {key: 'for', value: 'search-input'},
        ]
    );
    const formInputElement = constructElement(
        'input', 
        "", 
        [
            {key: 'class', value: 'finder__input'},
            {key: 'for', value: 'search-input'},
            {key: 'type', value: 'search'},
            {key: 'name', value: 'searchTerm'},
            {key: 'id', value: 'search-input'},
            {key: 'required', value: 'true'},
            {key: 'minLength', value: '1'},
            {key: 'pattern', value: '.+[\\w]'},
            {key: 'title', value: 'Must contain a word'},
        ]
    );
    const formButtonElement = createSearchBtn();
    const formElement = constructElement('form', '', [{key: 'class', value: 'finder__form form--vflex'}], null, [formLabelElement, formInputElement, formButtonElement]);


    const gifInitialMsgElement = constructElement('p', "Search for a gif and your results will appear here...", [{key: 'class', value: 'init-msg'}]);
    const imgContainerElement = constructElement('div', '', [{key: 'class', value: 'finder__imgContainer'}]);
    
    const sectionElement = constructElement(
        'section', 
        '', [
            {key: 'id', value: 'finder-section'},
            {key: 'role', value: 'tabpanel'},
        ],
        null,
        [headingElement, formElement, gifInitialMsgElement, imgContainerElement]
    );
    

    return sectionElement;
}

const createSearchBtn = () => {
    const searchSVGBuilder = createSVGFactory('search');
    // Create elements
    const searchSVG = searchSVGBuilder();
    const span = constructElement('span', "Search")
    const btnEl = constructElement(
        'button', 
        "", 
        [
            {key: "class", value: "btn btn--flex btn--w100 btn--expandable"},
            {key: "aria-label", value: "Search for Gif"},
        ],
        randomImgContainer.parentElement,
        [searchSVG, span]
    );
    return btnEl;
}

export const init = () => {
    const loadingWidget = createWidget('loading');
    const loadMoreBtn = constructElement('button', 'Load More Gifs', [{key: 'class', value: 'btn finder__loadMoreBtn btn--w100 btn--expandable'}, {key: 'aria-hidden', value: 'true'}]);
    const searchContainer = document.querySelector('.finder__imgContainer');
    const formEl = document.querySelector('.finder__form')
    
    // reset class list to remove absolute styling
    loadingWidget.setAttribute("class", "widget__container");

    loadingWidget.style.display = 'none';
    loadMoreBtn.style.display = 'none';

    searchContainer.appendChild(loadingWidget);
    searchContainer.insertAdjacentElement('afterend', loadMoreBtn);

    if(formEl) formEl.addEventListener("submit", (e) => handleFormSubmit(e, loadingWidget));
    loadMoreBtn.addEventListener("click", () => fetchAndDisplay(searchString, loadingWidget, false));
};

export const mount = () => {
    const randomSectionEl = document.querySelector('#random-section')
    const sectionElement = createStaticElements();
    randomSectionEl.insertAdjacentElement('afterend', sectionElement);
    init();    
    console.info("mounted finder");
}
export const { unMount, hide, show } = toggleFunctionsFactory('finder');


// Add and remove img each time random gif is requested due to delay in switching from old gif to new gif, even after src attribute loaded
const addImg = (parent, src = "", alt = "", classStr = "", idx = null) => {
    const imgEl = createGifElement(src, alt, classStr, idx);
    parent.appendChild(imgEl);
};

const removeElements = (parent) => {
    const imgEls = parent.querySelectorAll("img");
    if(imgEls.length) imgEls.forEach((img) => parent.removeChild(img));
};

const handleFormSubmit = (e, loadingWidget) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const query = formData.get("searchTerm");
    if(query !== searchString) {
        searchString = query;
        fetchAndDisplay(query, loadingWidget);
    };
};

const displayImgs = (data, imgContainer) => {
    const gifSrcKey = isMobile ? "fixed_width" : "original";

    data.forEach((dataObj, idx) => {
        const {images, title: alt} = dataObj;
        const trueAlt = getIsEmptyString(alt) ? "Gif from giffy" : alt;
        const src = images[gifSrcKey].webp;
        addImg(imgContainer, src, trueAlt, "finder__img", idx);
    });
}

const fetchAndDisplay = async (dataIn, loadingWidget, isNewQuery = true) => {
    // API call inputs
    const limit = isMobile ? 15 : 20;
    const requestInit = {};

    const bundleParam = "bundle=clips_grid_picker";
    const limitParam = `limit=${limit}`;
    const offsetParam = `offset=${offset}`
    const paramString  = `q=${dataIn}&${bundleParam}&${limitParam}&${offsetParam}`;
    
    // Other Variables
    const initMsg = document.querySelector('.init-msg');
    const imgContainer = document.querySelector(".finder__imgContainer");
    const errorWidget = document.querySelector('.finder-error__div');
    
    if(isNewQuery) {
        searchString = dataIn;
        removeElements(imgContainer);
        offset = 0;
    };

    if(errorWidget) errorWidget.remove();
    loadingWidget.style.display = "flex";
    
    fetchData('search', requestInit, paramString)
        .then(res => {
            if(res instanceof Error) throw res;
            return res;
        })
        .then(resJson => {
            const { data } = resJson;
            displayImgs(data, imgContainer);
            return resJson;
        })
        .then(resJson => {
            const { pagination } = resJson;
            const { count, total_count } = pagination;
            initMsg.setAttribute('aria-hidden', "false");
            initMsg.innerText = count ? 
                `Displaying ${offset + count} of ${total_count} results`
                : `Awh shucks, we don't we couldn't find any results for "${dataIn}", please try again with a different search term`;
            offset += count;
            
            const loadMoreBtn = document.querySelector('.finder__loadMoreBtn');
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
            errorWidget.setAttribute("class", "widget__container finder-error__div");
            imgContainer.insertAdjacentElement('afterEnd', errorWidget)
            initMsg.innerText = "";
            initMsg.setAttribute('aria-hidden', "true")
        })
        .finally(() => {
            loadingWidget.style.display = "none";
        });
}