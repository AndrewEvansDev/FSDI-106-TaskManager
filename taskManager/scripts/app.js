var important = false;
var UI = {};
var serverUrl = "http://fsdi.azurewebsites.net/api";
var myTasks = [];


function toggleImportant(){
    if(important){
        $('#iconImp').removeClass('fas').addClass('far');
        $('section#details').addClass('unimportant').removeClass('important');
        $('#btnSave').removeClass('important').html('Save Task <i class="far fa-check-circle"></i>');
        important=false;
    }else{
        $('#iconImp').removeClass('far').addClass('fas');
        $('section#details').addClass('important').removeClass('unimportant');
        $('#btnSave').addClass('important').html('Save Important Task<i class="far fa-check-circle"></i>');
        important=true;
    }
}

function saveTask(){
    var title = UI.title.val();
    var description = UI.description.val();
    var dueDate = UI.dueDate.val();
    var location = UI.location.val();
    var alertText = UI.alertText.val();
    console.log(title, description, dueDate,location,alertText);

//validations AND create a dynamic message depending on the error

if(title.length < 5){
    $('#msgFail').append(' Not enough characters task name, please try again.').show()
    setTimeout(function(){
        $('#msgFail').text('Something is wrong with the form and it cannot be submitted.').hide()},7000
    )


let descLength = description.length
if(descLength >= 1 &&descLength <=30){
    $('#msgFail').append(' You need between 1-30 characters.').show()
    setTimeout(function(){
        $('#msgFail').text('Something is wrong with the form and it cannot be submitted.').hide()},7000
    )
    return;
}}


    var taskToBeSaved = new Task(title,description,important,dueDate,location,alertText);
    console.log(taskToBeSaved);
    

    $.ajax({
        type: "POST",
        url: serverUrl + "/tasks",
        data: JSON.stringify(taskToBeSaved),
        contentType:'application/json',
        success: function(res){
            displayTask(res);
            console.log(res)
        },
        error:function(error){
            console.log("Error/fail",error);
        }
    })
    clearForm()
}

function fetchTasks(){
    $.ajax({
        type:"GET",
        url:serverUrl + "/tasks",
        success:function(res){
            console.log(res)
            for(let i=0;i<res.length;i++){
                let task = res[i];
                if(task.user === "AndrewEvans"){
                    displayTask(task)
                    myTasks.push(task)
                };
                
            }
        },
        error:function(errDetails){
            console.error(errDetails)
        }
    })
}

function init(){
    UI.id = $('#txtId')
    UI.title = $('#txtTitle');
    UI.description = $('#txtDescription');
    UI.dueDate = $('#txtDueDate');
    UI.location = $('#txtLocation');
    UI.alertText = $('#txtAlert');
    //load data
    fetchTasks();
    //hook events
    $('#iconImp').click(toggleImportant);
    $('#btnSave').click(saveTask);
}

//redo date function >.<
function convertDate(date){
    var toslice = date.dueDate;
    var year = toslice.substring(0,4);
    var month = getMonthName(parseInt(toslice.substring(5,7)));
    var day = parseInt(toslice.substring(8,10));
    return `${month}, ${day} , ${year}`
}

function getMonthName(month){
    const d = new Date();
    d.setMonth(month-1);
    const monthName = d.toLocaleString("default", {month: "long"});
    return monthName;
}

function clearForm(){
    UI.title.val("");
    UI.description.val("");
    UI.dueDate.val("");
    UI.location.val("");
    UI.alertText.val("");
    if(important)toggleImportant();
}
function changeDate(date){
    let newDate = new Date(date)
}

function displayTask(task){
    let syntax = `<div onclick="taskClick(${task.id}) "class="task-item">
    <h5>${task.title}</h5>
    <p>${task.description}</p>
    ${convertDate(task)}
    ${task.location}
    ${task.alertText}
    </div>`
    $('#pendingTasks').append(syntax);
}

$( "#iconImp" ).hover(
    function() {
        $("#h3").text(" Click if important").css('color','#cd7e9c').css('font-size','1.3rem')
    }, function() {
        $("#h3").text("Add Task").css('color','#c4c2d5').css('font-size','1.75rem')
    }
    );

//make this work to toggle the #details menu
// const hideBtn = $('#hideShow')
// const addTask = $('#details');
// hideBtn.click(function(){
//     //change task icon class between fa-eye or fa-eye-slash
//     if($(addTask).is(":visible")){
//         addTask.hide()
//         hideBtn.addClass('fa-eye').removeClass('fa-eye-slash')
//     }
//     else{
//         addTask.show()
//         hideBtn.addClass('fa-eye-slash').removeClass('fa-eye')
//     }
// };

function taskClick(id){
    console.log("task was clicked",id);
    for(var i=0; i < myTasks.length; i++){
        var task = myTasks[i]
        if(task.id == id){
            
            
            console.log(task)
            UI.title.val(task.title);
            UI.description.val(task.description);
            UI.dueDate.val(task.dueDate);
            UI.location.val(task.location);
            UI.alertText.val(task.alertText);
            important= !task.important;
            toggleImportant();
        }
    }
}

window.onload=init;


