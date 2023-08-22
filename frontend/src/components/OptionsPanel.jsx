import { useUserData } from "../contexts/DataContext";
import { useUser } from "../contexts/UserContext";

const OptionsPanel = ({showOptions, setShowOptions}) => {
  const { setUser, navigate } = useUser();
  const {setUserInfo} = useUserData()

  const signOutUser = async () => {
    setUser(null);
    localStorage.removeItem("defiRideUser");
    navigate("/signin");
    setUserInfo({});
  };

  const hidePanel = ()=>{
    if(showOptions === true){
      setShowOptions(false)
    }
  }

  return (
    <div className="options-container">

      <p onClick={()=>{
          hidePanel()
          signOutUser()
        }
        }>Logout</p>
    </div>
  );
};

export default OptionsPanel;
