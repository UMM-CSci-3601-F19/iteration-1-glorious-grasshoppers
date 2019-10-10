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
 * Controller that manages requests for info about machines
 */

public class MachineController {

  private final MongoCollection<Document> machineCollection;

  /**
   * Construct a controller for machines.
   *
   * @param database the database containing machine data
   */
  public MachineController(MongoDatabase database) { machineCollection = database.getCollection("machines");}

  /**
   * Helper method that gets a single machine specified by the 'id'
   * parameter in the request
   */
}
