package umm3601;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
//import com.sun.java.browser.net.ProxyService;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.utils.IOUtils;

import static spark.Spark.*;
import java.io.InputStream;
import java.lang.reflect.InvocationHandler;
import java.net.Proxy;
import java.net.Socket;

// import for Machine files
import umm3601.machine.MachineController;
import umm3601.machine.MachineRequestHandler;

public class Server {
  private static final String machineDatabaseName = "dev";

  private static final int serverPort = 4567;

  public static void main(String[] args) {

    MongoClient mongoClient = new MongoClient();
    MongoDatabase machineDatabase = mongoClient.getDatabase(machineDatabaseName);

    MachineController machineController = new MachineController(machineDatabase);
    MachineRequestHandler machineRequestHandler = new MachineRequestHandler(machineController);

    PollingService pollingService = new PollingService(mongoClient);

    //Configure Spark
    port(serverPort);

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Redirects for the "home" page
    redirect.get("", "/");

    Route clientRoute = (req, res) -> {
      InputStream stream = Server.class.getResourceAsStream("/public/index.html");
      return IOUtils.toString(stream);
    };

    get("/", clientRoute);

    // List machines, filtered using query parameters

    get("api/machines", machineRequestHandler::getMachines);
    get("api/machines/:id", machineRequestHandler::getMachineJSON);
    post("api/machines/new", machineRequestHandler::addNewMachine);

    // An example of throwing an unhandled exception so you can see how the
    // Java Spark debugger displays errors like this.
    get("api/error", (req, res) -> {
      throw new RuntimeException("A demonstration error");
    });

    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    get("/*", clientRoute);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });
  }
  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
