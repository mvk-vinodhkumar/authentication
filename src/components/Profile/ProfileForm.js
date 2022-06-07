import { useRef, useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../store/auth-context"
import classes from "./ProfileForm.module.css"

const ProfileForm = () => {
  const history = useHistory()

  const newPasswordInputRef = useRef()

  const authCtx = useContext(AuthContext)

  const passwordFormHandler = (event) => {
    event.preventDefault()

    const enteredNewPassword = newPasswordInputRef.current.value

    //We can do validation here

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDNwhv3Nz8NwXPGVF7aZZkXffe38f4q0os",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      //Assumption: We assume that it is always successfull!

      history.replace("/")
    })
  }

  return (
    <form className={classes.form} onSubmit={passwordFormHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
