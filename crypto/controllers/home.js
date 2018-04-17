exports.index = function(req, res) {
    // Get session cookies
    cookies = req.cookies;
    
    // If cookie exists render control panel
    res.render('home', {
      title: 'Home',
      id: cookies["id"],
      secret: cookies["secret"]
    });
}
