import Flickr from "./flickr";

let flickr = new Flickr();

class Gallery {

	constructor (photos, container) {
		this.photos = photos;
		this.container = container;

		container.textContent = '';

		let image, link, listItem, span;
		for (var i = 0; i < this.photos.length; i++) {
			image = document.createElement('img');
			image.src = flickr.buildPhotoUrl(this.photos[i]);
			image.className = 'image-item';
			image.alt = this.photos[i].title;
			image.title = this.photos[i].title;

			link = document.createElement('a');
			link.href = image.src;
			link.addEventListener('click', clickHandler(i, this));
			link.appendChild(image);

			span = document.createElement('span');
			span.className = 'image-title-span';
			span.innerHTML = this.photos[i].title;

			listItem = document.createElement('li');
			listItem.appendChild(link);
			listItem.appendChild(span);

			container.appendChild(listItem);
		}

		function clickHandler(index, gallery) {
			return function (event) {
				event.preventDefault();

				gallery.showPhoto(index);
			};
		}
	}

	showPhoto (index) {
		if (index >= 0 && index < this.photos.length) {
			this.currentIndex = index;
			this.container.src = flickr.buildPhotoUrl(this.photos[this.currentIndex]);
		}
	};
}

export default Gallery;