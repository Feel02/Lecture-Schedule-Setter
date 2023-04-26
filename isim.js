const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
});

const reader = new FileReader();
reader.onload = function (event) {
  console.log(event.target.result); // the CSV content as string
};

reader.readAsText(file);
