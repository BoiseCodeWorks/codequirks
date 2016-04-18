let navbar =  {
	template: `
	<nav class="navbar navbar-theme">
			<div class="container-fluid">
				<div class="navbar-header row">
					<button type="button" class="navbar-toggle collapsed" ng-click="$ctrl.collapse = !$ctrl.collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					</button>
				</div>
				<div ng-class="{'collapse navbar-collapse': !$ctrl.collapse }">
					<ul class="nav navbar-nav">
						<li><a href="/">Home</a></li>
					</ul>
					<ul class="nav navbar-nav" ng-if="$ctrl.member">
						<li><a ng-link=[\'Dashboard'\]>Dashboard</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li class="dropdown" ng-class="{'open': $ctrl.loginMenu }">
							<a ng-click="$ctrl.loginMenu = !$ctrl.loginMenu">
								{{$ctrl.member ? $ctrl.member.name : 'Login'}}
								<span class="caret"></span>
							</a>
							<ul class="dropdown-menu login-dp">
								<firebaseauth></firebaseauth>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	`,
	controller: ['$rootScope',function ($rootScope){
		var $ctrl = this;
		$rootScope.$on('update', function(){
			$ctrl.member = $rootScope.member;
		})
	}]
}
	
export {
	navbar
}