import {CONNECTION_STRING} from './app.constants.js';

let config = ($locationProvider, DSFirebaseAdapterProvider, $showdownProvider) => {
	$locationProvider.html5Mode(true);	
	DSFirebaseAdapterProvider.defaults.basePath = CONNECTION_STRING; 
	
	//Enable extra showdown features
	$showdownProvider.setOption('parseImgDimensions', true)
	$showdownProvider.setOption('simplifiedAutoLink', true)
	$showdownProvider.setOption('tables', true)
	$showdownProvider.setOption('tasklists', true)
	
}

let run = (DS, DSFirebaseAdapter) => {
    
    DS.registerAdapter(
			'firebase',
			DSFirebaseAdapter,
			{ default: true }
    );

    angular.forEach(DS.definitions, function(Resource) {
			if (Resource.defaultAdapter !== 'firebase') return;
			var ref = DSFirebaseAdapter.ref.child(Resource.endpoint);

			ref.on('child_changed', function(dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.inject(data);
				}
			});

			ref.on('child_removed', function(dataSnapshot) {
				var data = dataSnapshot.val();
				if (data[Resource.idAttribute]) {
					Resource.eject(data[Resource.idAttribute]);
				}
			});
		});
}

export {
	config,
	run
}
