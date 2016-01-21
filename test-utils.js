var chance = require('chance').Chance();

function makeid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeUser(overloads){
  var user = {
    email: chance.email(),
    password: makeid(10),
    fl_name: chance.name(),
    description: null
  };
  // Write over those random defaults if we're told to do so
  for(var key in user){
    if (overloads && overloads.hasOwnProperty(key)) {
      user[key] = overloads[key];
    }
  }
  return user;
}

function makeTask(collaborator1, collaborator2, collaborator3){
  return {
    title: chance.sentence(),
    description: chance.paragraph(),
    collaborator1: collaborator1,
    collaborator2: collaborator2,
    collaborator3: collaborator3
  };
}
