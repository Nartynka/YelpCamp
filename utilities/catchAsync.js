//wrap async func with try..catch
module.exports = func => (req, res, next) => {
	func(req, res, next).catch(next);
};
