package umm3601;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.BSONObject;
import org.bson.BsonArray;
import org.bson.BsonDocument;
import org.bson.Document;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class PollingService {

  private MongoClient mongoClient;
  private String baseApiUrl =  "http://155.138.235.83:5000/";

  private final MongoCollection<Document> machineDataFromPollingAPICollection;
  private static final String machineDataFromPollingAPIDatabaseName = "dev";

  PollingService(MongoClient mongoClient){
    this.mongoClient = mongoClient;
    MongoDatabase machineDataFromPollingAPIDatabase = mongoClient.getDatabase(machineDataFromPollingAPIDatabaseName);
    machineDataFromPollingAPICollection = machineDataFromPollingAPIDatabase.getCollection("machineDataFromPollingAPI");
    this.poll();
  }

  private void poll() {
    try {
      URL url = new URL(baseApiUrl + "machines");
      HttpURLConnection conn = (HttpURLConnection)url.openConnection();
      conn.setRequestMethod("GET");
      conn.connect();
      int responsecode = conn.getResponseCode();
      if(responsecode != 200) {
        throw new RuntimeException("Unexpected HttpResponseCode when looking for 200: " + responsecode);
      } else {
        //the response code suggests all is well and we need to get the string from the stream
        String inline = "";
        Scanner sc = new Scanner(url.openStream());
        while(sc.hasNext())
        {
          String item = sc.nextLine();
          inline += item;
        }
        System.out.println("\nJSON data in string format");
        System.out.println(inline);
        sc.close();
        //use that string to update machine data
        updateAllMachineData(inline);
      }

    } catch (MalformedURLException exception) {
      System.out.println("The url: " + baseApiUrl + "machines" + " was malformed.");
      exception.printStackTrace();
    } catch (IOException ioException) {
      ioException.printStackTrace();
    }

  }

  private void updateAllMachineData(String responseData) {

    //MongoDatabase db = mongoClient.getDatabase("machineDataFromPollingAPI");
    //MongoCollection<Document> collection = db.getCollection("machineData");
    //

    BsonArray theArray = BsonArray.parse(responseData);
    System.out.println("THE ARRAY OF DATA IS THIS MANY ITEMS:" + theArray.size());

    //List<BsonDocument> machineDataElements = new ArrayList<>();
    //for (int i=0; i<theArray.size(); i++) {
    //  machineDataElements.add(new BsonDocument(theArray.iterator().getElement(i)));
    //}

    //machineDataFromPollingAPICollection.insertMany(machineDataElements);

  }


}
