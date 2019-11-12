const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient();
const ses = new aws.SES();
aws.config.update({ region: "us-east-1" });
const uuid = require("uuid/v4");

exports.handler = (event, context, callback) => {
  var searchParams = {
    TableName: "testLambda",
    Key: {
      id: event.Records[0].Sns.Message
    }
  };
  /* first we get the item from dynamo and check if email exists
    if does not exist put the item and send an email,
    */
  dynamo.get(searchParams, function(error, data1) {
    if (error) {
      console.log("Error in get", error);
    } else {
      console.log("Success in get", data1);
      console.log(JSON.stringify(data1));
      let isPresent = false;
      if (data1.Item == null || data1.Item == undefined) {
        isPresent = false;
      } else {
        /*
          if email exists check if ttl > currentTime,
          if ttl is greater than current time do nothing,
          else send email
        */
        if (data1.Item.ttl > new Date().getTime()) {
          isPresent = true;
        }
      }
      if (!isPresent) {
        let currentTime = new Date().getTime();
        let ttl = 30 * 60 * 1000;
        let expiry = currentTime + ttl;
        var params = {
          Item: {
            id: event.Records[0].Sns.Message,
            token: uuid(),
            ttl: expiry
          },
          TableName: "testLambda"
        };

        dynamo.put(params, function(error, data) {
          if (error) {
            console.log("Error", error);
          } else {
            console.log("Success", data);
            var emailParams = {
              Destination: {
                /* required */
                ToAddresses: [
                  "dedhia.j@husky.neu.edu"
                  /* more items */
                ]
              },
              Message: {
                /* required */
                Body: {
                  Text: {
                    Charset: "UTF-8",
                    Data: "hello"
                  }
                },
                Subject: {
                  Charset: "UTF-8",
                  Data: "Your list of recipes"
                }
              },
              Source: "no-reply@dev.ishitasequeira.me" /* required */
            };
            var sendPromise = ses.sendEmail(emailParams).promise();
            sendPromise
              .then(function(data) {
                console.log(data);
              })
              .catch(function(err) {
                console.error(err, err.stack);
              });
          }
        });
      } else {
        console.log("Item already present!!!");
      }
    }
  });
};
