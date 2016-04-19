import angular from 'angular'
import ngComponentRouter from '@angular/router/angular1/angular_1_router.js'
import jsDataAngular from 'js-data-angular'
import ngSanitize from 'angular-sanitize'


// LOAD CUSTOM COMPONENTS
import {config, run} from './app.config.js'

import {User, firebaseAuth, AuthService} from './components/auth.js'
import {dataModels} from './app.models.js'
import {navbar} from './components/navbar.js'
import {postsModule} from './components/posts.js'
import {footer} from './components/footer.js'
import {dashboardModule} from './components/dashboard.js'
import {socialLinks} from './components/social-links.js'
import {sidebarModule} from './components/sidebar.js'
import {MODULE_NAME} from './app.constants.js'


import './app.styles.js'; 

angular.module(MODULE_NAME, [
	'ngComponentRouter',
	'ngSanitize',
	'js-data',
	'ng-showdown',
	'posts',
	'sidebarModule',
	'dataModels',
	'dashboard'
	])
	.config(config)
	.run(run)
	.value('$routerRootComponent', 'app')
	.component('app', {
		template: `
			<div class="row main-content">
				<ng-outlet></ng-outlet>
			</div>
			<sfooter></sfooter>
		`,
		$routeConfig: [
			{ path: '/...', name: 'TwoCol', component: 'twoCol', useAsDefault: true },
			{ path: '/dashboard/...', name: 'Dashboard', component: 'dashboard' },
    ],
		controller: ['$scope', '$showdown', function($scope, $showdown) {
			var $ctrl = this;
			$ctrl.test = '##ello'
			this.convert = function(){
				$ctrl.out = $showdown.makeHtml($ctrl.test);
			}
		}]
	})
	.component('twoCol', {
		template: `
		<div>
				<header>
					<a href="/"><img src="img/logo.png"></a>
				</header>
				<div class="col-sm-7 col-sm-offset-1">
					<posts></posts>
				</div>
				<div class="col-sm-3">
					<sidebar></sidebar>
				</div>
		</div>
		`, 
		$routeConfig: [
			{ path: '/...', name: 'Posts', component: 'posts', useAsDefault: true },
		]
	})
	.component('navbar', navbar)
	.component('socialLinks', socialLinks)
	.component('sfooter', footer)
	.component('firebaseauth', firebaseAuth)
	.factory('User', User)
	.factory('AuthService', AuthService)

export default MODULE_NAME;