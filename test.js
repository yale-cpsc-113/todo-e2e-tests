var base_url = casper.cli.options.base_url;

casper.test.begin('Todo app authentication', 4, function suite(test) {
  casper.start(base_url, function() {
    test.assertTitle("CPSC113 Todo", "title was as expected");
  });
  casper.thenOpen(base_url, function() {
    var loginFormPath = 'form[action="/user/login"]';
    test.assertExists(loginFormPath, "login form is found");

    // User that should not exist
    var user = makeUser();
    this.fill(loginFormPath, {
      email: user.email,
      password: user.password
    }, true);
  });

  casper.then(function(){
      test.assertTextExists('Invalid email address', 'prevents login of unrecognized user');
  });

  casper.thenOpen(base_url, function() {
    var registerFormPath = 'form[action="/user/register"]';
    test.assertExists(registerFormPath, "registration form is found");

    // User that should not exist
    var user = makeUser();
    this.fill(registerFormPath, {
      fl_name: user.name,
      email: user.email,
      password: user.password,
      password_confirmation: user.password_confirmation
    }, true);
  });


  casper.run(function() {
    test.done();
  });
});
