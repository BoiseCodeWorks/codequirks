let socialLinks = {
	template: `
		<a ng-repeat="link in sl.socialLinks" ng-if="link.url" href="{{link.url}}" target="_blank"><i class="fa fa-{{link.type}}"></i></a>
	`,
	controller: function (){
		/**
		 * ADDING SOCIAL LINKS
		 * You can add or modify the social links by using the font-awesome name
		 * for each type. 
		 * The only icons that actually show up are those that have the link property filled in.  
		 */
		this.socialLinks = [{
			type: 'facebook',
			url: 'https://www.facebook.com/boisecodeworks'
		},{
			type: 'twitter',
			url: 'https://twitter.com/boisecodeworks'
		},{
			type: 'instagram',
			url: 'https://www.instagram.com/boisecodeworks/'
		},{
			type: 'google',
			url: ''
		},{
			type: 'github',
			url: 'https://github.com/boisecodeworks'
		},{
			type: 'dribble',
			url: ''
		},{
			type: 'linkedin',
			url: ''
		},{
			type: 'reddit',
			url: ''
		},{
			type: 'youtube',
			url: ''
		},{
			type: 'steam',
			url: ''
		},{
			type: 'soundcloud',
			url: ''
		},{
			type: 'pinterest',
			url: ''
		},{
            type: 'lastfm',
            url: ''
        }]
	},
	controllerAs: 'sl'
}

export {
	socialLinks
}