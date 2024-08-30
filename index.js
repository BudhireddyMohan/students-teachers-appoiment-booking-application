const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const uri = "your url";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

//=================================================<<<<<student  sign_up  code>>>>>===============================================================
app.post('/sign_up', async function(req, res) {
    try {
        await client.connect();
        const database = client.db("project");
        const collection = database.collection("users");
        const { email, password } = req.body;
        const document = { email: email, password: password };
        const result = await collection.insertOne(document);
        res.send("Document is inserted");
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, function() {
    console.log(`Server is running successfully on port ${port}`);
});
//==============================================<<<teacher-sign-up code>>>>>>========================================================



app.post('/teachers-sign-up', async function(req, res) {
  try {
    await client.connect();
    const database = client.db("project");
    const collection = database.collection("users");

    console.log("Inserting document into collection:", collection.collectionName);

    const { email, password } = req.body;
    console.log("Received data:", { email, password });

    const document = { email: email, password: password };
    const result = await collection.insertOne(document);
    
    res.send("Document is inserted");
  } catch (error) {
    console.log("Error during insertion:", error);
    res.status(500).send("Error during insertion");
  }
});





//=============================================<<<<student login  code>>>>>===================================================================

app.post('/login',async function(req,res)
{
  try{
        await client.connect();
        const database=client.db("project");
        const collection=database.collection("users");
       const {email,password}=req.body;
       const user=await collection.findOne({email,password});
       if(user)
       {
        res.json({
               sucess:true,
               email:user.email,
               password:user.password,

        })
       }
       else{
          res.json({
            sucess:false,
          })
       }
  }catch(error)
  {
     console.log(error);
  }
})



//====================================================teacher-login page code =====================================================================


app.post('/teacher-login',async function(req,res)
{
  try{
        await client.connect();
        const database=client.db("project");
        const collection=database.collection("users");
       const {email,password}=req.body;
       const user=await collection.findOne({email,password});
       if(user)
       {
        res.json({
               sucess:true,
               email:user.email,
               password:user.password,

        })
       }
       else{
          res.json({
            sucess:false,
          })
       }
  }catch(error)
  {
     console.log(error);
  }
})
//==================================================All slots avaible slots in students  page =========================================================================

app.get('/avaible-slots', async function(req, res) {
  try {
    const database = client.db("project");
    const collection = database.collection("slots");
    const result = await collection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//====================================================book appoiments=====================================================================


app.post('/book-appointment',async function(req,res)
{
  try{
  await client.connect();
  const database=client.db("project");
  const collection=database.collection("appoiments");
  const{student_name,student_email,teacher_name,teacher_email,subject,topic,date,time,status}=req.body;
  const document={student_name:student_name,student_email:student_email,teacher_name:teacher_name,teacher_email:teacher_email,subject:subject,topic:topic,date:date,time:time,status};
  const result=await collection.insertOne(document);

  if(result.insertedCount>0)
  {
    res.json({ok:true});
  }
}catch(error)
{
  console.log("error at inserting booking appoiment")
}
})


//==================================================students view appoiments=========================================================================


app.post('/view-appointments', async function(req, res) {
  try {
    await client.connect();
    const database = client.db("project");
    const collection = database.collection("appoiments"); 
    const student_email = req.body.student_email; // Correctly access 'number' from body
    const query = {student_email:student_email};
    const result = await collection.find(query).toArray();

    // Convert the cursor to an array of documents

    if (result.length > 0) {
      // If results are found, send them as JSON
      res.json(result);
    } else {
      // If no results are found, send a 404 status with a message
      res.status(404).json({ message: "No appointments found for the given phone number" });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'An error occurred while fetching appointments' });
  } 
});
//==================================================teachers creating slot=========================================================================

app.post('/create-slot', async function(req, res) {
  try {
      await client.connect();
      const database = client.db("project");
      const collection = database.collection("slots");
      
      const { teacher_name, teacher_email, subject, topic, date, time } = req.body;
      const query = { teacher_name, teacher_email, subject, topic, date, time };
      
      const result = await collection.insertOne(query);
      
      if (result.acknowledged) {
          res.json({ message: "Inserted successfully" });
      } else {
          res.status(500).json({ message: 'Failed to insert' });
      }
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'An error occurred while creating slot' });
  }
});




//==================================================displaying  slots in teachers page =========================================================================


app.post('/teacher-slots', async function(req, res) {
  try {
      await client.connect();
      const database = client.db("project");
      const collection = database.collection("slots");
      const teacher_email = req.body.teacher_email;  // Use correct key
      const query = { teacher_email: teacher_email };
      const result = await collection.find(query).toArray();
      res.json(result); 
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).send('Internal Server Error');  // Send a response in case of error
  }
});




//==================================================  ---    teacher-appoiments-check ==================================================================


app.post('/teacher-appoiments-check', async function(req, res) {
  try {
      await client.connect();
      const database = client.db("project");
      const collection = database.collection("appoiments");
      const teacher_email = req.body.teacher_email; // Ensure this matches frontend
      const query = { teacher_email: teacher_email };
      const result = await collection.find(query).toArray();
      res.setHeader('Content-Type', 'application/json');
      res.json(result); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
  } });


//=========================================================accept  or reject  =================================================================




app.post('/accept', async function(req, res) {
  try {
      await client.connect();
      const database = client.db("project");
      const collection = database.collection("appoiments");

      const { student_email, teacher_email, status } = req.body; // Ensure this matches frontend
      const query = { student_email: student_email, teacher_email: teacher_email }; // Query to match the specific student_email
      const update = { $set: { status: status } };

      const result = await collection.updateOne(query, update);

      if (result.matchedCount === 0) {
          // Handle case where no document matches the query
          res.status(404).json({ ok: false, message: 'No matching document found' });
      } else {
          // Handle successful update
          res.status(200).json({ ok: true, message: 'Status updated successfully' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send JSON error response
  }
});








