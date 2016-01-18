var base_url = casper.cli.options.base_url;

var users = [makeUser(), makeUser(), makeUser(), makeUser()];

casper.test.begin('Todo app authentication', 6, function suite(test) {

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

  var logoutUrl = base_url + '/user/logout';
  casper.thenOpen(logoutUrl, function(){
    test.assertUrlMatch(base_url, 'logout redirects to home page');
  })

  casper.thenOpen(base_url, registerCallback(users[1]));
  casper.thenOpen(logoutUrl);
  casper.thenOpen(base_url, registerCallback(users[2]));

  casper.run(function() {
    test.done();
  });
});

casper.test.begin('Task creation', 3, function suite(test) {


  var newTodoFormSelector = 'form[action="/task/create"]';
  var todoSelector = 'li.task';
  casper.start(base_url, function() {
    test.assertDoesntExist(todoSelector, "tasks are empty initially as expected");
  });

  // User #2 should still be logged in here and should therefore
  // go to the dashboard automatically.
  casper.thenOpen(base_url, function() {
    test.assertExists(newTodoFormSelector, "todo creation form found");
    var task = makeTask();
    this.fill(newTodoFormSelector, {
      title: task.title,
      description: task.description
      // shared_with: [user[0].email, user[1].email].join(', '),
    }, true);
  });

  casper.thenOpen(base_url, function() {
    test.assertExists(newTodoFormSelector, "there is now a task");
  });


  casper.run(function() {
    test.done();
  });
});
