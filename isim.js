const myForm = document.getElementById("myForm");     //get .csv file
const csvFile = document.getElementById("csvFile");

const reader = new FileReader();                      //create a filereader

var i = 0;

myForm.addEventListener("submit", function (e) {      //use the submit button
  e.preventDefault();
  const input = csvFile.files[0];
  
  reader.onload = function (e) {                      //gets every row individually from file
    const text = e.target.result;
    const data = csvToArray(text);                    //calls the array for parsing

    var first,second,third,fourth;                    //here is our 4 array for our 4 file
    switch(i){
      case 0:
        first = data;                                        //didn't decided yet what will be our first input file
        //document.write(JSON.stringify(first));             //for debug(will be deleted prob)
        createTable(first);                                  //for checking our input(all will be deleted idk when tho)
        i++;
        console.log(i);
      break;
      case 1:
        second = data;
        //document.write(JSON.stringify(second));             
        createTable(second);
        i++;
      break;
      case 2:
        third = data;
        //document.write(JSON.stringify(third));             
        createTable(third);
        i++;
      break;
      case 3:
        fourth = data;
        //document.write(JSON.stringify(fourth));            
        createTable(fourth);
        i++;                                                 //i++ because we don't want user to enter a new file anymore 
      break;
    }
  };
  
  reader.readAsText(input);                           //tbh idk what this does but it's a mandotary and when I change it's position even a bit it crashes so don't touch it thx
  clearInput();                                       //it's clears the input so users can't spam submit
});
  
function csvToArray(str, delimiter = ";") {           //parse the text into array function
  let array = str.split("\r\n").map(function (line) {
    return line.split(delimiter);
  });
    array.pop();                                      //last item of array is [""] so we popped it
    console.log(array.length);                        //for debug (will be removed)
    return array;
}

function createTable(tableData) {                     //as the name says it creates a table from array
  var table = document.createElement('table');
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

function clearInput(){                              //it clears the input so users can't spam submit
  var getValue= document.getElementById("csvFile");
    if (getValue.value !="") {
        getValue.value = "";
    }
}
