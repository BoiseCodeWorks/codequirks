let User = function(DS) {
	return DS.defineResource({
		name: 'user',
		endpoint: 'users',
		relations: {
			hasMany: {
				post: {
					localField: 'posts',
					foreignKey: 'postId',
				}
			}
		}
	})
}

let firebaseAuth = {
		controller: function($rootScope, $scope, AuthService) {
		var $ctrl = this;
		$rootScope.$on('update', function() {
			$ctrl.member = $rootScope.member;
		})
		var ac = this;
		let handleDBResponse = (err, memberData) => {
			$scope.$evalAsync(function() {
				if (memberData) {
					ac.member = memberData;
				}
				if (err) {
					ac.authErr = err.message;
				}
			})
		}

		AuthService.authMember(handleDBResponse);
		ac.login = function() {
			clearErr();
			AuthService.login(ac.user, handleDBResponse);
		};

		// ac.register = function() {
		// 	clearErr();
		// 	AuthService.register(ac.user, handleDBResponse);
		// };

		ac.logout = function() {
			clearErr();
			AuthService.logout();
			ac.member = null;
		};

		function clearErr() {
			ac.authErr = '';
		}

		},
		template: `
	<li ng-if="!$ctrl.member">
		<!--Login via
		<div class="social-buttons">
			<a href="#" class="btn btn-fb"><i class="fa fa-facebook"></i> Facebook</a>
			<a href="#" class="btn btn-tw"><i class="fa fa-twitter"></i> Twitter</a>
		</div>
		or-->
		<form class="form" ng-submit="$ctrl.submitForm()">
			<div class="form-group">
				<label for="email">Email:</label>
				<input class="form-control" type="email" ng-model="$ctrl.user.email">
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input class="form-control" type="password" ng-model="$ctrl.user.password">
			</div>
			<div class="button-group">
				<div class="alert alert-danger" ng-if="$ctrl.authErr">{{$ctrl.authErr}}</div>
				<div class="row">
					<div class="col-sm-12">
						<button class="btn btn-primary btn-block" type="submit" ng-click="$ctrl.submitForm = $ctrl.login">Login <i class="fa fa-sign-in"></i></button>
					</div>
				</div>
			</div>
		</form>
	</li>
	<li ng-if="$ctrl.member">
		<small>User ID: {{$ctrl.member.id}}</small>
	</li>
	<li role="separator" class="divider"></li>
	<li ng-if="$ctrl.member">
		<button class="btn btn-block btn-danger mtb10" ng-click="$ctrl.logout()">Logout <i class="fa fa-sign-out"></i></button>
	</li>
		`
}

let AuthService = function($rootScope, DSFirebaseAdapter, User) {
		var db = DSFirebaseAdapter.ref;

		function authMember(cb) {
		var authData = db.getAuth();
		if (!authData) {
			cb ? cb({ error: { message: 'Unable to Authenticate' } }) : '';
			return true;
		}
		setMember(authData.uid, cb);
		}

		function setMember(id, cb) {
		return User.find(id).then(function(member) {
			$rootScope.member = member;
			$rootScope.$broadcast('update');
			return cb ? cb(null, member) : '';
		})
		}

	// function createUser(authData, user) {
	// 	var userToAdd = {
	// 		id: authData.uid,
	// 		email: user.email,
	// 		created: Date.now()
	// 	}
	// 	User.create(userToAdd);
	// }
	return {
		// register: function(user, cb) {
		// 	db.createUser(user, function(err, authData) {
		// 		if (err) {
		// 			return cb(err)
		// 		}
		// 		createUser(authData, user);
		// 		authMember(cb);
		// 	});
		// },
		login: function(user, cb) {
			db.authWithPassword(user, function(err, authData) {
				if (err) {
					return cb(err)
				}
				authMember(cb);
			})
		},
		logout: function() {
			db.unauth();
			$rootScope.member = null;
			$rootScope.$broadcast('update');
		},
		authMember: authMember,
		getAuth: function() {
			return db.getAuth();
		}
	}
}

AuthService.$inject = ['$rootScope', 'DSFirebaseAdapter', 'User']
firebaseAuth.$inject = ['$rootScope', '$scope', 'AuthService']
User.$inject = ['DS']

export {
AuthService,
firebaseAuth,
User
}