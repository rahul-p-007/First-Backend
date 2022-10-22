const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    // useCreateIndex : true
}).then(()=>{
    console.log(`Connected to Server Successfully`);
}).catch(()=>{
    console.log(`Not Connected to Server`);
})