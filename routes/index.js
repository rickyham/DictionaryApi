
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Keeptionary' , description: 'Building a better Dictionary'});
};