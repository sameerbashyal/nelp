var mongoose=require('mongoose');
var EventSchema= mongoose.Schema({
event_name:{

},
event_description:{
    type:String
},
event_start_date:{
    type:String
},
event_end_date:{
    type:String
},
event_start_time:{
    type:String
},
event_end_time:{
    type:String
},
event_image:{
    type:String
},
event_category:{
    type:String
},
event_city:{
    type:String
},
event_area:{
    type:String
},
posted_user_id:{
    type:String
},
event_organizer_name:{
    type:String
},
event_organizer_phone:{
    type:String
},
created_at:{
    type:Date,
     default: Date.now
}
});
var Event= module.exports=mongoose.model('Event',EventSchema);

module.exports.createEvent =function(newEvent,callback){
newEvent.save(callback);
}

module.exports.getAllEvents= function(callback,limit){

Event.find(callback).limit(limit);
 }

 module.exports.getEventById= function(id,callback) {
    Event.findById(id,callback);
 }

  
 //Update 