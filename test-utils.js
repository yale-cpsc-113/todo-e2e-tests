var chance = require('chance').Chance();

function makeid(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeUser(){
  return {
    email: chance.email(),
    password: makeid(10),
    fl_name: chance.name()
  }
};

function makeTask(){
  return {
    title: chance.sentence(),
    description: chance.paragraph()
  }
};
