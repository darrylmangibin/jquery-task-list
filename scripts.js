$(function() {
    function getTodos() {
        var json = localStorage.getItem('todos');
        try {
            if(json !== null) {
                return JSON.parse(json);
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    var todos = getTodos();

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function render(todos) {
        var output = '';
        var completed = '';
        var options = '<option value="choose">Choose to edit . . .</option>';
        for(i = 0; i < todos.length; i++) {
            if (todos[i].completed) {
                completed = 'completed';
            }
            output += '<li class="'+completed+'" data-id="'+todos[i].id+'"><span><i class="fa fa-trash"></i></span>'+todos[i].text+'</li>';
            options += '<option value="'+todos[i].id+'">'+todos[i].text+'</option>'
        }
        $('#ul').html(output);
        $('#ul li').on('click', function(e) {
            var this_id = $(this).data().id;
            var todo;
            for(i = 0; i < todos.length; i++) {
                if(this_id === todos[i].id) {
                    todo = todos[i];
                }
            }
            todo.completed = !todo.completed;
            if(todo.completed) {
                $(this).addClass('completed')
            } else {
                $(this).removeClass('completed')
            }
            saveTodos();
        });
        $('#ul li').on('click', 'span', function(e) {
            var x;
            var this_id = $(this).parent().data().id
            e.stopPropagation();
            for(i = 0; i < todos.length; i++) {
                if(this_id === todos[i].id) {
                    x = i
                }
            }
            $(this).parent().fadeOut(400, function(){
                todos.splice(x, 1);
                saveTodos();
            })
        });
        $('#select').html(options);
    }
    render(todos)

    $('#btn').click(function(){
        var id = uuidv4();
        var text = $('#add').val();
        todos.push({
            id: id,
            text: text,
            completed: false
        });
        saveTodos();
        $('#add').val('');
        render(todos)
    });

    $('.fa-plus').click(function() {
        $('#update').fadeToggle()
    });
    
    $('#select').on('change', function(e) {
        var this_id = $(this).val();
        var todo;
        for(i = 0; i < todos.length; i++) {
            if(todos[i].id === this_id) {
                todo = todos[i]
            }
        }
        if(todo !== undefined) {
            $('#updateTask').val(todo.text);
        }
    });
    $('#editBtn').click(function(){
        var this_id = $('#select').val();
        var todo;
        for(i = 0; i < todos.length; i++) {
            if(this_id === todos[i].id) {
                todo = todos[i];
            }
        }
        if(todo !== undefined) {
            todo.text = $('#updateTask').val();
            saveTodos();
            render(todos);
            $('#updateTask').val('');
        }
    });

    $('#fil').on('input', function(e) {
        var text = $(this).val().toLowerCase();
        $('#ul li').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(text) > -1)
        })
    })
})