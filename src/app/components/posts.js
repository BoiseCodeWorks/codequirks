import {USER_ID} from '../app.constants.js'

let postsList = {
    template: `
			<div class="row">
				<div class="col-xs-8 col-xs-offset-2">
					<article class="blog-post" ng-repeat="post in p.posts | filter: {hide: false}">
						<div class="blog-post-image">
							<a ng-link="[\'PostDetail'\, {id: post.id.substr(1)}]"><img class="img-responsive" src="{{post.imgUrl}}" alt="{{post.title}}"></a>
						</div>
						<div class="blog-post-body">
							<h2><a ng-link="[\'PostDetail'\, {id: post.id.substr(1)}]">{{post.title}}</a></h2>
							<div class="post-meta">
								<span>
									by <a href="#">{{post.author.name}}</a></span>/
									<span><i class="fa fa-clock-o"></i>{{post.created | date}}</span>/<span><i class="fa fa-comment-o"></i> {{post.comments.length}}
								</span>
							</div>
							<p markdown-to-html="post.body.split(' ').slice(0, 45).join(' ')">...</p>
							<div class="read-more"><a ng-link="[\'PostDetail'\, {id: post.id.substr(1)}]">Continue Reading</a></div>
						</div>
					</article>
				</div>
		`,
    controller: ['Post', function(Post) {
        var $ctrl = this;

        this.$onInit = function() {
            if (USER_ID) {
                Post.findAll({ authorId: USER_ID }).then(posts => { $ctrl.posts = posts })
            }
        };

    }],
    controllerAs: 'p'
}

let posts = {
    template: `
		<ng-outlet></ng-outlet>
	`,
    $routeConfig: [
        { path: '/', name: 'PostsList', component: 'postsList', useAsDefault: true },
        { path: ':id', name: 'PostDetail', component: 'postDetail' }
    ]
}

let postsModule = angular.module('posts', [])
    .component('posts', posts)
    .component('postsList', postsList)
    .component('postDetail', {
        template: `
			<article class="blog-post">
				<div class="blog-post-image text-center">
					<img ng-src="{{$ctrl.post.imgUrl}}" alt="{{$ctrl.post.title}}">
				</div>
				<div class="blog-post-body">
					<h2><a>{{$ctrl.post.title}}</a></h2>
					<div class="post-meta">
						<span>by <a href="#">{{$ctrl.post.author.name}}</a></span>/
						<span><i class="fa fa-clock-o"></i>{{$ctrl.post.created | date}}</span>/
						<span><i class="fa fa-comment-o"></i> <a href="#comments">{{$ctrl.post.comments.length || 0}}</a></span>
					</div>
					<div class="blog-post-text" markdown-to-html="$ctrl.post.body"></div>
				</div>
			</article>
		`,
        controller: ['Post', function(Post) {
            let $ctrl = this
            this.$routerOnActivate = function(next) {
                var id = '/' + next.params.id;
                if (id) {
                    Post.find(id).then(post => { $ctrl.post = post });
                } else {
                    $ctrl.post = { title: '', body: '', meta: '' }
                }
                window.scroll ? window.scroll(0, 0) : '';
            };
        }],
        bindings: {
            id: '<'
        }
    })

export {
postsModule
}