var config = {
    apiKey: "AIzaSyCv-WADfcFfyDNH3_WuGyrRDr7vWxPe5yc",
    authDomain: "train-schedule-6258f.firebaseapp.com",
    databaseURL: "https://train-schedule-6258f.firebaseio.com",
    projectId: "train-schedule-6258f",
    storageBucket: "",
    messagingSenderId: "1083622023093"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  
  var tName= "";
  var tDestination= "";
  var tTime = "";
  var tFrequency = "";

  $("#add-train-btn").on("click", function(){
event.preventDefault();
tName= $("#train-name-input").val().trim();
tDestination=$("#destination-input").val().trim();
tTime=$("#time-input").val().trim();
tFrequency=$("#frequency-input").val().trim();

database.ref().push({
  Train: tName,
  Destination: tDestination,
  Departure: tTime,
  Frequency: tFrequency,
  dateAdded: firebase.database.ServerValue.TIMESTAMP
});

console.log(database);

$("#train-name-input").val("");
$("#destination-input").val("");
$("#time-input").val("");
$("#frequency-input").val("");

console.log("name: ", tName);

database.ref().on("child_added",function(snapshot){
  var entered = snapshot.val();
  var firstTimeConverted = moment(entered.Departure, "HH:mm").subtract(1, "years");
  console.log("First Time Converted: " + firstTimeConverted);

  var currentTime= moment();
  console.log("Current Time: " + moment(currentTime).format("HH:mm"));
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in time: " + diffTime);

  var tRemainder= diffTime % entered.Frequency;
  console.log(tRemainder);
  var tMinutesUntilTrain = entered.Frequency -tRemainder;
  console.log("Minutes to next Train: " + tMinutesUntilTrain);
  var nextTrain = moment().add(tMinutesUntilTrain,"minutes");
  console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));
  $("tbody").append(`<tr> <td>${entered.Train}</td>
  <td>${entered.Destination}</td>
  <td>${entered.Frequency}</td>
  <td>${moment(nextTrain).format("HH:mm")}</td>
  <td>${tMinutesUntilTrain}</td></tr>`);



  function updateTime(){
    setInterval(showTime, 1000);
  }
function showTime(){
  $("#currentTime").text(moment().format("HH:mm:ss"));
}
updateTime();
})



  })