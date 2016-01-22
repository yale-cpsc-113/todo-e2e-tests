# CPSC113 Todo End-to-End Tests

The first three assignments in [CPSC113](https://cpsc113.som.yale.edu/) require
us to create a "social todo app". That is, an application wherein users can
create tasks that are shared with other users, allowing each user with whom
a task is shared to mark it as complete or incomplete.

This repository contains code that tests those assignments for the required
behavior. Those behaviors include user registration, authentication, and
task management. The tests are all in the file `test.js` in this repository.

The tests are written for [CasperJS](http://casperjs.org/),
a navigation scripting & testing utility for [PhantomJS](http://phantomjs.org/),
which is a [headless browser](https://en.wikipedia.org/wiki/Headless_browser)
based on [webkit](https://en.wikipedia.org/wiki/WebKit), the web layout engine
underneath browsers like Chrome and Safari. The tests in `test.js` are written
in JavaScript. They use the the CasperJS API in order to interact with a web
app to which you point it, testing whether that app conforms to the required
behavior for the CPSC113 social todo app. That behavior includes things like
registering new users, logging in, creating tasks, and managing tasks.

The tests are written in such a way that you can develop a your web app using
any technology stack you wish. You need only ensure that the user interface
contains the elements that the tests expect to find. For example, in `tests.js`,
the following lines appear

```javascript
casper.start(base_url, function() {
  test.assertDoesntExist(taskSelector, "has no tasks initially");
});
```

where we are testing that a new users has no tasks initially. The CasperJS
API is thoroughly described in the
[CasperJS documentation](http://docs.casperjs.org/en/latest/) and particularly
the [documentation for the tester module](http://docs.casperjs.org/en/latest/modules/tester.html).

## How to run these tests

In order to run these tests, you will need to
[install CasperJS](http://docs.casperjs.org/en/latest/installation.html),
[node](https://nodejs.org/en/), and the node.js dependencies described in the
`package.js` file. This will likely be easiest for you if you are using a Unix-like
machine. This could be a Mac, a computer in the Zoo cluster at Yale, or a
cloud VM like the free service [cloud9](http://c9.io). Once you have
CasperJS installed, you can run the tests as such

```
casperjs test test.js --base_url=YOUR_URL --includes=test-utils.js
```

So, if you are running your app on localhost port 5000, you'd run the following
command

```
casperjs test test.js --base_url='http://localhost:5000' --includes=test-utils.js
```

## What to expect

You should see output that looks something like the text below, but with prettier colors

```
$ casperjs test test.js --base_url='http://cpsc113-todo-sample.herokuapp.com' --includes=test-utils.js
Test file: test.js
# The landing page
PASS has the right title
PASS shows a login form
PASS shows a registration form form
PASS does not show a task list on login page
PASS does not show invalid email error
PASS does not show duplicate email error
PASS does not show invalid email error
# The login system
PASS prevents login of unrecognized user
PASS raises an error when user registers with name too short
PASS raises an error when user registers with name too long
PASS raises an error when user registers with email too short
PASS raises an error when user registers with email too long
PASS raises an error when user registers with password too short
PASS raises an error when user registers with password too long
PASS welcomes users by name after registration
PASS redirects to home page after logout
PASS denies registration if email already exists
PASS denies login with a bad password
# The task dashboard
PASS has no tasks initially
PASS has a task creation form for logged in users
PASS there are exactly 1 task(s) now
PASS each task has a title
PASS each task has an element to delete each task
PASS each task has an element to complete each task
PASS there are exactly 2 task(s) now
PASS each task has a title
PASS each task has an element to delete each task
PASS each task has an element to complete each task
PASS shows the title of added tasks
PASS shows none of the tasks are complete initially
PASS shows one of the tasks is complete after toggle
PASS shows none of the tasks is complete after re-toggle
PASS shows only one left after deletion
PASS shows none left after another deletion
# Task sharing
PASS there are 3 tasks for user[0]
PASS each has ability to delete
PASS there are 2 tasks for user[1]
PASS none can be deleted by user[1]
PASS all are shown incomplete initially
PASS one is shown as complete after toggle
PASS there is 1 task for user[2]
PASS none can be deleted by user[2]
PASS there are 3 tasks for user[0] still
PASS one is shown as complete
PASS there are none for user[0] after deletion
PASS there are no tasks for user[2] now
PASS 46 tests executed in 18.518s, 46 passed, 0 failed, 0 dubious, 0 skipped.
```

## Running the end-to-end tests on Cloud9

If you know how to install CapserJS on your computer and run the tests from
there you likely do not require our help in many regards. If you have no clue
how to do such a thing, we recommend that you use Cloud9, which will give you
an Ubuntu virtual machine in the cloud from which you can run tests. Once
you create a new workspace on cloud9, you can enter the following commands
to run the tests.

  npm install -g phantomjs
  npm install -g casperjs
  git clone https://github.com/yale-cpsc-113/todo-e2e-tests.git
  cd todo-e2e-tests.git
  npm install
  casperjs test test.js --includes=test-utils.js --base_url='http://cpsc113-todo-sample.herokuapp.com'

In the screencast below, I am showing how your output should look in a fresh
c9 instance. (At one point in that screencast I incorrectly ran `npm install -g`
instead of `npm install` and so the tests fail, which I then fix. Be not confused.)

[![asciicast](https://asciinema.org/a/dlfkznzni12ijlx9dr97fqlhf.png)](https://asciinema.org/a/dlfkznzni12ijlx9dr97fqlhf)
