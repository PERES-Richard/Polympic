import io.gatling.core.Predef._
import io.gatling.http.Predef._

object UserSendPositionScenario {

  val users = jsonFile("users.json").random

  val scn = scenario("user want to push his position")
    .feed(users)
    .exec(
      http("push a user position")
        .post("/user")
        .formParam("uuid", "${uuid}")
        .formParam("longitude", "${longitude}")
        .formParam("latitude", "${latitude}")
        .check(status.is(201)))
}