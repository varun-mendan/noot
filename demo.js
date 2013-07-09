(function($){

  console.log("Initializing...");

var Note = Backbone.Model.extend({

  defaults:{
      "title": 'No Title set',
    }
});

var NoteCollection = Backbone.Collection.extend({

  model: Note,
  url: "#"

});

var notes = new NoteCollection();

var NoteView = Backbone.View.extend({

    model: Note,
    initialize: function(){

      this.template = '<tr> <td> <a href="#/view/{{id}}"> <i class="icon-edit"></i> {{title}} </a> </td> </tr>';
    },
    render: function(){
      var html = Mustache.to_html(this.template, this.model.toJSON());
      console.log("Created HTML: "+html);
      return html;
    }

});

var EditNoteView = Backbone.View.extend({
    model: Note,
    el: $('.note-view'),
    render: function(options){
        if(typeof options!='undefined'){
          this.template = $('#edit-view-template').html();
          this.$el.empty();
          console.log(options.id);
          selectedNote=notes.get(options.id);
          console.log(selectedNote.toJSON());
          var html = Mustache.to_html(this.template, selectedNote.toJSON());
          
          this.$el.append(html);
      }
      else{
        console.log('in else of edit note');
        this.$el.empty();

        this.$el.append($('#note-view-template').html());
      }
    }

});

  var NotesList = Backbone.View.extend({

      model: notes,
      el: $('#savedNotes'),
      initialize: function(){
        this.model.on('all', this.render, this);
      },
      render: function(){
      console.log("inside render....");
      var self = this;
          //Clearing the existing top level element
          self.$el.empty();
        _.each(this.model.toArray(), function(note,i){
          self.$el.append((new NoteView({model: note})).render());
        });
        return this;
      }      
  });

    console.log("Creating collection...");



    /* Creating a router */
    var Router = Backbone.Router.extend({

        routes: {
          '': 'home',
          'add':'addNote',
          'view/:id':"viewNote",
          'update/:id' : "updateNote",
          'delete/:id' : "deleteNote"
        }
    });

    var router = new Router();
   
    var AppView = new NotesList();

    router.on('route:home', function(){
      console.log("in home view");
      new EditNoteView().render();
      router.navigate("#", {trigger: true});


    });

    router.on('route:viewNote',function(id){
      console.log("in Note view");
      
      new EditNoteView().render({id:id});


    });

    router.on('route:addNote',function(){
      console.log("in add view");
        var note = new Note({title:$('#title').val(), description: $('#note').val()});
        note.set('id',note.cid);
        notes.add(note);
        console.log(notes.toJSON());
        $('#title').val('');
        $('#note').val('');
        router.navigate("#", {trigger: true});

    });

      router.on('route:updateNote',function(id){
      console.log("in Update mode");
      noteToUpdate=notes.get(id);
      console.log(noteToUpdate);
      noteToUpdate.set('title',$('#title').val());
      noteToUpdate.set('description',$('#note').val());
      new EditNoteView().render({id:id});
      router.navigate("#", {trigger: true});

    });

      router.on('route:deleteNote',function(id){
      console.log("in deleteNote mode");
      notes.remove(id);
       router.navigate("#", {trigger: true});

    });


      Backbone.history.start();

})(jQuery);


/* Code for mustache -- Start 
 $(document).ready(function(){
  var data= {

   notes: [ "Note1", "Note2" , "Note3" ],
   url: function() {
        return function(text, render){
          text = render(text);
          return '<a href="#">'+ text + '</a>';
        }

      }

};

var template = '<ul class="nav nav-list">{{#notes}} <li> {{#url}} {{.}} {{/url}} </li>{{/notes}}</ul>';

var html = Mustache.to_html(template, data);

$('.span4').html(html);

});
Code for mustache -- End */