// Request to get readings data
function getData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // console.log('getData(): ', JSON.parse(this.responseText));
        listReadings(JSON.parse(this.responseText));
      }
    };
    if (fan_gpio) {
      let fan = document.getElementById("fan").value;
      xhttp.open("POST", "settings?fan=" + fan, true);
    }
    xhttp.send();
}