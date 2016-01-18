var base_url = casper.cli.options.base_url;

var users = [makeUser(), makeUser(), makeUser()];

casper.test.begin('Todo app authentication', 5, function suite(test) {

  casper.start(base_url, function() {
    test.assertTitle("CPSC113 Todo", "title was as expected");
  });

  casper.thenOpen(base_url, function() {
    var loginFormPath = 'form[action="/user/login"]';
    test.assertExists(loginFormPath, "login form is found");

    // User that should not exist
    var user = users[0];
    this.fill(loginFormPath, {
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
      this.echo(user.name);
      this.fill(registerFormPath, {
        fl_name: user.fl_name,
        email: user.email,
        password: user.password,
        password_confirmation: user.password
      }, true);
    }
  }

  casper.thenOpen(base_url, function() {
    var registerFormPath = 'form[action="/user/register"]';
    test.assertExists(registerFormPath, "registration form is found");
  });

  casper.thenOpen(base_url, registerCallback(users[0]));

  casper.then(function(){
    test.assertUrlMatch('/dashboard/', 'user goes to dashboard after registration');
  });


  casper.run(function() {
    test.done();
  });
});
