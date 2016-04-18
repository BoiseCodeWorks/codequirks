import { USER_ID } from '../app.constants.js';

let sidebar = {
	template: `
		<aside>
			<about-me></about-me>
			<featured-posts></featured-posts>
			<social-side></social-side>
			<!--<tags></tags>-->
		</aside>
	`,
}


let aboutMe = {
	template: `
<div class="sidebar-widget">
	<div class="btn-group pull-right m10" ng-if="$ctrl.member">
		<button ng-click="$ctrl.edit = !$ctrl.edit" ng-if="!$ctrl.edit" class="btn btn-warning"><i class="fa fa-edit"></i></button>
		<button ng-click="$ctrl.updateInfo()" ng-if="$ctrl.edit" class="btn btn-success"><i class="fa fa-save"></i></button>
		<button ng-click="$ctrl.edit = !$ctrl.edit" ng-if="$ctrl.edit" class="btn btn-danger"><i class="fa fa-trash"></i></button>
	</div>
	<h3 class="sidebar-title">About Me</h3>
	<div class="widget-container widget-about">
		<form class="form text-left" ng-if="$ctrl.edit && $ctrl.member">
			<div class="form-group">
				<input ng-model="$ctrl.author.imgUrl" class="form-control" placeholder="image url" />
			</div>
			<div class="form-group">
				<input ng-model="$ctrl.author.name" class="form-control" placeholder="name" />
			</div>
			<div class="form-group">
				<input ng-model="$ctrl.author.title" class="form-control" placeholder="title" />
			</div>
			<div class="form-group">
				<textarea ng-model="$ctrl.author.bio" class="form-control" placeholder="A short description of yourself..."></textarea>
			</div>
		</form>
		<div ng-if="!$ctrl.edit">
		<div class="row">
				<div class="col-xs-6 col-xs-offset-3">
					<img class="img-responsive img-rounded" class="media-object" ng-src="{{$ctrl.author.imgUrl}}" alt="{{author.name}}">
				</div>
			</div>
		<div>
			<hr>
				<h2>{{$ctrl.author.name}}</h2>
				<div class="author-title">{{$ctrl.author.title}}</div>
			<hr>
		</div>
			<div class="text-left">
				<p>{{$ctrl.author.bio}}</p>
			</div>
		</div>
	</div>
</div>
	`,
	controller: function ($rootScope, User) {
		var $ctrl = this;
		function setAuthor(){
			if(USER_ID){
				User.find(USER_ID).then(function(author){
					$ctrl.author = author;
				})
			}
		}
		setAuthor();
		this.$onInit = function() {
			$ctrl.member = $rootScope.member;
    };
		
		$rootScope.$on('update', function(){
			$ctrl.member = $rootScope.member;
			if($ctrl.member){
				$ctrl.author = $rootScope.member;
			} else {
				setAuthor()
			}
		})
		
		$ctrl.updateInfo = ()=>{
			$rootScope.member.DSSave();
			$ctrl.edit = false;
		}

	}
}

let featuredPosts = {
	template: `
		<div class="sidebar-widget">
			<h3 class="sidebar-title">Featured Posts</h3>
			<div class="widget-container">
				<article class="widget-post" ng-repeat="post in $ctrl.posts">
					<div class="post-image">
						<a href="{{post.id}}"><img ng-src="{{post.imgUrl}}" width="100" alt="{{post.title}}"></a>
					</div>
					<div class="post-body">
						<h2><a href="{{post.id}}">{{post.title}}</a></h2>
						<div class="post-meta">
							<span><i class="fa fa-clock-o"></i>{{post.created | date}}</span> <span><a href="{{post.id}}"><i class="fa fa-comment-o"></i> {{post.comments.length || 0}}</a></span>
						</div>
					</div>
				</article>
			</div>
		</div>
	`,
	controller: function (Post) {
		let $ctrl = this;
		this.$onInit = function() {
			if(USER_ID){
				Post.findAll({authorId: USER_ID }).then(posts => { $ctrl.posts = posts.filter(p => p.featured) })
			}
		};
	}
}


let socialSide = {
	restrict: 'E',
	template: `
		<div class="sidebar-widget">
			<h3 class="sidebar-title">Socials</h3>
			<div class="widget-container">
				<div class="widget-socials">
					<social-links></social-links>
				</div>
			</div>
		</div>
	`,
	controller: () => {

	}
}

let tags = {
	template: `
		<div class="sidebar-widget">
			<h3 class="sidebar-title">Categories</h3>
			<div class="widget-container">
				<ul class="tags">
					<li><a class="tag" href="#">Design</a></li>
				</ul>
			</div>
		</div>
	`,
}

var sidebarModule = angular.module('sidebarModule', [])
	.component('sidebar', sidebar)
	.component('aboutMe', aboutMe)
	.component('featuredPosts', featuredPosts)
	.component('socialSide', socialSide)
	.component('tags', tags)
	


export {
sidebarModule
}