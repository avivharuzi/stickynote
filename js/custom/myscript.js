"use strict";

// Main array of objects
var notes = [];

// Loading data from local storage
function loadingData() {
    if (localStorage.getItem("notes") != null) {
        notes = JSON.parse(localStorage.getItem("notes"));
        drawElements();
    }
}
loadingData();

// Global note div
var col;

// Draw new elements
function drawElements() {
    var main = document.getElementById("posts");
    main.innerHTML = "";

    for (var i = 0; i < notes.length; i++) {
        col = document.createElement("div");
        col.className = "col-lg-3 note-main";
        col.id = notes[i].Id;
        main.appendChild(col);
        var note_div = document.createElement("div");
        note_div.className = "note-inside";
        note_div.innerHTML = "<p>" + notes[i].Text + "</p>";
        col.appendChild(note_div);
        var footer = document.createElement("footer");
        footer.innerHTML = notes[i].Hour + "<br>" + notes[i].Date;
        col.appendChild(footer);
        var deleteBtn = document.createElement("span");
        deleteBtn.className = "glyphicon glyphicon-trash";
        col.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", function() {
            col.style.opacity = "0";
            col.style.transform = "scale(0)";
            setTimeout(function () {
                removeElements(deleteBtn.parentNode.id);
                savingData();
                drawElements();
            }, 400);
        });
    }
}

// Removing elements by id
function removeElements(value) {
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].Id == value) {
            notes.splice(i, 1);
        }
    }
}

// Form inputs values
function validateForm() {
    var warningDate = document.getElementById("warningDate");
    var warningTime = document.getElementById("warningTime");

    var day   = document.getElementById("day").value;
    var month = document.getElementById("month").value;
    var year  = document.getElementById("year").value;

    var regDate = /(^(((0[1-9]|1[0-9]|2[0-8])[-](0[1-9]|1[012]))|((29|30|31)[-](0[13578]|1[02]))|((29|30)[-](0[4,6,9]|11)))[-](19|[2-9][0-9])\d\d$)|(^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;
    var regTime = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    var id   = generateId();
    var text = document.getElementById("text").value;
    var date = day + "-" + month + "-" + year;
    var hour = document.getElementById("hour").value;

    if (regDate.test(date)) {
        if (regTime.test(hour)) {
            warningDate.style.display = "none";
            warningTime.style.display = "none";
            var notePublish = new Note(id, text, date, hour);
            notes.push(notePublish);
            savingData();
            drawElements();
            col.className = "col-lg-3 note-main fade-in"; // for the animation when posting
            init();
        } else {
            warningDate.style.display = "none";
            warningTime.className = "fade-in";
            warningTime.style.display = "block";
            return false;
        }
    } else {
        warningTime.style.display = "none";
        warningDate.className = "fade-in";
        warningDate.style.display = "block";
        return false;
    }
}

// Function constructor for notes
function Note(_id, _text, _date, _hour) {
    this.Id   = _id;
    this.Text = _text;
    this.Date = _date;
    this.Hour = _hour;
}

// Saving data to local storage
function savingData() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Generate unique id
function generateId() {
    return "item" + (Math.floor(Math.random() * 999999999));
}

// Reset form inputs
function init() {
    document.getElementById("text").value  = "";
    document.getElementById("hour").value  = "";
    document.getElementById("day").value   = "";
    document.getElementById("month").value = "";
    document.getElementById("year").value  = "";
}

// Preventing refresh the page after posting note
var form = document.getElementById("formNote"); 
function handleForm(event) {
    event.preventDefault(); 
}
form.addEventListener("submit", handleForm);

// For setting time in form
$('#hour').timepicker({ 'timeFormat': 'h:i' });