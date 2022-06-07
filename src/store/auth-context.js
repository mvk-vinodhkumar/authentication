import React, { useState, useEffect, useCallback } from "react"

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
})

//To calculate total time the user should be logged in. Basically auto-logout the user after 1hour
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()

  const remainingDuration = adjExpirationTime - currentTime
  return remainingDuration
}

let logoutTimer

const retrievedStoredToken = () => {
  const storedToken = localStorage.getItem("TOKEN_VALUE")
  const storedExpirationTime = localStorage.getItem("EXPIRATION_TIME")

  const remainingTime = calculateRemainingTime(storedExpirationTime)
  if (remainingTime <= 60000) {
    //one minute = 60000ms
    localStorage.removeItem("TOKEN_VALUE")
    localStorage.removeItem("EXPIRATION_TIME")
    return null
  }

  return {
    token: storedToken,
    duration: remainingTime,
  }
}

export const AuthContextProvider = (props) => {
  //checking for locally stored token
  const tokenData = retrievedStoredToken()
  let initialToken
  if (tokenData) {
    initialToken = tokenData.token
  }

  const [token, setToken] = useState(initialToken)
  // if a token is received, then user is logggedin, or else no

  const userIsLoggedIn = !!token //Converts a truthy or a falsey value into boolean true or false. If the token is a string that is not empty, then value will be true. If the token is a string which is empty, then false will be the value.

  const logOutHandler = useCallback(() => {
    setToken(null)
    //removing the token from localStorage when the user logs out.
    localStorage.removeItem("TOKEN_VALUE")
    localStorage.removeItem("EXPIRATION_TIME")

    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, [])

  const logInHandler = (token, expirationTime) => {
    setToken(token)

    //storing the token locally so when the user refreshed the page, the token is not lost.
    localStorage.setItem("TOKEN_VALUE", token)
    localStorage.setItem("EXPIRATION_TIME", expirationTime)

    const remainingTime = calculateRemainingTime(expirationTime)
    logoutTimer = setTimeout(logOutHandler, remainingTime)
  }

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration)
      logoutTimer = setTimeout(logOutHandler, tokenData.duration)
    }
  }, [tokenData, logOutHandler])

  const ctxValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  }

  return (
    <AuthContext.Provider value={ctxValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
