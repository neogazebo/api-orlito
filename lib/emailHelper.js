'use strict'

const aws = require('aws-sdk');
aws.config.update({region: "us-east-1"});
const config_params = require('../config/params');

const ses = new aws.SES();
const s3 = new aws.S3();

exports.sendMail = (content, destination) => {

    s3.getObject({Bucket: config_params.S3Bucket, Key: config_params.TemplateEmailKey}, (err, data) => {
        if (err) throw err
        else 
        {
            let templateBody = data.Body.toString();
            
            let mark = require('markup-js');

            let context = {link : config_params.HomeUrl +'/activate/' + content};
            
            let message = mark.up(templateBody, context);

            let params = { 
                Destination: {
                    ToAddresses: [
                        destination
                    ]
                },
                Message: {
                    
                    Subject: {
                        Data: 'Orlito Activation',
                        Charset: 'UTF-8'
                    },
                    Body:{
                        Html: {
                            Data: message,
                            Charset: 'UTF-8'
                        }
                    }
                },
                Source: 'neogazebo@gmail.com',
            };

            ses.sendEmail(params,  (err, data) => {
                if (err) {
                    throw err
                } else {
                    console.log(data);
                }
            });

        }
    });
}