
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: 'us-east-1' });


exports.handler = (event, context, callback) => {
    var params = {
        Item: {
          id: event.Records[0].Sns.MessageId,
          message: event.Records[0].Sns.Message
        },
        TableName: 'testLambda'
      };
      
      dynamo.put(params, function(error, data) {
        if(error) {
          console.log("Error", error);
        } else {
          console.log("Success", data);
        }
      });
      
};