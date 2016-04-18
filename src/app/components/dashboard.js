let dashboard = {
	template: `
		<div class="container-fluid">
			<ng-outlet></ng-outlet>
		</div>
	`,
	$routeConfig: [
		{ path: '/', name: 'PostsManager', component: 'postsManager', useAsDefault: true },
		{ path: '/edit/:id', name: 'EditPost', component: 'editPost' },
	],

}

let postsManager = {
	controller: ['Post', '$rootScope', function(Post, $rootScope) {
		var $ctrl = this;

		this.$onInit = function() {
			
			$ctrl.member = $rootScope.member;
			if($ctrl.member){
				Post.findAll({authorId: $rootScope.member.id }).then(posts => { $ctrl.posts = posts })
			}
    };

		$rootScope.$on('update', function() {
			$ctrl.member = $rootScope.member;
			Post.findAll({authorId: $rootScope.member.id }).then(posts => { $ctrl.posts = posts })			
		})

		$ctrl.toggleFeature = (post, feature)=>{ post[feature] = !post[feature]; post.DSSave()}

		this.removePost = (post) => {
			var choice = confirm('Are you sure you want to remove this post permanently?');
			if (choice) {
				post.DSDestroy();
			}
		}
	}],
	template: `
<div class="col-sm-12  panel panel-default">
	<div>
		<h2><a href="/" class="pull-right"><img src="img/logo.png" width="120"></a> Posts Manager</h2>
		<div class="row">

			<div class="col-sm-6 mtb10">
				<input type='text' class="form-control" ng-model="$ctrl.searchPosts" placeholder="Find Post">
			</div>

			<div class="col-sm-6 text-right mtb10">
				<a ng-link="[\'EditPost'\, {id: 'new'}] " class="btn btn-success"><i class="fa fa-newspaper-o"></i> New Post</a>
			</div>
		</div>
	</div>

	<div class="panel-body">
		<div class="col-sm-4" ng-repeat="post in $ctrl.posts | filter: $ctrl.searchPosts track by post.id">
			<div class="card-outmore">
				<div class="dashboard-post-actions">
					<a ng-click="$ctrl.toggleFeature(post, 'featured')" class="btn btn-primary text-white btn-sm"><i class="fa" ng-class="{'fa-star-o': !post.featured, 'fa-star text-yellow': post.featured }"></i></a>
					<a ng-click="$ctrl.toggleFeature(post, 'hide')" class="btn btn-primary text-white btn-sm"><i class="fa" ng-class="{'fa-cloud-download': !post.hide, 'fa-cloud-upload': post.hide }"></i></a>
					<a ng-click="$ctrl.removePost(post)" class="btn btn-danger text-white btn-sm"><i class="fa fa-trash"></i></a>
				</div>
			</div>
			<article class="blog-post thecard" ng-class="{'inactive': post.hide, 'featured': post.featured}">
				<div class="blog-post-image card-img">
					<a ng-link="[\'EditPost'\, {id: post.id.substr(1)}]"><img class="img-responsive" ng-src="{{post.imgUrl}}" alt="{{post.title}}"></a>
				</div>
				<div class="blog-post-body card-caption">
					<h4><a ng-link="[\'EditPost'\, {id: post.id.substr(1)}]">{{post.title}}</a></h4>
					<div class="post-meta">
						<span>
							by <a href="#">{{post.author.name}}</a></span>/
						<span class="date"><i class="fa fa-clock-o"></i>{{post.created | date}}</span>/<span><i class="fa fa-comment-o"></i> {{post.comments.length || 0}}</span>
					</div>
					<p markdown-to-html="post.body.split(' ').slice(0, 15).join(' ')">...</p>
				</div>
			</article>
		</div>
	</div>
</div>
	`
}

let editPost = {
	template: `
<div class="container-fluid mtb10">
	<div class="row">
		<div class="panel">
			<div class="panel-heading">
				<ul class="nav nav-tabs">
					<li><a ng-click="$ctrl.view = 'edit'">Edit</a></li>
					<li><a ng-click="$ctrl.view = 'preview'">Preview</a></li>
					<li class="dropdown" ng-class="{'open': $ctrl.open}">
						<a ng-click="$ctrl.open = !$ctrl.open">Save<span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a ng-click="$ctrl.save()"><i class="fa fa-save"></i> Save</a></li>
							<li><a ng-click="$ctrl.save(!$ctrl.post.hide)"><i class="fa fa-cloud-upload "></i>{{$ctrl.post.hide ? 'Publish' : 'Mark Private'}}</a></li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="panel-body">
				<div class="tab-content" ng-show="$ctrl.view === 'edit'">
					<h3>Markdown</h3>
					<form class="form">
						<div class="form-group">
							<input class="form-control" placeholder="Main Image" ng-model="$ctrl.post.imgUrl"/>
						</div>
						<div class="form-group">
							<input class="form-control" placeholder="Post Title" ng-model="$ctrl.post.title"/>
						</div>
						<div class="form-group">
							<textarea ng-tab ng-trim="false" class="form-control" ng-model="$ctrl.post.body" rows="20" placeholder="Once upon a time..."></textarea>
						</div>
						<div class="form-group">
							<textarea ng-tab ng-trim="false" class="form-control" ng-model="$ctrl.post.meta" rows="10" placeholder="meta tags here"></textarea>
						</div>
					</form>
				</div>
			</div>
			<div class="tab-content" ng-show="$ctrl.view === 'preview'">
				<div class="row">
					<div class="col-sm-8 col-sm-offset-2">
						<article class="blog-post">
							<div class="blog-post-image text-center">
								<a><img ng-src="{{$ctrl.post.imgUrl}}" alt="{{$ctrl.post.title}}"></a>
							</div>
							<div class="blog-post-body">
								<h2><a>{{$ctrl.post.title}}</a></h2>
								<div class="post-meta">
									<span>by <a>{{$ctrl.post.author.name}}</a>
									</span>/<span><i class="fa fa-clock-o"></i>{{$ctrl.post.created | date}}</span>/
									<span><i class="fa fa-comment-o"></i> <a href="#comments">{{$ctrl.post.comments.length || 0}}</a></span>
								</div>
								<div class="blog-post-text" markdown-to-html="$ctrl.post.body"></div>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`,
	controller: ['$rootScope', 'Post', function($rootScope, Post) {
		var $ctrl = this;
		$ctrl.view = 'edit';
		this.$routerOnActivate = function(next) {
			var id = '/'+next.params.id;
			if (id) {
				Post.find(id).then(post => { $ctrl.post = post });
			} else {
				$ctrl.post = { title: '', body: '', meta: '' }
			}
		};

		$ctrl.save = (publish) => {
			if(!$ctrl.post.id){
				$ctrl.post.authorId = $rootScope.member.id; 
				$ctrl.post.author = {
					name: $rootScope.member.name
				}
				$ctrl.post.created = Date.now();
				$ctrl.post.hide = true;
				Post.create($ctrl.post).then(p => {$ctrl.post = p});
			}
			if(publish){
				$ctrl.post.hide = false;
			}
			Post.save($ctrl.post, { upsert: true });
		}
	}],
	bindings: { $router: '<' },

}

var dashboardModule = angular.module('dashboard', ['js-data'])
	.component('dashboard', dashboard)
	.component('postsManager', postsManager)
	.component('editPost', editPost)


export {
dashboardModule
}