function secondsToTime(secs) {
	var ret = "";                 // Return value
	var s = Math.floor(secs); 	  // Whole seconds
	var m = Math.floor(s/60);     // Whole minutes
	var h = Math.floor(m/60);     // Whole hours
	if (h < 10) {
		ret += "0";
	}
	ret += h;
	ret += ":";
	var m = m%60;
	if (m < 10) {
		ret += "0";
	}
	ret += m;
	var s = s%60;
	ret += ":";
	if (s < 10) {
		ret += "0";
	}
	ret += s;
	return ret;
}

function convertMilesToKm(inputValue, fix) {
	var fix = typeof fix == 'number' ? fix : 2;
	return (inputValue * 1.609344).toFixed(fix);
}

function convertKmToMiles(inputValue, fix) {
	var fix = typeof fix == 'number' ? fix : 2;
	return (inputValue * 0.621371192).toFixed(fix);
}

$(document).ready(function () {
	// PACE CALCULATOR
	var form = $('#pace-calculator form'),
	// CALORIE CALCULATOR
		calorieForm = $('#calorie-calculator form');
	// FILL FIELDS WHITH STORAGE VALUE
	form.each(function() {
		chrome.storage.sync.get('runDistance', function(r) {
			form.find('#runDistance').val(r['runDistance']);
		});
		chrome.storage.sync.get('typeDistance', function(r) {
			form.find('#runDistance').siblings().removeClass('active').filter('[value="' + r['typeDistance'] + '"]').addClass('active');
		});
		chrome.storage.sync.get('runHH', function(r) {
			form.find('#runHH').val(r['runHH']);
		});
		chrome.storage.sync.get('runMM', function(r) {
			form.find('#runMM').val(r['runMM']);
		});
		chrome.storage.sync.get('runSS', function(r) {
			form.find('#runSS').val(r['runSS']);
		});
		chrome.storage.sync.get('paceRunKm', function(r) {
			form.find('#runPaceKm').val(r['paceRunKm']);
		});
		chrome.storage.sync.get('paceRunMi', function(r) {
			form.find('#runPaceMi').val(r['paceRunMi']);
		});
		chrome.storage.sync.get('speedRunKm', function(r) {
			form.find('#runSpeedKm').val(r['speedRunKm']);
		});
		chrome.storage.sync.get('speedRunMi', function(r) {
			form.find('#runSpeedMi').val(r['speedRunMi']);
		});
	});
	// FILL FIELDS WHITH STORAGE VALUE
	// calorieForm.each(function() {
	// });
	// BIND EVENT
	calorieForm.on('click', '#caloriesCompute', calcCalories);
	$('#runPaceCompute').click(function () {
		var runHH, runMM, runSS, secondsRun, runDistance, paceRun, speedRun, typeDistance;
		if (form.size() <= 0) {
			//console.error('Withou form');
			return;
		}
		//clear form
		clearNotify(form);
		form.find('#runPaceKm').val('');
		form.find('#runPaceMi').val('');
		form.find('#runSpeedKm').val('');
		form.find('#runSpeedMi').val('');

		runHH = runMM = runSS = secondsRun = runDistance = paceRun = speedRun = 0;
		typeDistance = '';

		runDistance = (form.find('#runDistance').val() && parseFloat(form.find('#runDistance').val())) || runDistance;
		if (!runDistance) {
			notifyError(form, 'Run Distance must be grater than 0');
			//console.error('Run Distance must be grater than 0');
			return;
		}
		setValue('runDistance', runDistance);

		typeDistance = $('#runDistance', '#pace-calculator form').siblings('.active').val();
		if (!typeDistance) {
			notifyError(form, 'Run Distance must ha a type');
			return;
		}
		setValue('typeDistance', typeDistance);

		runHH = (form.find('#runHH').val() && parseInt(form.find('#runHH').val())) || runHH;
		runMM = (form.find('#runMM').val() && parseInt(form.find('#runMM').val())) || runMM;
		runSS = (form.find('#runSS').val() && parseInt(form.find('#runSS').val())) || runSS;

		secondsRun = runHH * 60 * 60 + runMM * 60 + runSS * 1;
		if (!secondsRun) {
			notifyError(form, 'Run Time must be grater than 0');
			//console.error('Run Time must be grater than 0');
			return;
		}
		setValue('runHH', runHH);
		setValue('runMM', runMM);
		setValue('runSS', runSS);

		paceRun = (secondsRun / runDistance);
		if (typeDistance == 'km') {
			// convert from km to miles
			paceRunKm = paceRun.toFixed(2);
			paceRunMi = convertMilesToKm(paceRun);
		} else if (typeDistance == 'mi') {
			//convert from miles to km
			paceRunKm = convertKmToMiles(paceRun);
			paceRunMi = paceRun.toFixed(2);
		}
		//console.log(paceRun, paceRunKm, paceRunMi)
		paceRunKm = secondsToTime(paceRunKm);
		paceRunMi = secondsToTime(paceRunMi);

		speedRun = (runDistance / secondsRun * 60 * 60);
		if (typeDistance == 'km') {
			// convert from km to miles
			speedRunKm = speedRun.toFixed(2);
			speedRunMi = convertKmToMiles(speedRun);
		} else if (typeDistance == 'mi') {
			//convert from miles to km
			speedRunKm = convertMilesToKm(speedRun);
			speedRunMi = speedRun.toFixed(2);
		}
		//console.log('runHH', runHH, 'runMM', runMM, 'runSS', runSS, 'secondsRun', secondsRun, 'runDistance', runDistance, 'paceRun', paceRun, 'speedRun', speedRun);

		form.find('#runPaceKm').val(paceRunKm);
		setValue('paceRunKm', paceRunKm);
		form.find('#runPaceMi').val(paceRunMi);
		setValue('paceRunMi', paceRunMi);

		form.find('#runSpeedKm').val(speedRunKm);
		setValue('speedRunKm', speedRunKm);
		form.find('#runSpeedMi').val(speedRunMi);
		setValue('speedRunMi', speedRunMi);
		//runPaceCompute();
	});
});

