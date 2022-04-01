const MessageQueue = require('../models/MessageQueue')
const Notifications = require('../models/Notifications')
const OutboundQueries = require('../models/OutboundQueries')
const asyncWrapper = require('../middleware/async')
const os = require('os');
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient({ authorizationToken: "pk_test_A926RZ0R7PMYFVPXEWVA4Q26KZ0S" });

const createNotification = asyncWrapper(async (req, res) => {
  const requestData = req.body;

  const notification = await insertNotification(requestData);
  // console.log("Notification ID:" + notification.id);


  const recipients = getRecipients(requestData.recipientsData.content)
  // console.log("RECIPIENTS : " + recipients);
  
  await Promise.all(recipients.map(async (element) => {
    let data = element.split(',');
    if (data[0] !== "")
    {
      let messageQueueResponse = await insertMessageQueue(notification.id, requestData, data[1], data[0]);
      // console.log(messageQueueResponse)

      var inputRequest = getCourierRequest(data[0], requestData.templateId, requestData.channels)
      var courierReq = JSON.stringify(inputRequest);
      // console.log(courierReq)

      let OutboundQueriesResp = await insertOutboundQueries(1, "IN", courierReq, true, 200)
      //  console.log(OutboundQueriesResp);

      // call courier api
      await (courier.send(inputRequest).then(response => {
        let OutboundQueriesRespOut = insertOutboundQueries(1, "OUT", JSON.stringify(response), true, 200);
      })).catch(err => console.log(err))
    }
     
  }));

  res.status(201).json({ "message" : `Notification sent!`})
});


function insertNotification(requestData)
{
  var notificationObj = {
    templateId: requestData.templateId,
    messageContent: "Test Notification",
  };

  return Notifications.create(notificationObj)
}

function getRecipients(content)
{
  const buff = Buffer.from(content, 'base64');
  const str = buff.toString('utf-8');
  return str.split(os.EOL);
}

function insertMessageQueue(notificationId, requestData, recipientEmail, recipientPhone)
{
  var messageObj = {
    notificationId: notificationId,
    status: true,
    channel: requestData.channels,
    senderEmail: requestData.senderEmail,
    senderPhone: requestData.senderPhone,
    senderName: requestData.senderName,
    recipientPhone: recipientPhone,
    recipientEmail: recipientEmail
  };

  return MessageQueue.create(messageObj).catch(err => console.log(err));
}

function getCourierRequest(email, templateId, channels)
{
  return {
    message: {
      to: {
        email: email,
      },
      template: templateId,
      data: {
      },
      routing: {
          method: "all",
          channels: channels
      }
    },
  };
}

function insertOutboundQueries(messageId, type, data, status, httpResponseCode)
{
  var outbountRequestObj = {
    messageId: messageId,
    type: type,
    data: data,
    status: status,
    httpResponseCode: httpResponseCode,
    requestTime: Date.now().toString(),
    responseTime: Date.now().toString()
  }

  return OutboundQueries.create(outbountRequestObj)
}


module.exports = {
  createNotification,
}
