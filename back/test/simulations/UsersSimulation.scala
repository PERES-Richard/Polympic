import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class UserSimulation extends Simulation {

  val httpConf = http.baseUrl("http://localhost:3000")

  setUp(
    UserSendPositionScenario.scn
      .inject(rampUsers(7000) during (10 seconds))
      .protocols(httpConf)
  )
}