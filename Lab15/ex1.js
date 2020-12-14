var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var filename = "user_data.json";
var cookieParser = require('cookie-parser');

app.use(cookieParser());


app.use(myParser.urlencoded({ extended: true }));
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8'); // 'utf-8' makes data readable to user
    //console.log("Success! We got: " + data)

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);
} else {
    console.log("Sorry can't read file " + filename);
}
// exercise 1 part 
app.get("/set_cookie", function (request, response) {
    // Set a cookie named "myname" 
    //name of each cookie is a string
    response.cookie('myname', 'Jonathan Kan', { maxAge: 10000 }).send('cookie set');

});
// create path to use cookie
app.get("/use_cookie", function (request, response) {
    // use cookie if it has been set
    output = "No myname cookie found";
    if (typeof request.cookies.myname != 'underfined') {
        output = `Welcome to the Use Cookie page ${request.cookies.myname}`
    }
    response.send(output);
});

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST login request");
    POST = request.body;
    user_name_from_form = POST["username"];
    console.log("User name from form=" + user_name_from_form);
    if (user_data[user_name_from_form] != undefined) {
        response.send(`<H3> User ${POST[username]} logged in`);
    } else {
        response.send(`Sorry Buddy`)
    }
});
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
    <body>
    <form action="" method="POST">
    <input type="text" name="username" size="40" placeholder="enter username" ><br />
    <input type="password" name="password" size="40" placeholder="enter password"><br />
    <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
    <input type="email" name="email" size="40" placeholder="enter email"><br />
    <input type="submit" value="Submit" id="submit">
    </form>
    </body>
        `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    POST = request.body;
    console.log("Got register POST");
    if (POST["username" != undefined] && POST['password' != undefined] && POST['repeat_password' != undefined]) { // Validate user input
        username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.send("User " + username + " logged in");
    } else {
        response.send("Sorry, try again");
    }
});


app.listen(8080, () => console.log(`listening on port 8080`));