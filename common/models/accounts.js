'use strict';

const path = require('path');
const qs = require('querystring');
const ip = require('ip');

const loopback = require("loopback");

const senderAddress = "htaptit@gmail.com"

module.exports = function(Accounts) {
    Accounts.afterRemote('create', function(context, user, next) {
        var options = {
          type: 'email',
          to: user.email,
          from: senderAddress,
          subject: 'Thanks for registering.',
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          redirect: '/verified',
          user: user
        };
    
        user.verify(options, function(err, response) {
          if (err) {
            Accounts.deleteById(user.id);
            return next(err);
          }
          
          context.res.render('response', {
            title: 'Signed up successfully',
            content: 'Please check your email and click on the verification link ' +
                'before logging in.',
            redirectTo: '/',
            redirectToLinkText: 'Log in'
          });
        });
      });
      
      // Method to render
      Accounts.afterRemote('prototype.verify', function(context, user, next) {
        context.res.render('response', {
          title: 'A Link to reverify your identity has been sent '+
            'to your email successfully',
          content: 'Please check your email and click on the verification link '+
            'before logging in',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });
    
      //send password reset link when requested
      Accounts.on('resetPasswordRequest', function(info) {
        // var url = 'http://' + config.host + ':' + config.port + '/reset-password';
        var url = 'http://192.168.0.252:3000/reset-password';
        var html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';
    
        Accounts.app.models.Email.send({
          to: info.email,
          from: senderAddress,
          subject: 'Password reset',
          html: html
        }, function(err) {
          if (err) return console.log('> error sending password reset email');
          console.log('> sending password reset email to:', info.email);
        });
      });
    
      //render UI page after password change
      Accounts.afterRemote('changePassword', function(context, user, next) {
        context.res.render('response', {
          title: 'Password changed successfully',
          content: 'Please login again with new password',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });
    
      //render UI page after password reset
      Accounts.afterRemote('setPassword', function(context, user, next) {
        context.res.render('response', {
          title: 'Password reset success',
          content: 'Your password has been reset successfully',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });
};
