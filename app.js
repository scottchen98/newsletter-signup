require("dotenv").config();
const express = require("express");
const https = require("node:https");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  const url = `https://us18.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;

  const options = {
    method: "POST",
    auth: `scott1:${process.env.API_KEY}`,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const parsedJSON = JSON.parse(data);

      if (parsedJSON.error_count === 0) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running");
});
