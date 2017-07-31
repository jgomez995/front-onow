var lang_esp_datatables = "/js/spanish.json";
    $.extend(true, $.fn.dataTable.defaults, {
        "lengthChange": false,
        "language": {
            "url": lang_esp_datatables,
            "searchPlaceholder": "Buscar"
        },
        "columnDefs": [{
            "targets": [-1],
            "orderable": false
        }]
    });
$(document).ready(function() {
    $('.menuDropit').dropit();
    $('#tab-container').easytabs();
    $('.table').DataTable();
    $('.open-popup-link').magnificPopup({
        type: 'inline',
    });
    $('.close-modal').click(function(){
    $.magnificPopup.close();
	});
	$('select').select2({minimumResultsForSearch: -1});
});
// habiltar y deshabilitar Input
var activeDays= $(".activeDays");
	// activeDays.find("input[type='checkbox']");
	// console.log(activeDays.find("input[type='checkbox']"));
$(".activeDays").on("change","input[type='checkbox']",function(e){
	var $this=$(this);
	var target=$this.data("target");
	var inputs =$(target+' input');
	var isValid=false;
	activeDays.find("input[type='checkbox']").each(function(){
		console.log($(this).find(""));
		if($(this).is(":checked")){
			 isValid = true;
		}
	});
	// console.log(isValid);
	if(isValid === true){           
	    $('input[type="submit"]').prop('disabled', false);
	}else{
	    $('input[type="submit"]').prop('disabled', true);
	}
	if($this.prop('checked')===true){
		inputs.prop('disabled',false);
		$(target).removeClass('isDisabled');
		inputs.timepicker({
        // 'showDuration': true,
        // 'timeFormat': 'g:ia',
        'scrollDefault': 'now',
    	});
    	var targetid = target.replace(/#/g, "");
		var datepairTime = document.getElementById(""+targetid);
    	var datepair = new Datepair(datepairTime);
	}else{
		inputs.prop('disabled',true);
		$(target).addClass('isDisabled');
		inputs.val('');

	}
});
tinymce.init({ selector:'.editor' });

