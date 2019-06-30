;(function()
{
  'use strict';
  var $add_task = $('.add-task')
  ,$delete_task
  ,$detail_task
  ,$task_detail = $('.task-detail')
  ,$task_detail_mask = $('.task-detail-mask')
  ,$update_form
  ,current_index
  ,task_list={};
  init();
  $add_task.on('submit',on_add_task_form_submit);

  $task_detail_mask.on('click',function(){
    $task_detail.hide();
    $task_detail_mask.hide();
  });
  function on_add_task_form_submit(e){
    /*禁用默认行为*/
    e.preventDefault();
    /*获取新Task的值*/
    var new_task={};
    var $input = $(this).find('input[name=content]');
    new_task.content = $input.val();
    /*如果新Task值为空,则直接返回;否则继续运行*/
    if(!new_task.content) return;
     /*传入新Task*/
    if(add_task(new_task)){
      render_task_list();
      $input.val(null);/*清空input的value*/
    }
  }
  /*查找并删除所有删除按钮的点击事件*/
  function listen_delete_task(){
    $delete_task.on('click',function(e){
      var $this = $(this);
      /*找到删除按钮所在的task元素*/
      var $item = $this.parent().parent();/*选中item中的一行*/
      var index = $item.data('index');
      var tmp = confirm('确定删除？');
      tmp ? delete_list(index):null;
    })
  }
  /*查找所有详情按钮的点击事件*/
  function listen_detail_task(){
    $('.task-item').on('dblclick',function(){
      show_task_detail($(this).data('index'));
    });
    $detail_task.on('click',function(e){
      var $this = $(this);
      /*找到删除按钮所在的task元素*/
      var $item = $this.parent().parent();/*选中item中的一行*/
      var index = $item.data('index');
      show_task_detail(index);
    })
  }
  /*查看task详情*/
  function show_task_detail(index){
    current_index = index;
    render_task_detail(index);
    /*显示详情模板（默认隐藏）*/
    $task_detail.show();
    $task_detail_mask.show();
  }
  /*详情进入，更新任务*/
  function update_task(index,data){
    if(!index||!task_list[index]) return;
    task_list[index] = data;
    refresh_task_list();
  }

  function hide_task_detail(){
    $task_detail.hide();
    $task_detail_mask.hide();
  }
  function init(){
    task_list = store.get('task_list')||[];
    if(task_list.length){
      render_task_list();
    }
  }

  function render_task_detail(index){
    if(index==undefined||!task_list[index]) return;
    var item = task_list[index];
    console.log(item);

    var tpl =
    '<form>'+
    '<div class="content">'+
    '<input name ="content" value="'+ item.content + '">' +
    '</div>'+
    '<div class="desc">'+
    '<textarea name="desc" rows="8" >'+ (item.desc||'') +'</textarea>'+
    '</div>'+
    '<div class="remind">'+
    '<input type="date" name="remind_date" value="">'+
    '</div>'+
    '<div><button type="submit">更新</button></div>'+
    '</form>';
    $task_detail.html(null);
    $task_detail.html(tpl);
    $update_form = $task_detail.find('form');
    $update_form.on('submit',function(e){
      e.preventDefault();
      var data = {};
      data.content=$(this).find('[name=content]').val();
      data.desc=$(this).find('[name=desc]').val();
      data.remind_date=$(this).find('[name=remind_date]').val();
      update_task(index,data);
      hide_task_detail();
    })

  }
  function add_task(new_task){
    /*将新任务推入task_list*/
    task_list.push(new_task);
    /*更新localstorage*/
    refresh_task_list();
    // store.clear();
    return task_list;
  }
  /*删除一条task*/
  function delete_list(index){
    if(!index||!task_list[index]) return;
    delete task_list[index];
    refresh_task_list();
  }
  /*更新localstorage,并渲染模板tpl*/
  function refresh_task_list(){
    store.set('task_list',task_list);
    render_task_list();
  }
  /*渲染全部的task*/
  function render_task_list(){
    var $task_list = $('.task-list');
    $task_list.html('');
    for(var i = 0 ;i < task_list.length;i++){
      var $task = render_task_item(task_list[i],i);
      $task_list.prepend($task);
    }
    $delete_task= $('.action.delete');
    $detail_task= $('.action.detail');
    listen_delete_task();/*监听删除*/
    listen_detail_task();
  }

  /*渲染单条task 模板*/
  function render_task_item(data,index){
    if(!data||!index) return;
    var taskdate = data.remind_date||'';
    var list_item_tpl=
    '<div class="task-item" data-index="'+index+'">'+
    '<span><input type="checkbox"></span>'+
    '<span class="task-content">'+data.content+'</span>'+
    '<span class="fr">'+
    '<span class="action task-date">'+ taskdate +'</span>'+
    '<span class="action delete"> 删除</span>'+
    '<span class="action detail"> 详情</span>'+
    '</span>'+
    '</div>';
    return list_item_tpl;
  }

})();
