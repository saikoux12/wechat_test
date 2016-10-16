 var User = require('../models/user')
 //signup

exports.showSignup = function *(next){
   yield this.render('pages/signup',{
        title: '注册页面'
    })
}

exports.showSignin = function *(next){
   yield this.render('pages/signin',{
        title: '登录页面'
    })
}

exports.signup = function *(next){
    var _user = this.request.body.user;
    var user = yield User.findOne({name:_user.name}).exec();
    if(user){
        this.redirect('pages/signin');
    }else{
        user = new User(_user);
        yield user.save()
        this.session.user = user;
        this.redirect('/');
    }
}
    //signin
exports.signin =  function *(next){
    var _user = this.request.body.user;
    var name = _user.name;
    var password = _user.password;
    var user = yield User.findOne({name: name}).exec();
    if(!user){
        this.redirect('/signin');
        return next;
    }
    var isMatch = yield user.comparePassword(password,user.password);
    if(isMatch){
         console.log('password right');
         this.session.user = user;

         this.redirect('/');
     }else{
         this.redirect('/signin');
        console.log('password wrong');
     }
}

// logout
exports.logout =  function *(next){
    delete this.session.user;
    // delete app.locals.user;
    this.redirect('/');
}

//user list
exports.list = function *(next){
    var users = yield User.find({})
      .sort('meta.updateAt')
      .exec();
    yield this.render('pages/userlist',{
        title: '用户列表',
         users: users
    })
}

exports.signinRequired = function *(next){
    var user = this.session.user;
    if(!user){
        this.redirect('pages/signin');
    }else{
        yield next
    }
}

exports.adminRequired = function *(next){
    var user = this.session.user;
    if(user.role <= 10){
        this.redirect('pages/signin');
    }else{
        yield next
    }
}


