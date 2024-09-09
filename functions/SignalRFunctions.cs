using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace Company.Function
{
    public class SignalRFunctions
    {

        [Function(nameof(Negotiate))]
        public static HttpResponseData Negotiate(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData req,
            [SignalRConnectionInfoInput(HubName = "Demo", UserId = "{headers.x-ms-client-principal-id}")] string connectionInfo)
        {
            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json");
            response.WriteStringAsync(connectionInfo);
            return response;
        }

        [Function(nameof(OnClientConnected))]
        public static void OnClientConnected(
            [SignalRTrigger("Demo", "connections", "connected", ConnectionStringSetting = "AzureSignalRConnectionString")]
            SignalRInvocationContext invocationContext, FunctionContext functionContext)
        {
            var logger = functionContext.GetLogger(nameof(OnClientConnected));
            logger.LogInformation("Connection {connectionId} connected.", invocationContext.ConnectionId);
        }

        [Function(nameof(OnClientDisconnected))]
        public static void OnClientDisconnected(
            [SignalRTrigger("Demo", "connections", "disconnected", ConnectionStringSetting = "AzureSignalRConnectionString")]
            SignalRInvocationContext invocationContext, FunctionContext functionContext)
        {
            var logger = functionContext.GetLogger(nameof(OnClientDisconnected));
            logger.LogInformation("Connection {connectionId} disconnected.", invocationContext.ConnectionId);
        }

        [Function(nameof(BroadcastToAll))]
        [SignalROutput(HubName = "Demo", ConnectionStringSetting = "AzureSignalRConnectionString")]
        public static SignalRMessageAction BroadcastToAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            using var bodyReader = new StreamReader(req.Body);
            string message = bodyReader.ReadToEndAsync().Result;
            // the message has the following json format: { "message": "Hello, World!" }, extract the value and append the current time
            var jsonObject = JsonConvert.DeserializeObject<JObject>(message);
            var modifiedMessage = new { message = $"{jsonObject?["message"]} - {DateTime.UtcNow}" };
            
            return new SignalRMessageAction("newMessage")
            {
                Arguments = new[] { modifiedMessage }
            };
        }

        [Function(nameof(SendToUser))]
        [SignalROutput(HubName = "Demo", ConnectionStringSetting = "AzureSignalRConnectionString")]
        public static SignalRMessageAction SendToUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            using var bodyReader = new StreamReader(req.Body);
            string body = bodyReader.ReadToEndAsync().Result;
            var jsonBody = JsonConvert.DeserializeObject<JObject>(body);
            var modifiedMessage = new { message = $"{jsonBody?["message"]} - {DateTime.UtcNow}" };
            
            return new SignalRMessageAction("newMessage")
            {
                Arguments = new[] { modifiedMessage },
                UserId = jsonBody?["userId"]?.ToString()
            };
        }
    }
}