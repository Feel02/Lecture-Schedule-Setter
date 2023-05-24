const myForm = document.getElementById("myForm");     //get .csv file
const csvFile = document.getElementById("csvFile");

const reader = new FileReader();                      //create a filereader

let i = 0;

var busy,classroom,courses,service;                    //here is our 4 array for our 4 file

csvFile.onchange = function(e){
  e.preventDefault();
  const input = csvFile.files[0];

  reader.onload = function (e) {                      //gets every row individually from file
    const text = e.target.result;
    const data = csvToArray(text);                    //calls the array for parsing

    switch(i){
      case 0:
        busy = data;                                        //busy.csv
        //createTable(busy);                                  //for checking our input(all will be deleted idk when tho)
        i++;
        document.getElementById('output').innerHTML = "Please enter the classroom.csv";
      break;
      case 1:
        classroom = data;                                        //classroom.csv
        for(let k = 0; k < classroom.length; k++){               //bubble sort for the class max sizes
          for(let j = 0; j < classroom.length - k - 1; j++){
            if(Number(classroom[j + 1][1]) < Number(classroom[j][1])){
              [classroom[j + 1],classroom[j]] = [classroom[j],classroom[j + 1]]
            }
          }
        }            
        //createTable(classroom);
        i++;
        document.getElementById('output').innerHTML = "Please enter the courses.csv";
      break;
      case 2:
        courses = data;                                         //courses.csv           
        //createTable(courses);
        i++;
        document.getElementById('output').innerHTML = "Please enter the service.csv";
      break;
      case 3:
        service = data;                                        //service.csv           
        //createTable(service);
        i++;                                                  
        document.getElementById('output').innerHTML = "Please choose a year to see timetable. First years table is shown.";
        everything();
        break;
      }
      if(i == 4) i = 0;
  };
  
  reader.readAsText(input);                           //it's some important code 
  clearInput();                                       //it's clears the input so users can't spam submit
};

let timetable = [];                                    //create the timetable

