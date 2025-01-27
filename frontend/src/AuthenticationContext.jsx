import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'

export const AuthenticaticationContext = createContext({
  user: null,
  profile: null,
  profileNotify: null,
  token: null,
  message: "",
  passMessage: "",
  notMessage: "",
  detailMessage: "",
  errorMsg: false,
  successMsg: false,
  reset: () => { },
  register: () => { },
  subscribe: () => { },
  unsubscribe: () => { },
  login: () => { },
  logout: () => { },
  requestPasswordReset: () => { },
  resetPassword: () => { },
  newPassword: () => { },
  changeNotifications: () => { },
});

function AuthenticationProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [profileNotify, setProfileNotify] = useState({
    fda: false,
    usda: false,
  });
  const [message, setMessage] = useState("")
  const [passMessage, setPassMessage] = useState("");
  const [notMessage, setNotMessage] = useState("")
  const [detailMessage, setDetailMessage] = useState("")
  const [errorMsg, setErrorMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/me`,
          config
        );
        const data = await response.data;
        console.log(data);
        const { firstName, lastName, email, notifications } = data;
        setProfile({ firstName, lastName, email });
        setProfileNotify(notifications);
      } catch (error) {
        console.log(error);
      }
    };

    !!token && getProfile();

    return () => {
      //second
    };
  }, [token]);

  const subscribe = async (firstName, lastName, email) => {
    const formData = { firstName, lastName, email };
    try {
      const response = await axios.post("/api/users/subscribe", formData);
      const data = await response.data;
      setMessage(data)
      toast.success(data)
      navigate("/");
    } catch (error) {
      let errorMsg = error?.response?.data || error?.message
      toast.error(errorMsg)
      setMessage(errorMsg)
    }
  }

  const unsubscribe = async (id) => {
    try {
      const response = await axios.delete(`api/users/unsubscribe/${id}`);
      const data = await response.data;
      setMessage(data)
      toast.success(data)
      navigate("/");
    } catch (error) {
      let errorMsg = error?.response?.data || error?.message
      setMessage(errorMsg)
      toast.error(errorMsg)
    }
  }

  const register = async (firstName, lastName, email, password1, password2) => {
    const formData = { firstName, lastName, email, password1, password2 };
    try {
      const response = await axios.post("http://localhost:8000/api/users", formData);
      const data = await response.data;
      const { email, token } = data;
      setUser({ email, token });
      setToken(token);
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify({ email, token }));
      navigate("/");
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setMessage(errorMsg)
    }
  };

  const login = async (email, password) => {
    const formData = { email, password };
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/login`,
        formData
      );
      const data = await response.data;
      console.log(data);
      const { email, token } = data;
      setUser({ email, token });
      setToken(token);
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify({ email, token }));
      navigate("/");
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setMessage(errorMsg)
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/')
  };

  const requestPasswordReset = async (email) => {
    const formData = { email };
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/requestResetPassword`, formData);
      const data = await response.data;
      console.log(data)
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setMessage(errorMsg)
    }
  };

  const resetPassword = async (userId, token, password) => {
    const formData = { userId, token, password };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/resetPassword", formData);
      const data = await response.data;
      console.log(data);
      navigate("/");
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setMessage(errorMsg)
    }
  };

  const newPassword = async (oldPass, newPass, confirmPass) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const formData = {
        oldPassword: oldPass,
        newPassword: newPass,
        confirmPassword: confirmPass,
      };

      const response = await axios.put(
        "http://localhost:8000/api/users/newPassword", formData, config);
      const data = await response.data;
      setPassMessage(data.msg)
      setSuccessMsg(true)
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setPassMessage(errorMsg)
      setErrorMsg(true)
    }
  };

  const changeNotifications = async (fda, usda) => {
    const formData = { notifications: { fda, usda } };
    setProfileNotify((prevState) => ({
      ...prevState,
      fda,
      usda,
    }));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/notifications", formData, config);
      const data = await response.data;
      console.log(data);
      setNotMessage(data.msg)
      setSuccessMsg(true)
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      setNotMessage(errorMsg)
      setErrorMsg(true)
    }
  };

  const updateDetails = async (firstName, lastName) => {
    const formData = { firstName, lastName };
    !!firstName && !!lastName && (setProfile((prevState) => ({
      ...prevState,
      firstName,
      lastName,
    })));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/updateDetails", formData, config);
      const data = await response.data;
      setDetailMessage(data.msg)
      setSuccessMsg(true)
    } catch (error) {
      let errorMsg = error?.response?.data?.msg || error?.message
      console.log(errorMsg)
      setDetailMessage(errorMsg)
      setErrorMsg(true)
    }
  };

  const reset = () => {
    setMessage("")
    setPassMessage("");
    setNotMessage("");
    setDetailMessage("");
    setErrorMsg(false);
    setSuccessMsg(false);
  };

  const contextValue = {
    user: user,
    profile: profile,
    profileNotify,
    token: token,
    message: message,
    passMessage: passMessage,
    notMessage: notMessage,
    detailMessage: detailMessage,
    errorMsg: errorMsg,
    successMsg: successMsg,
    register,
    login,
    subscribe,
    unsubscribe,
    reset,
    logout,
    requestPasswordReset,
    resetPassword,
    newPassword,
    changeNotifications,
    updateDetails,
  };

  return (
    <AuthenticaticationContext.Provider value={contextValue}>
      {children}
    </AuthenticaticationContext.Provider>
  );
}

export default AuthenticationProvider;

export const useAuth = () => {
  return useContext(AuthenticaticationContext);
};
