import { useContext } from "react"
import AuthContext from "../../store/auth-context"
import classes from "./StartingPageContent.module.css"

const StartingPageContent = () => {
  const authCtx = useContext(AuthContext)
  return (
    <section className={classes.starting}>
      <h1>
        {authCtx.isLoggedIn ? "Welcome on Board!" : "Please LogIn to Continue"}
      </h1>
    </section>
  )
}

export default StartingPageContent
