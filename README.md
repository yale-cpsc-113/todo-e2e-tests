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
cloud VM like the free service [cloud9](http://c9.io). 