function calcCalories() {
	var form = $('#calorie-calculator form'),
		weight,
		weightUnit,
		distance,
		distanceUnit,
		coefficient,
		sport,
		caloriesBurned;

	//clear form
	clearNotify(form);
	form.find('#calories').val('');
	// reset vars
	weight = distance = coefficient = caloriesBurned = 0;
	weightUnit = distanceUnit = sport = '';

	weight = (form.find('#weight').val() && parseFloat(form.find('#weight').val())) || weight;
	if (!weight || weight <= 0) {
		notifyError(form, 'Weight must be grater than 0');
		//console.error('Run Distance must be grater than 0');
		return;
	}
	weightUnit = form.find('#weight').siblings('.active').val();
	if (!weightUnit) {
		notifyError(form, 'Specify weight unit');
		return;
	}
	// convert pounds to kg
	if (weightUnit == 'kg') {
		weight = weight * 2.2046;
	}
	sport = form.find('.sport.active').val();
	if (sport == 'rn') {
		coefficient = 0.790;
	} else if (sport == 'bk') {
		coefficient = 0.28;
	} else if (sport == 'sw') {
		coefficient = 2.93;
	} else {
		sport = '';
	}
	if (!sport) {
		notifyError(form, 'Specify a sport');
		return;
	}
	distance = (form.find('#distance').val() && parseFloat(form.find('#distance').val())) || distance;
	if (!distance || distance <= 0) {
		notifyError(form, 'Distance must be grater than 0');
		return;
	}
	distanceUnit = form.find('#distance').siblings('.active').val();
	// convert miles to ...
	if (distanceUnit == 'km') {
		distance /= 1.609344;
	} else if (distanceUnit == 'mi') {
	} if (distanceUnit == 'yd') {
		distance /= 1760;
	} else if (distanceUnit == 'mt') {
		distance /= 1609.344;
	} else {
		distanceUnit = '';
	}
	if (!distanceUnit) {
		notifyError(form, 'Specify distance unit');
		return;
	}
	caloriesBurned = Math.round(coefficient * weight * distance);
	form.find('#caloriesBurned').val(caloriesBurned);
}

function clearNotify(form) {
	form
		.find('.formMsg div')
		.slideToggle().remove();
}

function notifyError(form, msg) {
	form
		.find('.formMsg')
		.html($('<div class="alert alert-error">\
		<button type="button" class="close" data-dismiss="alert">&times;</button> ' +msg+ '\
	</div>').hide())
	.find('div').slideToggle();
}

/*
==============================================


*/
function setValue(key, value) {
	var tosave = {}
	tosave[key]=value;
	chrome.storage.sync.set(tosave, function() {
		// Notify that we saved.
		//console.log('Settings saved');
	});
}
