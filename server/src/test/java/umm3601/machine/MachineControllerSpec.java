package umm3601.machine;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for MachineController.
 * <p>
 *   Created by Emma Oswood on 10/10/2019.
 * </p>
 */
public class MachineControllerSpec {
  private MachineController machineController;
  private  ObjectId frogsId;

  // Put arbitrary "types" in instead of washers/dryers to check for unique machines
  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> machineDocuments = db.getCollection("machines");
    machineDocuments.drop();
    List<Document> testMachines = new ArrayList<>();
    testMachines.add(Document.parse("{\n" +
      "                    type: \"anteater\",\n" +
      "                    running: true,\n" +
      "                    status: \"normal\",\n" +
      "                    room_id: \"gay_hall\"\n" +
      "                }"));
    testMachines.add(Document.parse("{\n" +
      "                    type: \"grasshopper\",\n" +
      "                    running: false,\n" +
      "                    status: \"normal\",\n" +
      "                    room_id: \"spooner_hall\"\n" +
      "                }"));
    testMachines.add(Document.parse("{\n" +
      "                    type: \"fish\",\n" +
      "                    running: false,\n" +
      "                    status: \"broken\",\n" +
      "                    room_id: \"spooner_hall\"\n" +
      "                }"));

    frogsId = new ObjectId();
    BasicDBObject frog = new BasicDBObject("_id", frogsId);
    frog = frog.append("type", "frog")
      .append("running", true)
      .append("status", "normal")
      .append("room_id", "independence_hall");

    machineDocuments.insertMany(testMachines);
    machineDocuments.insertOne(Document.parse(frog.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    machineController = new MachineController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getType(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("type")).getValue();
  }

  @Test
  public void getAllMachines() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = machineController.getMachines(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 machines", 4, docs.size());
    List<String> rooms = docs
      .stream()
      .map(MachineControllerSpec::getType)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedRooms = Arrays.asList("anteater", "fish", "frog", "grasshopper");
    assertEquals("Rooms should match", expectedRooms, rooms);
  }

  @Test
  public void getMachinesFromSpooner() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("room_id", new String[]{"spooner_hall"});
    String jsonResult = machineController.getMachines(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 machines", 2, docs.size());
    List<String> rooms = docs
      .stream()
      .map(MachineControllerSpec::getType)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedRooms = Arrays.asList("fish", "grasshopper");
    assertEquals("Rooms should match", expectedRooms, rooms);
  }

  @Test
  public void getFrogById() {
    String jsonResult = machineController.getMachine(frogsId.toHexString());
    Document frog = Document.parse(jsonResult);
    assertEquals("Type should match", "frog", frog.get("type"));
    String noJsonResult = machineController.getMachine(new ObjectId().toString());
    assertNull("No type should match", noJsonResult);
  }

  @Test
  public void addMachineTest() {
    String newId = machineController.addNewMachine("washer", true, "broken", "candyland");

    assertNotNull("Add new machine should return true when machine is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("room_id", new String[]{"candyland"});
    String jsonResult = machineController.getMachines(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> room = docs
      .stream()
      .map(MachineControllerSpec::getType)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return type of new machine", "washer", room.get(0));
  }
}
