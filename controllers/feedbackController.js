const User = require('../model/user');
const Feedback = require('../model/feedback');

function feedbackController(){

    return{
        async postFeedback(req, res){

            if(req.user){
    
                //Get the account first name
               const userId = req.user.id;
               let firstName = await User.findOne({_id: userId}).exec();
               
       
               //Validate the data before submitting the review
               const {feedback} = req.body;
               if(!feedback){
                   req.flash('error', 'Feedback is required!');
                   req.flash('feedback', feedback);
                   return res.redirect('/#review');
               }

               if(feedback.length < 8 ){
                req.flash('error', 'Please provide your feedback in minimum 8 and  maximum 60 characters!');
                req.flash('feedback', feedback);
                return res.redirect('/#review');
               }
       
               //Add the feedback to the db
               const review = new Feedback({
                   fname: firstName.fname,
                   feedback: req.body.feedback
               });
               
               review.save().then((review) => {
                   return res.redirect('/');
               }).catch(err => {
                   req.flash('error', 'Something went wrong');
                   return res.redirect('/#review');
       
               });
       
           }
           else{
               req.flash('error', 'Please signin to send feedback');
               return res.redirect('/#review');
           }
    
        }

    }

}


module.exports = feedbackController;