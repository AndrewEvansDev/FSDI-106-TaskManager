var important = false;
var UI = {};
var serverUrl = "http://fsdi.azurewebsites.net/api"


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


function displayTask(task){
    let syntax = `<div class="task-item">
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



window.onload=init;