function everything() {

  var assigned = false;
  
  
  for (let i = 0; i < classroom.length; i++) {
    timetable[i] = Array(5).fill(null).map(() => Array(2).fill(null));
  }
 
                                                      //it will say if the classroom is free or not
  let classroomAvailability = Array(5).fill(true).map(() => Array(2).fill(true).map(() => Array(classroom.length).fill(true)));

  for (let i = 0; i < service.length; i++) {          //firstly put the service lectures
    let courseCode = service[i][0];
    let day = service[i][1];
    let timeSlot = service[i][2];

    let courseIndex = searchIndex(courses, courses.length, courseCode, 0);
    let year = Number(courses[courseIndex][2]) - 1;
    let numStudents = courses[courseIndex][6];

    let dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(day);
    let timeSlotIndex = ["Morning", "Afternoon"].indexOf(timeSlot);

    let flag = false;
    for(let s = 0;s<busy.length;s++){           // Check if instructor is available at this time slot 
      if(courses[courseIndex][0].localeCompare(busy[s][0]) == 0){
        if(day.localeCompare(busy[s][1]) == 0 && timeSlot.localeCompare(busy[s][2]) == 0){
            flag = true;
        }
      }
    }

    if(flag == true){
      console.log("There is no way to make a schedule for the department. Problem with the service lecturer busy times.");
      alert("There is no way to make a schedule for the department. Problem with the service lecturer busy times. If you want to create new TimeTable enter busy.csv");
      clearTable();
      document.getElementById('output').innerHTML = "There is no way to make a schedule for the department. Problem with the service lecturer busy times.If you want to create new time table enter busy.csv";
      return;
    }

    assigned = false;
    for (let j = 0; j < classroom.length; j++) {      //find a proper classroom
      if(assigned == false){
        if (classroomAvailability[dayIndex][timeSlotIndex][j] && (Number(numStudents) <= Number(classroom[j][1]))) {
          timetable[year][dayIndex][timeSlotIndex] = courseCode + ";" + classroom[j][0];
          classroomAvailability[dayIndex][timeSlotIndex][j] = false;
          assigned = true;
        }
      }
    }

    if (assigned == false) {
      console.log("There is no way to make a schedule for the department. Problem with the service lectures.");
      alert("There is no way to make a schedule for the department. Problem with the service lectures.If you want to create new TimeTable enter busy.csv.");
      clearTable();
      document.getElementById('output').innerHTML = "There is no way to make a schedule for the department. Problem with the service lectures.If you want to create new time table enter busy.csv";
      return;
    }
  }

  for (let i = 0; i < courses.length; i++) {      //put the other courses to table
    let courseCode = courses[i][0];
    var year = Number(courses[i][2]) - 1;
    let instructor = courses[i][7];
    let numStudents = courses[i][6];
    assigned = false;
                                                  //if service skip it
    if (searchIndex(service, service.length, courseCode, 0) == -1) {
      for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        for (let timeSlotIndex = 0; timeSlotIndex < 2; timeSlotIndex++) {
          if(assigned == false){
            if (timetable[year][dayIndex][timeSlotIndex] == null) {
              let day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][dayIndex];
              let timeSlot = ["Morning", "Afternoon"][timeSlotIndex];
              let flag = false;
              for(let s = 0;s<busy.length;s++){           // Check if instructor is available at this time slot 
                if(courses[i][7].localeCompare(busy[s][0]) == 0){
                  if(day.localeCompare(busy[s][1]) == 0 && timeSlot.localeCompare(busy[s][2]) == 0){
                      flag = true;
                  }
                }
              }
              for(let o = 0;o < 4;o++){                   //check if the instructor do not have any lecture at this time
                if(o != year){
                  if(timetable[o][dayIndex][timeSlotIndex] != null){
                    var placedLecture = timetable[o][dayIndex][timeSlotIndex].split(';');
                    var placedLecIndex = searchIndex(courses,courses.length,placedLecture[0],0);
                    if(courses[placedLecIndex][7].localeCompare(instructor) == 0){
                      flag = true;
                    }
                  }
                }
              }   
              if (flag == false) {
                for (let j = 0; j < classroom.length; j++) {      // Find available classroom with enough capacity
                  if(assigned == false){
                    if (classroomAvailability[dayIndex][timeSlotIndex][j] && (Number(numStudents) <= Number(classroom[j][1]))) {
                      timetable[year][dayIndex][timeSlotIndex] = courseCode + ";" + classroom[j][0];
                      classroomAvailability[dayIndex][timeSlotIndex][j] = false;
                      assigned = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    else{
      assigned=true;
      outputToTable(0,"accent-cyan-gradient");
    }

    if (assigned == false) {
      console.log("There is no way to make a schedule for the department.Problem with the other lectures");
      alert("There is no way to make a schedule for the department.Problem with the other lectures.If you want to create new TimeTable enter busy.csv.");
      clearTable();
      document.getElementById('output').innerHTML = "There is no way to make a schedule for the department. Problem with the other lectures. If you want to create new time table enter busy.csv";
      return;
    }
  }

}

function searchIndex(array,len,name,col){           //searches the first idex of same item
  for(let s = 0;s<len;s++){
    if(name.localeCompare(array[s][col]) == 0){
      return s;
    }
  }
  return -1;
}

function csvToArray(str, delimiter = ";") {           //parse the text into array function
  let array = str.split("\r\n").map(function (line) {
    return line.split(delimiter);
  });
    array.pop();                                      //last item of array is [""] so we popped it
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

function clearTable(){
  (document.getElementById("monday-morning")).className = "";
  (document.getElementById("monday-afternoon")).className = "";
  (document.getElementById("tuesday-morning")).className = "";
  (document.getElementById("tuesday-afternoon")).className = "";
  (document.getElementById("wednesday-morning")).className = "";
  (document.getElementById("wednesday-afternoon")).className = "";
  (document.getElementById("thursday-morning")).className = "";
  (document.getElementById("thursday-afternoon")).className = "";
  (document.getElementById("friday-morning")).className = "";
  (document.getElementById("friday-afternoon")).className = "";

  let IdStrings = [
    ["monday-morning","monday-afternoon"],
    ["tuesday-morning","tuesday-afternoon"],
    ["wednesday-morning","wednesday-afternoon"],
    ["thursday-morning","thursday-afternoon"],
    ["friday-morning","friday-afternoon"],
  ];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 2; y++) {
      document.getElementById(IdStrings[x][y]).innerHTML = "";
    }
  }

}

function outputToTable(year,color){                       //it's for turning our array into the table  
  (document.getElementById("monday-morning")).className = "";
  (document.getElementById("monday-afternoon")).className = "";
  (document.getElementById("tuesday-morning")).className = "";
  (document.getElementById("tuesday-afternoon")).className = "";
  (document.getElementById("wednesday-morning")).className = "";
  (document.getElementById("wednesday-afternoon")).className = "";
  (document.getElementById("thursday-morning")).className = "";
  (document.getElementById("thursday-afternoon")).className = "";
  (document.getElementById("friday-morning")).className = "";
  (document.getElementById("friday-afternoon")).className = "";
  
  let IdStrings = [
    ["monday-morning","monday-afternoon"],
    ["tuesday-morning","tuesday-afternoon"],
    ["wednesday-morning","wednesday-afternoon"],
    ["thursday-morning","thursday-afternoon"],
    ["friday-morning","friday-afternoon"],
  ];

  for(let i = 0; i<5 ; i++){
    for(let j = 0; j<2 ; j++){
      if(timetable[year][i][j] != null){
        let a1 = document.getElementById(IdStrings[i][j])
        var hold = timetable[year][i][j].split(';');
        a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
        a1.classList.add(color)
      }
      else{
        document.getElementById(IdStrings[i][j]).innerHTML = "";
      }
    }
  }
                                                                                //from here on we have the table already printed correctly, what we are going to do is print the instructor's name
  document.getElementById("monday-morning").addEventListener("mouseover", function (event) {  
    if(timetable[year][0][0] != null){                                          //when the mouse is on the cell check if this cell has a output printed on
      let a1 = document.getElementById("monday-morning")                        //if so get it's link to variable
      var hold = timetable[year][0][0].split(';');                              //get the name of the course and 
      let tempindex = searchIndex(courses,courses.length,hold[0],0);            //search in courses array after it's founded
      a1.innerHTML = "" + courses[tempindex][7];                                //change the printed output to instructor' name    
      a1.style.paddingLeft = '10px';                                            //and change the padding so it looks better
    }
  }, false);                                                                    //when the mouse is removed from the cell
  document.getElementById("monday-morning").addEventListener("mouseleave", function (event) {
    if(timetable[year][0][0] != null){                                          //and again if the cell has a output to printed on it    
      let a1 = document.getElementById("monday-morning")                        //get it's link to variable
      var hold = timetable[year][0][0].split(';');                              //get the output from timetable which is in courseName;courseClass format split it and put it in a array
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];              //print this output to the table 
      a1.style.paddingLeft = '115px';                                           //and change the padding so it original looks better
    }
  }, false);                                                              

  document.getElementById("monday-afternoon").addEventListener("mouseover", function (event) {
    if(timetable[year][0][1] != null){
      let a1 = document.getElementById("monday-afternoon")
      var hold = timetable[year][0][1].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("monday-afternoon").addEventListener("mouseleave", function (event) {
    if(timetable[year][0][1] != null){
      let a1 = document.getElementById("monday-afternoon")
      var hold = timetable[year][0][1].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("tuesday-morning").addEventListener("mouseover", function (event) {
    if(timetable[year][1][0] != null){
      let a1 = document.getElementById("tuesday-morning")
      var hold = timetable[year][1][0].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("tuesday-morning").addEventListener("mouseleave", function (event) {
    if(timetable[year][1][0] != null){
      let a1 = document.getElementById("tuesday-morning")
      var hold = timetable[year][1][0].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("tuesday-afternoon").addEventListener("mouseover", function (event) {
    if(timetable[year][1][1] != null){
      let a1 = document.getElementById("tuesday-afternoon")
      var hold = timetable[year][1][1].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("tuesday-afternoon").addEventListener("mouseleave", function (event) {
    if(timetable[year][1][1] != null){
      let a1 = document.getElementById("tuesday-afternoon")
      var hold = timetable[year][1][1].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("wednesday-morning").addEventListener("mouseover", function (event) {
    if(timetable[year][2][0] != null){
      let a1 = document.getElementById("wednesday-morning")
      var hold = timetable[year][2][0].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("wednesday-morning").addEventListener("mouseleave", function (event) {
    if(timetable[year][2][0] != null){
      let a1 = document.getElementById("wednesday-morning")
      var hold = timetable[year][2][0].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("wednesday-afternoon").addEventListener("mouseover", function (event) {
    if(timetable[year][2][1] != null){
      let a1 = document.getElementById("wednesday-afternoon")
      var hold = timetable[year][2][1].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("wednesday-afternoon").addEventListener("mouseleave", function (event) {
    if(timetable[year][2][1] != null){
      let a1 = document.getElementById("wednesday-afternoon")
      var hold = timetable[year][2][1].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("thursday-morning").addEventListener("mouseover", function (event) {
    if(timetable[year][3][0] != null){
      let a1 = document.getElementById("thursday-morning")
      var hold = timetable[year][3][0].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("thursday-morning").addEventListener("mouseleave", function (event) {
    if(timetable[year][3][0] != null){
      let a1 = document.getElementById("thursday-morning")
      var hold = timetable[year][3][0].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("thursday-afternoon").addEventListener("mouseover", function (event) {
    if(timetable[year][3][1] != null){
      let a1 = document.getElementById("thursday-afternoon")
      var hold = timetable[year][3][1].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("thursday-afternoon").addEventListener("mouseleave", function (event) {
    if(timetable[year][3][1] != null){
      let a1 = document.getElementById("thursday-afternoon")
      var hold = timetable[year][3][1].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  //
  document.getElementById("friday-morning").addEventListener("mouseover", function (event) {
    if(timetable[year][4][0] != null){
      let a1 = document.getElementById("friday-morning")
      var hold = timetable[year][4][0].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("friday-morning").addEventListener("mouseleave", function (event) {
    if(timetable[year][4][0] != null){
      let a1 = document.getElementById("friday-morning")
      var hold = timetable[year][4][0].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

  document.getElementById("friday-afternoon").addEventListener("mouseover", function (event) {
    if(timetable[year][4][1] != null){
      let a1 = document.getElementById("friday-afternoon")
      var hold = timetable[year][4][1].split(';');
      let tempindex = searchIndex(courses,courses.length,hold[0],0);
      a1.innerHTML = "" + courses[tempindex][7];
      a1.style.paddingLeft = '10px';
    }
  }, false);
  document.getElementById("friday-afternoon").addEventListener("mouseleave", function (event) {
    if(timetable[year][4][1] != null){
      let a1 = document.getElementById("friday-afternoon")
      var hold = timetable[year][4][1].split(';');
      a1.innerHTML = "" + hold[0] + "<br /> <br />" + " "+hold[1];
      a1.style.paddingLeft = '115px';
    }
  }, false);

}

document.getElementById("first-tab").addEventListener("click", function() {
  document.getElementById('output').innerHTML = "First years table is shown.";
  outputToTable(0,"accent-cyan-gradient");
});
document.getElementById("second-tab").addEventListener("click", function() {
  document.getElementById('output').innerHTML = "Second years table is shown.";
  outputToTable(1,"accent-pink-gradient");
});
document.getElementById("third-tab").addEventListener("click", function() {
  document.getElementById('output').innerHTML = "Third years table is shown.";
  outputToTable(2,"accent-orange-gradient");
});
document.getElementById("fourth-tab").addEventListener("click", function() {
  document.getElementById('output').innerHTML = "Fourth years table is shown.";
  outputToTable(3,"accent-green-gradient");
});
