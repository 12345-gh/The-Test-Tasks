import Flickr from "./flickr";
import Gallery from "./gallery";
import _ from "lodash";

let gallery;
let flickr = new Flickr();

class Homepage {

	constructor(){
		this.startSearch = 'Ukraine';
	}

	searchPhotos(text){
		if (text.length === 0) {
			alert('Error: the field is required');
		}

		flickr.searchText({
			text: text,
			per_page: 25,
			jsoncallback: 'showPhotos'
		});
	}

	submitForm(){
			let searchString = document.getElementById('query').value;

			if (searchString.length > 0) {
				this.searchPhotos(searchString);
			}
	}

	init(){
		document.getElementsByClassName('js-form-search')[0].addEventListener('submit',function (event){
				event.preventDefault();
			  _.debounce(homePage.submitForm(), 50000);
		});

	  // Start the page
		homePage.searchPhotos(this.startSearch);
	}
}

let homePage = new Homepage();
homePage.init();

window.showPhotos = (data) => {
	gallery = new Gallery(data.photos.photo, document.getElementsByClassName('js-image-list')[0]);
};