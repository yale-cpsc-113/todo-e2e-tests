/*
 * "End to end" test script for the social todo application that we
 * are building in Yale's CPSC113 in the Spring of 2016. This script
 * interacts with your application's user iterface, checking that
 * it behaves in the way we expect.
 */


// CONFIGURATION ---------------
var base_url = casper.cli.options.base_url;
var logoutUrl = base_url + '/user/logout';
var taskSelector = '.tasks-list-item';
var taskListSelector = '.tasks-list';
var errors = {
  invalidEmail: 'Invalid email address',
  duplicateEmail: 'Account with this email already exists!',
  invalidPassword: 'Invalid password'
};
var registerFormSelector = 'form[action="/user/register"]';
var loginFormSelector = 'form[action="/user/login"]';
var newTodoFormSelector = 'form[action="/task/create"]';

var tooLongString = (new Array(52)).join('x');

// Make random users.
var users = [makeUser(), makeUser(), makeUser(), makeUser()];
var badUsers = [
  makeUser({fl_name: '', description: 'name too short'}),
  makeUser({fl_name: tooLongString, description: 'name too long'}),
  makeUser({email: '', description: 'email too short'}),
  makeUser({email: tooLongString + '@yale.edu', description: 'email too long'}),
  makeUser({password: '', description: 'password too short'}),
  makeUser({password: tooLongString, description: 'password too long'}),
];


// Make random tasks, the first two of which are shared with certain
// other users.
var tasks = [
  makeTask(users[1].email),
  makeTask(users[1].email, users[2].email),
  makeTask()
];


// HELPER FUNCTIONS ---------------

// Returns a function that will log in a particular user
// assuming that we are on the homepage of the app.
function makeLoginCallback(user, password){
  return function(){
    if (typeof(password) === 'undefined') {
      password = user.password;
    }
    this.fill(loginFormSelector, {
      email: user.email,
      password: password
    }, false);
    this.click('.log-in-submit');
  };
}

// Returns a function that will register a particular user
// assuming that we are on the homepage of the app.
function makeRegisterCallback(user, password){
  if (typeof(password) === 'undefined') {
    password = user.password;
  }
  return function(){
    this.fill(registerFormSelector, {
      fl_name: user.fl_name,
      email: user.email,
      password: password,
      password_confirmation: password
    }, false);
    this.click('.sign-up-submit');
  };
}

// Returns a function that will add a task assuming
// we are on the task dashboard and there is a task addition form.
function getNewTaskCallback(task){
  return function(){
    casper.thenOpen(base_url, function() {
      this.fill(newTodoFormSelector, {
        title: task.title,
        description: task.description,
        collaborator1: task.collaborator1,
        collaborator2: task.collaborator2,
        collaborator3: task.collaborator3,
      }, true);
    });
  };
}

// Return a function that tests whether the dashboard has
// the right number of tasks.
function testTaskList(test, taskCount, tasksComplete){
  return function(){
    test.assertElementCount(taskSelector, taskCount, "there are exactly " + taskCount + " task(s) now");
    test.assertElementCount(taskSelector + ' span.task-title', taskCount, "each task has a title");
    test.assertElementCount(taskSelector + ' .delete-task', taskCount, "each task has an element to delete each task");
    test.assertElementCount(taskSelector + ' .toggle-task', taskCount, "each task has an element to complete each task");
  };
}



// TESTING THE LANDING PAGE ---------------
casper.test.begin('The landing page', 7, function suite(test) {
    casper.start(base_url, function() {
      test.assertTitle("CPSC113 Todo", "has the right title");
      test.assertExists(loginFormSelector, "shows a login form");
      test.assertExists(registerFormSelector, "shows a registration form form");
      test.assertDoesntExist(taskListSelector, "does not show a task list on login page");
      test.assertTextDoesntExist(errors.invalidEmail, 'does not show invalid email error');
      test.assertTextDoesntExist(errors.duplicateEmail, 'does not show duplicate email error');
      test.assertTextDoesntExist(errors.invalidEmail, 'does not show invalid email error');
    });
    casper.run(function() {
      test.done();
    });
});


// TESTING THE LOGIN SYSTEM ---------------
casper.test.begin('The login system', 11, function suite(test) {

  // Try to log in without registering
  casper.start(base_url, makeLoginCallback(users[0]));
  casper.then(function(){
      test.assertTextExists(errors.invalidEmail, 'prevents login of unrecognized user');
  });

  for (var i = 0; i < badUsers.length; i++) {
    var user = badUsers[i];
    (function(user){
      casper.thenOpen(base_url, makeRegisterCallback(user));
      casper.then(function(){
        test.assertElementCount('.validation-error', 1, 'raises an error when user registers with ' + user.description);
      });
      casper.thenOpen(logoutUrl);
    }(user));
  }

  // Now register and see if we are appropriately welcomed
  casper.thenOpen(base_url, makeRegisterCallback(users[0]));
  casper.then(function(){
    test.assertTextExists('Welcome, ' + users[0].fl_name.split(' ')[0], 'welcomes users by name after registration');
  });

  // Logout and see that we go back to the home page
  casper.thenOpen(logoutUrl, function(){
    test.assertUrlMatch(base_url, 'redirects to home page after logout');
  });

  // Try to register the same user again and ensure we get an error message
  casper.thenOpen(base_url, makeRegisterCallback(users[0]));
  casper.then(function(){
    test.assertTextExists(errors.duplicateEmail, 'denies registration if email already exists');
  });

  // Try to log in with the wrong password and ensure we get an error message
  casper.thenOpen(base_url, makeLoginCallback(users[0], users[0].password + 'blah'));
  casper.then(function(){
    test.assertTextExists(errors.invalidPassword, 'denies login with a bad password');
  });

  // Register the next user and then immediately log out
  casper.thenOpen(base_url, makeRegisterCallback(users[1]));
  casper.thenOpen(logoutUrl);

  // Register the next user
  casper.thenOpen(base_url, makeRegisterCallback(users[2]));

  // Logout
  casper.thenOpen(logoutUrl);

  casper.run(function() {
    test.done();
  });
});


