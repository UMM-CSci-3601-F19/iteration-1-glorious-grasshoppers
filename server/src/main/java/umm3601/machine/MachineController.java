package umm3601.machine;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about machines.
 */
public class MachineController {

  private final MongoCollection<Document> machineCollection;

  /**
   * Construct a controller for machines.
   *
   * @param database the database containing machine data
   */
  public MachineController(MongoDatabase database) {
    machineCollection = database.getCollection("machineDataFromPollingAPI");
  }

  /**
   * Helper method that gets a single machine specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired machine
   * @return the desired machine as a JSON object if the machine with that ID is found,
   * and `null` if no machine with that ID is found
   */
  public String getMachine(String id) {
    FindIterable<Document> jsonMachines
      = machineCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonMachines.iterator();
    if (iterator.hasNext()) {
      Document machine = iterator.next();
      return machine.toJson();
    } else {
      // We didn't find the desired machine
      return null;
    }
  }


  /**
   * Helper method which iterates through the collection, receiving all
   * documents if no query parameter is specified. If the room_id query parameter
   * is specified, then the collection is filtered so only documents of that
   * specified location are found.
   *
   * @param queryParams the query parameters from the request
   * @return an array of Machines in a JSON formatted string
   */
  public String getMachines(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("room_id")) {
      String targetContent = (queryParams.get("room_id")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("room_id", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingMachines = machineCollection.find(filterDoc);

    return serializeIterable(matchingMachines);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }


  /**
   * Helper method which appends received machine information to the to-be added document
   *
   * @param type the name of the new machine
   * @param running the location of the new machine
   * @param status the company the new machine works for
   * @param room_id the email of the new machine
   * @return boolean after successfully or unsuccessfully adding a machine
   */
  public String addNewMachine(String name, String type, boolean running, String status, String room_id) {

    Document newMachine = new Document();
    newMachine.append("name", name);
    newMachine.append("type", type);
    newMachine.append("running", running);
    newMachine.append("status", status);
    //newMachine.append("position", position);
    newMachine.append("room_id", room_id);

    try {
      machineCollection.insertOne(newMachine);
      ObjectId id = newMachine.getObjectId("_id");
      System.err.println("Successfully added new machine [_id=" + id + ", name=" + name + ", type=" + type + ", running=" + running + " status=" + status + " room_id=" + room_id + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
