/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
// MODEL
var model = {
	loadAttendance: function() {
		return JSON.parse(localStorage.attendance);
	}
};

// OCTOPUS
var octopus = {
	init: function() {
		view.init();
	},
	getAttendance: function() {
		return model.loadAttendance();
	},
	updateAttendance: function(newAttendance) {
		localStorage.attendance = JSON.stringify(newAttendance);
	}
};


// VIEW
var view = {
	init: function() {
		this.attendance = octopus.getAttendance();
		this.tableBody = $("tbody");

		var tableHtml = "";

		$.each(this.attendance, function(name) {
			tableHtml += "<tr class='student'><td class='name-col'>" +
				name + "</td>";
				for(var i = 0; i < 12; i++) {
					tableHtml += "<td class='attend-col'><input type='checkbox'></td>"
				}
				tableHtml += "<td class='missed-col'>0</td></tr>";
		});

		this.tableBody.append(tableHtml);

		$("input").click(function() {
			var studentRows = $('tbody .student'),
            newAttendance = {};

	        studentRows.each(function() {
	            var name = $(this).children('.name-col').text(),
	                $allCheckboxes = $(this).children('td').children('input');

	            newAttendance[name] = [];

	            $allCheckboxes.each(function() {
	                newAttendance[name].push($(this).prop('checked'));
	            });
			});

			octopus.updateAttendance(newAttendance);

			view.render();
		});

		this.render();
	},
	render: function() {
		var attendance = octopus.getAttendance();

		$.each(attendance, function(name, days) {
	        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
	            dayChecks = $(studentRow).children('.attend-col').children('input');

	        dayChecks.each(function(i) {
	            $(this).prop('checked', days[i]);
	        });
    	});

    	var $allMissed = $('tbody .missed-col');

    	$allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
	}
};

octopus.init();
