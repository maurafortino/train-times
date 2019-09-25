var firebaseConfig = {
  apiKey: "AIzaSyCgMQthj9K3E5DDB8ILhsVoDDShuITHA-M",
  authDomain: "train-times-dfc96.firebaseapp.com",
  databaseURL: "https://train-times-dfc96.firebaseio.com",
  projectId: "train-times-dfc96",
  storageBucket: "",
  messagingSenderId: "725480445247",
  appId: "1:725480445247:web:2f9e73dd0fcf556540af8a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//stores the firebase database in a variable
var database = firebase.database();

$(document).ready(function() {
  $('input:text').focus(
  function(){
      $(this).css({'background-color' : 'rgb(195,172,192)'});
  });

//function for on
$("#submit").on("click", function (event) {
  event.preventDefault();

  //obtain the values from the inputs and store them in variables
  var trainName = $("#train-name").val();
  var destination = $("#destination").val();
  var trainTime = $("#train-time").val();
  var frequencyTime = $("#frequency").val();

  //creates an object variable with the values from the variables above
  var newTrain = {
    train: trainName,
    city: destination,
    time: trainTime,
    frequency: frequencyTime
  };

  //pushes the object variable to the database - but does not display it on the html document
  database.ref().push(newTrain);

  // Clears text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
});

//function to display the values in the form on the html document
database.ref().on("child_added", function (childSnapshot) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var destination = childSnapshot.val().city;
  var trainTime = childSnapshot.val().time;
  var frequencyInMinutes = childSnapshot.val().frequency;

  //use moment to figure out when the next train will arrive
  var trainFrequency = frequencyInMinutes;
  var firstTrain = trainTime;
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  var remainder = diffTime % trainFrequency;
  var nextTrainMinutes = trainFrequency - remainder;

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(trainTime),
    $("<td>").text(frequencyInMinutes),
    $("<td>").text(nextTrainMinutes)
  );

  // Append the new row to the table
  $("tbody").append(newRow);
});
