const axios = import('axios').default;
import Notiflix from 'notiflix';

const refs = {
   form: document.querySelector('.search-form'),
   input: document.querySelector('input[name="searchQuery"]'),
   gallery: document.querySelector('.js-gallery-container'),
   loadMore: document.querySelector('.load-more')
}
refs.form.addEventListener('submit', clickOnButton)
refs.loadMore.addEventListener('click', loadMoreGallery)
let pageGallery = 1;

function loadMoreGallery(e) {
   ++pageGallery;
   getHTTP(e);
}

function clickOnButton(e) {
   e.preventDefault();
   refs.loadMore.classList.add('hidden')
   pageGallery = 1;
   refs.gallery.innerHTML = '';
   const valueSearch = e.currentTarget.elements.searchQuery.value.trim()
   if (valueSearch == "") {
      Notiflix.Notify.failure("Давай текст");
   } else {
      getHTTP(e)
   }
}
const option = {
   key: "28372607-30c2f074d06c20b95d41a8fad",
   image_type: "photo",
   orientation: "horizontal",
   safesearch: true
}

function getHTTP(e) {
   const inputValue = refs.input.value;
   fetch(`https://pixabay.com/api/?key=${option.key}&q=${inputValue}&image_type=${option.image_type}&orientation=${option.orientation}&safesearch=${option.safesearch}&per_page=40&page=${pageGallery}`)
      .then(data => data.json()).then(data => {
         if (data.total == 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            refs.loadMore.classList.add('hidden')
            refs.gallery.innerHTML = '';
         }else {
            renderGallery(data)
            Notiflix.Notify.success(`Hooray! We found ${data.hits.length} images.`)
            if (data.hits.length < 40) {
            refs.loadMore.classList.add('hidden')
            }
            }
      })
}

function renderGallery(data) {
   refs.loadMore.classList.remove('hidden')
   refs.gallery.innerHTML += data.hits.map(gallery => `<div class="photo-card">
   <img src="${gallery.webformatURL}" alt="${gallery.tags}" width="440" height="240" loading="lazy" />
   <div class="info">
      <p class="info-item">
      <b>Likes: ${gallery.likes}</b>
      </p>
      <p class="info-item">
      <b>Views: ${gallery.views}</b>
      </p>
      <p class="info-item">
      <b>Comments: ${gallery.comments}</b>
      </p>
      <p class="info-item">
      <b>Downloads: ${gallery.downloads}</b>
      </p>
   </div>
</div>`).join('')
}