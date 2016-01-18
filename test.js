var base_url = casper.cli.options['base_url'];

casper.test.begin('Todo app authentication', 5, function suite(test) {
  casper.start(base_url, function() {
    test.assertTitle("Google", "google homepage title is the one expected");
    test.assertExists('form[action="/search"]', "main form is found");
    this.fill('form[action="/search"]', {
      q: "casperjs"
    }, true);
  });

  casper.then(function() {
    test.assertTitle("casperjs - Recherche Google", "google title is ok");
    test.assertUrlMatch(/q=casperjs/, "search term has been submitted");
    test.assertEval(function() {
      return __utils__.findAll("h3.r").length >= 10;
    }, "google search for \"casperjs\" retrieves 10 or more results");
  });

  casper.run(function() {
    test.done();
  });
});
