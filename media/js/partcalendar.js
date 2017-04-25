var partcalendar = (function ($, _) {
	
	var partcalendar_tpl;
	var gen_cell_id = function(CellId) {
		return 'partc_' + CellId;
	};
	
	var calendar_counter = 0,
		calendar_info = new Object();
	
	var cell_counter = 0,
		cell_info = new Object();
	
	return {
		initTemplates: 		function () {
			partcalendar_tpl = _.template( $('#partcalendar_tpl').html() );
		},
		make_cell_id:	gen_cell_id,
		dayOfWeekAsString: 	function (dayIndex) {
			return ["","Mo","Tu","We","Th","Fr","Sa","Su"][dayIndex];
		},
		monthAsString: 		function (monthIndex) {
			return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
		},
		dateToGenFormat: 	function(somedate) {
			var datestr = somedate.getFullYear() + ".";
			datestr = datestr.concat(("00" + (somedate.getMonth() + 1)).slice(-2) + ".");
			datestr = datestr.concat(("00" + somedate.getDate()).slice(-2) + " ");
			datestr = datestr.concat(("00" + somedate.getHours()).slice(-2) + ":");
			datestr = datestr.concat(("00" + somedate.getMinutes()).slice(-2));
			return datestr;
		},
		make_calendar: 		function(placeElementId, dateStart, dateEnd, targetString) {
			var ds = new Date(dateStart);
			var de = new Date(dateEnd);
			
			var cindex = ++calendar_counter;
			calendar_info[cindex] = { target: targetString, active_cell: null };
			
			var cellist = new Array();
			
			var colindex = ds.getDay();
			if (colindex == 0) colindex = 7;
			
			while (ds < de) 
			{
				cellist.push({ is_empty: false, is_caption: true, date: new Date(ds) });
				
				for (var i = 1; i < colindex; i++)
					cellist.push({ is_empty: true });
				var rindex = 1;
				while (ds < de)
				{
					var cell_id = ++cell_counter,
						cell_date = new Date(ds)
				
					var res = { is_empty: false,
								is_caption: false,
								date: cell_date,
								is_end_of_week: false,
								is_holiday:	(ds.getDay() == 0 || ds.getDay() == 6) ? true : false,
								id: cell_id,
								cal_id: cindex
					};
				
					cell_info[ gen_cell_id(cell_id) ] = { date: cell_date, calendar: cindex };
				
					colindex += 1;
					ds.setDate(ds.getDate() + 1);
					
					if (colindex > 7) {
						colindex = 1;
						rindex += 1;
						res.is_end_of_week = true;
					}
					cellist.push( res );
					
					if (ds.getDate() == 1) break;
				}
				if (colindex > 1) {
					for (var i = colindex; i <= 6; i++)
						cellist.push({ is_empty: true });
					cellist.push({ is_empty: true, is_end_of_week: true});
				}
			}
			
			$( '#' + placeElementId ).html( partcalendar_tpl({ start_date: dateStart, pc: cellist}) );
		},
		click: 				function( cellRef ) { 
			var cell_id = cellRef.getAttribute('id');
		
			var cell_data = cell_info[cell_id];
			var calend_data = calendar_info[cell_data.calendar];
			
			if (calend_data.active_cell !== null) {
				var actCell = document.getElementById(calend_data.active_cell);
				var oldProp = (actCell.getAttribute('class') === null) ? '' : actCell.getAttribute('class');
				actCell.setAttribute('class', (oldProp.search('holiday') >= 0) ? 'holiday' : '');
			}
			calend_data.active_cell = cell_id;
			
			document.getElementById(calend_data.target).value = cell_data.date;
			
			var classProp = (cellRef.getAttribute('class') === null) ? '' : cellRef.getAttribute('class');
			cellRef.setAttribute('class', (classProp.search('holiday') >= 0) ? 'holiday clicked' : 'clicked');
		}
	}
})(jQuery, _);
