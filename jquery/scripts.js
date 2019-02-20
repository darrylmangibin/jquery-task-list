// get tasks for localStorage
function getTasks() {
	var tasksJSON = localStorage.getItem('tasks');
	if(tasksJSON !== null) {
		return JSON.parse(tasksJSON)
	} else {
		return [];
	}
}

var tasks = getTasks();

// save to localstorage
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

$(function(){
	// render the tasks lists
	function render(tasks) {
		$('#ul').html('');
		$.each(tasks, function(index, task) {
			var lis = $('<li>');
			lis.append('<span><i class="fa fa-trash"></i></span> ' + task.text);

			if(task.completed){
				lis.addClass('completed')
			} else {
				lis.removeClass('completed')
			}
			
			//underline the completed task
			lis.click(function(e){
				var id = task.id;
				var x;
				$.each(tasks, function(index, task) {
					if(task.id === id) {
						x = task
					}
				});
				x.completed = !x.completed;
				if(x.completed){
					lis.addClass('completed')
				} else {
					lis.removeClass('completed')
				}
				saveTasks();
			});

			// remove a task
			lis.on('click', 'span', function(e) {
				var id = task.id;
				
				e.stopPropagation();
				$(this).parent().fadeOut(function(){
					var x;
					$.each(tasks, function(index, task) {
						if(task.id === id) {
							x = index
						}
					});
					if(x > -1) {
						tasks.splice(x, 1)
					}
					saveTasks();
					selectTask(tasks)
				});
			});

			$('#ul').append(lis)
		})
	}
	render(tasks);

	// render select
	function selectTask(tasks) {
		$('#select').html('');
		var ch = $('<option>');
		ch.attr('value', 'choose');
		ch.text('Choose . . .');
		$('#select').append(ch);

		$.each(tasks, function(index, task){
			var opt = $('<option>');
			opt.attr('value', task.id);
			opt.text(task.text);
			$('#select').append(opt)
		});
	}
	selectTask(tasks);

	//add a task
	$('#btn').click(function(){
		var id = uuidv4();
		if($('#add').val().length <= 0){
			alert('Add a Task');
			return false
		} else {
			tasks.push({
				id: id,
				text: $('#add').val(),
				completed: false
			});
			saveTasks();
			render(tasks);
			selectTask(tasks);
			$('#add').val('');
		}
	});

	// open update div
	$('.fa-plus').click(function(e){
		$('#update').slideToggle(1000)
	});

	$('#select').on('change', function(e) {
		var id = $(this).val();
		$.each(tasks, function(index, task) {
			if(task.id === id) {
				$('#updateTask').val(task.text)
			}
		})
	})

	// edit task
	$('#editBtn').click(function(e){
		var x;
		$.each(tasks, function(index, task){
			if(task.id === $('#select').val()) {
				x = task
			}
		});

		if(x === undefined) {
			alert('Please select a task to Update')
		} else {
			x.text = $('#updateTask').val()
			saveTasks()
			render(tasks)
			selectTask(tasks)
		}
	});

	//filter task
	$('#fil').on('input', function(e) {
		var value = $(this).val().toLowerCase();
		$('#ul li').filter(function(){
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		})
	});

	// add a task
	$('#add').on('keyup', function(e) {
		if(e.which === 13){
			var id = uuidv4();
			if($('#add').val().length <= 0){
				alert('Add a Task');
				return false
			} else {
				tasks.push({
				id: id,
				text: $('#add').val(),
				completed: false
			});
				saveTasks();
				render(tasks);
				selectTask(tasks);
				$('#add').val('');
			}
		}
	});

	// edit task
	$('#updateTask').on('keyup', function(e) {
		if(e.which === 13) {
			var x;
			$.each(tasks, function(index, task){
				if(task.id === $('#select').val()) {
					x = task
				}
			});

			if(x === undefined) {
				alert('Please select a task to Update')
			} else {
				x.text = $('#updateTask').val()
				saveTasks()
				render(tasks)
				selectTask(tasks)
			}
		}	
	})
})