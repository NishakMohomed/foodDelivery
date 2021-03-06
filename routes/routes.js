const homeController = require('../controllers/homeController');
const feedbackController = require('../controllers/feedbackController');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/admin/adminController');
const productController = require('../controllers/admin/productController');
const analyticsController = require('../controllers/admin/analyticsController');
const promoController = require('../controllers/admin/promoController');
const employeeControllerAdmin = require('../controllers/admin/employeeController');
const settingsController = require('../controllers/admin/settingsController');
const statusController = require('../controllers/employee/statusController');
const employeeController = require('../controllers/employee/employeeController');
const empSettingsController = require('../controllers/employee/empSettingsController');

//Middlewares

const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const employeeAuth = require('../middlewares/employeeAuth');
const upload = require('../middlewares/fileUpload');
const employeePicUpload = require('../middlewares/employeePicUpload');

function initRoutes(app) {
    app.get('', homeController().index);

    app.get('/login', guest, authController().login);
    
    app.post('/signin', authController().postLogin);
    
    app.get('/register', guest, authController().register);

    app.post('/signup', authController().postRegister);

    app.post('/logout', authController().logout);

    app.post('/submitReview', feedbackController(). postFeedback);

    app.get('/cart', cartController().cart);

    app.post('/update-cart', cartController().update);

    app.get('/mission', homeController().mission);

    app.get('/faq', homeController().faq);


    //Customer route

    app.post('/orders', auth, orderController().store);

    app.get('/customer/viewOrders', auth, orderController().index);

    app.get('/viewOrders/orderstatus/:id', auth, orderController().show);


    //Admin route

    app.get('/admin/dashboard', adminAuth, adminController().dashboard);

    app.get('/admin/orders', adminAuth, adminController().orders);

    app.get('/admin/products', adminAuth, productController().index);

    app.get('/products/productUpdate/:id', adminAuth, productController().product);

    app.get('/products/addProducts', adminAuth, productController().addProduct);

    app.post('/addProduct/new', upload.single('image'), adminAuth, productController().store);

    app.post('/productUpdate/update/:id', upload.single('image'), adminAuth, productController().update);

    app.get('/products/productDelete/:id', adminAuth, productController().delete);

    app.get('/admin/analytics', adminAuth, analyticsController().index);

    app.get('/admin/promotions', adminAuth, promoController().index);

    app.post('/promotions/send', adminAuth, promoController().sendPromo);

    app.get('/admin/employees', adminAuth, employeeControllerAdmin().index);

    app.get('/employees/addEmployee', adminAuth, employeeControllerAdmin().addEmployee);

    app.post('/addEmployee/new', employeePicUpload.single('image'), adminAuth, employeeControllerAdmin().store);

    app.get('/employees/employeeUpdate/:id', adminAuth, employeeControllerAdmin().employee);

    app.post('/employeeUpdate/update/:id', employeePicUpload.single('image'), adminAuth, employeeControllerAdmin().update);

    app.get('/employees/employeeDelete/:id', employeePicUpload.single('image'), adminAuth, employeeControllerAdmin().delete);

    app.get('/admin/settings', adminAuth, settingsController().index);

    app.get('/settings/account/:id', adminAuth, settingsController().settings);

    app.post('/adminSettings/update/:id', adminAuth, settingsController().accUpdate);

    app.get('/settings/password/:id', adminAuth, settingsController().password);

    app.post('/adminSettings/password/:id', adminAuth, settingsController().passwordUpdate);


    //Employee

    app.get('/employee/dashboard', employeeAuth, employeeController().index);

    app.get('/employee/orders', employeeAuth, employeeController().orders);

    app.post('/orders/status', employeeAuth, statusController().update);

    app.get('/employee/settings', employeeAuth, empSettingsController().index);

    app.get('/empSettings/account/:id', employeeAuth, empSettingsController().account);

    app.get('/empsettings/password/:id', employeeAuth, empSettingsController().password);

    app.post('/account/update/:id', employeeAuth, empSettingsController().accountUpdate);

    app.post('/password/update/:id', employeeAuth, empSettingsController().passwordUpdate);
}


module.exports = initRoutes;