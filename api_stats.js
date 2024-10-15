//
// app.get('/stats', async (req, res) => {...});
//
// return some stats about our bucket and database:
//
const photoapp_db = require('./photoapp_db.js')
const { HeadBucketCommand } = require('@aws-sdk/client-s3');
const { photoapp_s3, s3_bucket_name, s3_region_name } = require('./photoapp_s3.js');

//
// get /stats:
//
exports.get_stats = async (req, res) => {

  console.log("**Call to get /stats...");

  try 
  {
    //
    // calling S3 to get bucket status:
    //
    let input = {
      Bucket: s3_bucket_name
    };

    console.log("/stats: calling S3...");

    let command = new HeadBucketCommand(input);
    let s3_result = photoapp_s3.send(command); 

    //
    // calling MySQL to get # of users:
    //
    let sql = 'Select count(*) As NumUsers From users;';
   
    photoapp_db.query(sql, (err, mysql_result, _) => {
      
      console.log("/stats: calling MySQL for count of users...");
      
      try {
        if (err)
          throw new Error(err.message);
        else
          user_row = mysql_result[0];  // first row in the result list
      }
      catch(err) {
        console.log("**Error calling MySQL to get count of users");
        console.log(err.message);
   
        res.status(500).json({
          "message": err.message,
          "s3_status": -1,
          "db_numUsers": -1,
          "db_numAssets": -1
        });
      }
      
    });
    
    //
    // calling MySQL to get # of users:
    //
    sql = 'Select count(*) As NumAssets From assets;';
   
    photoapp_db.query(sql, (err, mysql_result, _) => {
      
      console.log("/stats: calling MySQL for count of assets...");
      
      try {
        if (err)
          throw new Error(err.message);
        else
          asset_row = mysql_result[0];  // first row in the result list
      }
      catch(err) {
        console.log("**Error calling MySQL to get count of users");
        console.log(err.message);
   
        res.status(500).json({
          "message": err.message,
          "s3_status": -1,
          "db_numUsers": -1,
          "db_numAssets": -1
        });
      }
      
    });

    //
    // done, respond with stats:
    //
    console.log("/stats done, sending response...");

    res.json({
      "message": "success",
      "s3_status": s3_result["$metadata"]["httpStatusCode"],
      "db_numUsers": user_row["NumUsers"],
      "db_numAssets": asset_row["NumAssets"]
    });
  }//try
  catch (err)
  {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function, or bad SQL:
    //
    console.log("**Error in /stats");
    console.log(err.message);
    
    res.status(500).json({
      "message": err.message,
      "s3_status": -1,
      "db_numUsers": -1,
      "db_numAssets": -1
    });
  }//catch

}//get
