const Controller = require('./controller');
const Payment = require('app/model/Payment');

class UserController extends Controller {
  index(req, res, next) {
    res.render('home/panel/index', { title: 'پنل کاربری', user: req.user }); 
  }

  async history(req, res, next) {
    const payments = await Payment.find({ user: req.user._id }).populate('product');

    res.render('home/panel/history', { title: 'پنل کاربری', payments})
  }

  async vip(req, res, next) {
    try {
      return res.render('home/panel/vip');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();