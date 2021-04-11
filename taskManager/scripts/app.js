var important = false;
var UI = {};
var serverUrl = "http://fsdi.azurewebsites.net/api";
var myTasks = [];

function toggleImportant() {
    if (important) {
        // $("#iconImp").removeClass("fas").addClass("far");
        // $("section#details").addClass("unimportant").removeClass("important");
        // $("#btnSave")
        //     .removeClass("important")
        //     .html('Save Task <i class="far fa-check-circle"></i>');
        important = false;
    } else {
        // $("#iconImp").removeClass("far").addClass("fas");
        // $("section#details").addClass("important").removeClass("unimportant");
        // $("#btnSave")
        //     .addClass("important")
        //     .html('Save Important Task<i class="far fa-check-circle"></i>');
        important = true;
    }
}

function checkDate(date){
    var d = new Date(date)
    if(d instanceof Date && isFinite(d) == false) {
    return false}
}


function saveTask() {
    var important = false;
    var title = UI.title.val();
    var description = UI.description.val();
    var dueDate = UI.dueDate.val();
    var location = UI.location.val();
    var alertText = UI.alertText.val();
        important = $("input[type='radio']:checked").val();
    
    var dateCheck = new Date(dueDate);
    var dateObject;
    if(checkDate(dateCheck)==false){
        console.log("bad date yo")
        $("input#txtDueDate").addClass("inputFail").val("Invalid date");
        $("#msgFail").show();
        setTimeout(function(){
            $("input#txtDueDate").removeClass("inputFail").val("");
            $("#msgFail").hide();
            },5000
        )
        return;
    }else{
        dateObject = dateCheck.toISOString();
    }


    if (title.length < 5) {
        $("#msgFail").show();
        $("input#txtTitle").addClass("inputFail").val("min 5 characters");
        setTimeout(function () {
            $("#msgFail").hide();
            $("input#txtTitle").removeClass("inputFail").val("");
        }, 7000);
        return;
        }
    if (alertText.length > 20) {
        $("#msgFail").show();
        $("input#txtAlert").addClass("inputFail").val("max 20 characters");
        setTimeout(function () {
            $("#msgFail").hide();
            $("input#txtAlert").removeClass("inputFail").val("");
        }, 7000);
        return;
        }
    var taskToBeSaved = new Task(
        title,
        description,
        important,
        dateObject,
        location,
        alertText
    );
    console.log(taskToBeSaved);

    $.ajax({
        type: "POST",
        url: serverUrl + "/tasks",
        data: JSON.stringify(taskToBeSaved),
        contentType: "application/json",
        success: function (res) {
            displayTask(res);
            console.log(res);
        },
        error: function (error) {
            console.log("Error/fail", error);
        },
    });
    clearForm();
}

function fetchTasks() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/tasks",
        success: function (res) {
            for (let i = 0; i < res.length; i++) {
                let task = res[i];
                if (task.user === "NewStart") {
                    displayTask(task);
                    myTasks.push(task);
                }
            }
        },
        error: function (errDetails) {
            console.error(errDetails);
        },
    });
}


function init() {
    UI.id = $("#txtId");
    UI.title = $("#txtTitle");
    UI.description = $("#txtDescription");
    UI.dueDate = $("#txtDueDate");
    UI.location = $("#txtLocation");
    UI.alertText = $("#txtAlert");
    //load data
    fetchTasks();
    //hook events
    // $("#iconImp").click(toggleImportant);
    $("#btnSave").click(saveTask);


}

function clearForm() {
    UI.title.val("");
    UI.description.val("");
    UI.dueDate.val("");
    UI.location.val("");
    UI.alertText.val("");
    if (important) toggleImportant();
    $('input[type="radio"]').prop('checked', false);
    $("section#details").removeClass("unimportant").removeClass("important").addClass("unimportant");
}

function displayTask(task) {
    let syntax;
    var aDate = new Date(task.dueDate);
    var bDate = aDate.toLocaleDateString();

    if(task.important===true){

        syntax = `<div onclick="taskClick(${task.id})" class="important task-item">
        <div class="itemHeader">
            <div class="taskh5"><h5>${task.title} </h5></div>
            <div class="taskIcon"><i id="iconImp" class="fas fa-star"></i></div>
        </div>
        <div class="taskDesc">${task.description}</div>
        ${bDate}
        ${task.location}
        ${task.alertText}
        </div>`
    }else{
        syntax = `<div onclick="taskClick(${task.id})" class="unimportant task-item">
        <div class="itemHeader">
            <div class="taskh5"><h5>${task.title} </h5></div>
            <div class="taskIcon"><i id="iconImp" class="far fa-star"></i></div>
        </div>
        <div class="taskDesc">${task.description}</div>
        ${bDate}
        ${task.location}
        ${task.alertText}
        </div>`
        }
    



    important=false;
    $("#pendingTasks").append(syntax);
}

// $("#iconImp").hover(
//     function () {
//         $("#h3")
//             .css("color", "#cd7e9c")
//             .css("font-size", "1.3rem");
//     },
//     function () {
//         $("#h3")
//             .css("color", "#c4c2d5")
//             .css("font-size", "1.75rem");
//     }
// );


$('#hideShow img').click(function() {
    if($('#details').is(":visible")) {
        $('#details').slideUp();
        $('.hideShow span').text('Show ')
        $('#list').css('width','100%')
    } else {
        $('#details').slideDown();
        $('.hideShow span').text('Hide ')
        $('#list').css('width','69%')
    }
    });

function taskClick(id) {

    for (var i = 0; i < myTasks.length; i++) {
        var task = myTasks[i];
        if (task.id == id) {
            var aDate = new Date(task.dueDate);
            var bDate = aDate.toLocaleDateString();
            console.log(task);
            UI.title.val(task.title);
            UI.description.val(task.description);
            UI.dueDate.val(bDate);
            UI.location.val(task.location);
            UI.alertText.val(task.alertText);
            important = !task.important;
            toggleImportant();
        }
    }
}

$("input#important").click(function(){
    $("section#details").addClass("important").removeClass("unimportant");
})
$("input#notImportant").click(function(){
    $("section#details").addClass("unimportant").removeClass("important")
})


window.onload = init;