// TESTING TASK DASHBOARD ---------------
casper.test.begin('The task dashboard', 16, function suite(test) {

  // Log in
  casper.start(base_url, makeLoginCallback(users[0]));

  // Ensure there are no tasks
  casper.then(function() {
    test.assertDoesntExist(taskSelector, "has no tasks initially");
  });

  // User #2 should still be logged in here and should therefore
  // go to the dashboard automatically.
  casper.thenOpen(base_url, function() {
    test.assertExists(newTodoFormSelector, "has a task creation form for logged in users");
  });

  // Add a task and test that there is exactly one in the dashboard
  casper.thenOpen(base_url, getNewTaskCallback(tasks[0]));
  casper.thenOpen(base_url, testTaskList(test, 1));

  // Add another task and test that it shows up.
  casper.thenOpen(base_url, getNewTaskCallback(tasks[1]));
  casper.thenOpen(base_url, testTaskList(test, 2));

  // Test that title of added tasks are shown
  casper.then(function(){
    test.assertTextExists(tasks[0].title, 'shows the title of added tasks');
  });

  // Test that none of the tasks are complete
  casper.then(function(){
    test.assertElementCount('.complete-task', 0, 'shows none of the tasks are complete initially');
  });

  // Toggle a task and test if one shows up as complete
  casper.thenClick('.toggle-task', function(){
    test.assertElementCount('.complete-task', 1, 'shows one of the tasks is complete after toggle');
  });

  // Toggle it bask and ensure it is no longer complete
  casper.thenClick('.complete-task .toggle-task', function(){
    test.assertElementCount('.complete-task', 0, 'shows none of the tasks is complete after re-toggle');
  });

  // Delete the tasks and ensure they are disappearing from the interface
  casper.thenClick('.delete-task', function(){
    test.assertElementCount(taskSelector, 1, 'shows only one left after deletion');
  });
  casper.thenClick('.delete-task', function(){
    test.assertElementCount(taskSelector, 0, 'shows none left after another deletion');
  });

  // Logout
  casper.thenOpen(logoutUrl);

  casper.run(function() {
    test.done();
  });
});

// TESTING TASK DASHBOARD ---------------
casper.test.begin('Task sharing', 12, function suite(test) {

  // Log in
  casper.start(base_url, makeLoginCallback(users[0]));

  // Add a task and test that there is exactly one in the dashboard
  for (var i = 0; i < tasks.length; i++) {
    casper.thenOpen(base_url, getNewTaskCallback(tasks[i]));
  }
  casper.then(function(){
    test.assertElementCount(taskSelector, 3, "there are 3 tasks for user[0]");
    test.assertElementCount(taskSelector + ' .delete-task', 3, "each has ability to delete");
  });

  // Logout
  casper.thenOpen(logoutUrl);

  // Log in user[1]
  casper.thenOpen(base_url, makeLoginCallback(users[1]));
  casper.then(function(){
    test.assertElementCount(taskSelector, 2, "there are 2 tasks for user[1]");
    test.assertElementCount(taskSelector + ' .delete-task', 0, "none can be deleted by user[1]");
    test.assertElementCount(taskSelector + ' .complete-task', 0, 'all are shown incomplete initially');
  });
  // Toggle a task and test if one shows up as complete
  casper.thenClick(taskSelector + ' .toggle-task', function(){
    test.assertElementCount('.complete-task', 1, 'one is shown as complete after toggle');
  });
  casper.thenOpen(logoutUrl);

  // Log in user[2]
  casper.thenOpen(base_url, makeLoginCallback(users[2]));
  casper.then(function(){
    test.assertElementCount(taskSelector, 1, "there is 1 task for user[2]");
    test.assertElementCount(taskSelector + ' .delete-task', 0, "none can be deleted by user[2]");
  });
  casper.thenOpen(logoutUrl);

  // Log in user[0] again
  casper.thenOpen(base_url, makeLoginCallback(users[0]));
  casper.then(function(){
    test.assertElementCount(taskSelector, 3, "there are 3 tasks for user[0] still");
    test.assertElementCount(taskSelector + '.complete-task', 1, 'one is shown as complete');
  });
  casper.then(function(){
    this.repeat(3, function(){
      this.click(taskSelector + ' .delete-task');
    });
  });
  casper.then(function(){
    test.assertElementCount(taskSelector, 0, "there are none for user[0] after deletion");
  });
  casper.thenOpen(logoutUrl);

  // Log in user[2]
  casper.thenOpen(base_url, makeLoginCallback(users[2]));
  casper.then(function(){
    test.assertElementCount(taskSelector, 0, "there are no tasks for user[2] now");
  });
  casper.thenOpen(logoutUrl);

  casper.run(function() {
    test.done();
  });
});
