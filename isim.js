const myForm = document.getElementById("myForm");     //get .csv file
const csvFile = document.getElementById("csvFile");

const reader = new FileReader();                      //create a filereader

myForm.addEventListener("submit", function (e) {      //use the submit button
  e.preventDefault();
  const input = csvFile.files[0];

  reader.onload = function (e) {                      //gets every row individually from file
    const text = e.target.result;
    const data = csvToArray(text);                    //calls the array for parsing
    document.write(JSON.stringify(data));             //and prints for debug(will be changed)
  };
  
  reader.readAsText(input);                           //read a new line
});

function csvToArray(str, delimiter = ";") {         //parse the text into array function
    
  let array = str.split("\r\n").map(function (line) {
    return line.split(delimiter);
  });
    array.pop();                                    //last item of array is [""] so we popped it
    console.log(array.length);                      //for debug (will be removed)
    return array;
  }
