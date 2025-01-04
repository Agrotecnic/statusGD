const debug = (req, res, next) => {
    console.log('\n=== Debug Info ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('View Engine:', req.app.get('view engine'));
    console.log('Views Path:', req.app.get('views'));
    console.log('================\n');
    next();
};

module.exports = debug;
