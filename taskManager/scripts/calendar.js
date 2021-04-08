function setDatepicker(_this) {
  
    /* Get the parent class name so we 
        can show date picker */
    let className = $(_this).parent()
        .parent().parent().attr('class');

    // Remove space and add '.'
    let removeSpace = className.replace(' ', '.');

    // jQuery class selector
    $("." + removeSpace).datepicker({
        format: "dd/mm/yyyy",

        // Positioning where the calendar is placed
        orientation: "bottom auto",
        // Calendar closes when cursor is 
        // clicked outside the calendar
        autoclose: true,
        showOnFocus: "false"
    });
}