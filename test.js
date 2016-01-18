var base_url = casper.cli.options.base_url;

function makeid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

casper.test.begin('Todo app authentication', 3, function suite(test) {
  casper.start(base_url, function() {
    test.assertTitle("CPSC113 Todo", "title was as expected");
    var loginFormPath = 'form[action="/user/login"]';
    test.assertExists(loginFormPath, "login form is found");

    // User that should not exist
    var user = {
      password: makeid(10),
      email: makeid(5) + '@yale.edu'
    };
    this.fill(loginFormPath, {
      email: user.email,
      password: user.password
    }, true);
  });
  casper.then(function(){
      test.assertTextExists('Invalid email address', 'notices invalid user');
  })


  casper.run(function() {
    test.done();
  });
});
