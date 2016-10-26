import Utility from "./utility";

let utility = new Utility();

class Flickr {

	constructor () {
		this.apiKey = '9ae67ff75d0fc517643b87e8b14b0376';
		this.apiURL = 'https://api.flickr.com/services/rest/';
	}

	searchText(parameters) {
		var requestParameters = utility.extend(parameters, {
			method: 'flickr.photos.search',
			api_key: this.apiKey,
			format: 'json'
		});

		var script = document.createElement('script');
		script.src = utility.buildUrl(this.apiURL, requestParameters);
				document.head.appendChild(script);
		document.head.removeChild(script);
	}

	buildPhotoUrl (photo) {
		return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
			'/' + photo.id + '_' + photo.secret + '.jpg';
	}
}

export default Flickr;