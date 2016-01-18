var base_url = casper.cli.options.base_url;

var users = [makeUser(), makeUser(), makeUser(), makeUser()];

casper.test.begin('Todo app authentication', 5, function suite(test) {

  var registerFormSelector = 'form[action="/user/register"]';
  var loginFormSelector = 'form[action="/user/login"]';

  casper.start(base_url, function() {
    test.assertTitle("CPSC113 Todo", "title was as expected");
  });

  casper.thenOpen(base_url, function() {
    test.assertExists(loginFormSelector, "login form is found");

    // User that should not exist
    var user = users[0];
    this.fill(loginFormSelector, {
      email: user.email,
      password: user.password
    }, true);
  });

  casper.then(function(){
      test.assertTextExists('Invalid email address', 'prevents login of unrecognized user');
  });

  function registerCallback(user){
    return function(){
      // User that should not exist yet
      this.fill(registerFormSelector, {
        fl_name: user.fl_name,
        email: user.email,
        password: user.password,
        password_confirmation: user.password
      }, true);
    }
  }

  casper.thenOpen(base_url, function() {
    test.assertExists(registerFormSelector, "registration form is found");
  });

  casper.thenOpen(base_url, registerCallback(users[0]));

  casper.then(function(){
    test.assertUrlMatch('/dashboard/', 'user goes to dashboard after registration');
  });

  casper.thenOpen('/user/logout', function(){
    this.capture('foo.png');
    test.assertUrlMatch(/^\/$/);
  })


  casper.run(function() {
    test.done();
  });
});
