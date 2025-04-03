import { useContext, useEffect, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { RiCloseLargeLine } from "react-icons/ri";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [isPasswordInputsShown, setIsPasswordInputsShown] = useState(false);
  const [visibility, setVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const navigate = useNavigate();
  useEffect(() => {
    setAvatar(currentUser.avatar ? [currentUser.avatar] : []);
  }, [currentUser.avatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const {
      username,
      email,
      oldPassword,
      newPassword,
      confirmPassword,
      phone,
    } = Object.fromEntries(formData);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        oldPassword,
        newPassword,
        phone,
        avatar: avatar[0] || null,
      });

      console.log("avatar in try", avatar);

      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  const handleEditClick = (e) => {
    const input = e.target.closest(".item").querySelector("input");
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="profileUpdatePage">
      <h1>Update Profile</h1>
      <div className="profileUpdatePageCointainer">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <div className="sideContainer">
              <div className="avatarCointainer">
                <img
                  src={avatar[0] || "/noavatar.jpg"}
                  alt=""
                  className="avatar"
                />
                <div className="deleteImage" onClick={() => setAvatar([])}>
                  <RiCloseLargeLine color="black" />
                </div>
              </div>
              <UploadWidget
                uwConfig={{
                  cloudName: "dg04baaoh",
                  uploadPreset: "estate",
                  multiple: false,
                  maxImageFileSize: 2000000,
                  folder: "avatars",
                }}
                setState={setAvatar}
              />
            </div>
            <div className="item">
              <label htmlFor="username">Username: </label>
              <div className="valueContainer">
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                />
                <BiSolidEditAlt
                  className="editIcon"
                  onClick={handleEditClick}
                />
              </div>
            </div>
            <div className="item">
              <label htmlFor="email">Email: </label>
              <div className="valueContainer">
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                />
                <BiSolidEditAlt
                  className="editIcon"
                  onClick={handleEditClick}
                />
              </div>
            </div>
            <div className="item">
              <label htmlFor="phone">Phone: </label>
              <div className="valueContainer">
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  defaultValue={currentUser.phone}
                />
                <BiSolidEditAlt
                  className="editIcon"
                  onClick={handleEditClick}
                />
              </div>
            </div>
            {isPasswordInputsShown ? (
              <>
                <div className="item">
                  <label htmlFor="oldPassword">Current Password</label>
                  <div className="valueContainer">
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type={visibility.oldPassword ? "text" : "password"}
                      autoFocus
                    />
                    <span onClick={() => toggleVisibility("oldPassword")}>
                      {visibility.oldPassword ? (
                        <IoEyeOffOutline className="eyeIcon" />
                      ) : (
                        <IoEyeOutline className="eyeIcon" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="item">
                  <label htmlFor="newPassword">new Password</label>
                  <div className="valueContainer">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={visibility.newPassword ? "text" : "password"}
                    />
                    <span onClick={() => toggleVisibility("newPassword")}>
                      {visibility.newPassword ? (
                        <IoEyeOffOutline className="eyeIcon" />
                      ) : (
                        <IoEyeOutline className="eyeIcon" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="item">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="valueContainer">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={visibility.confirmPassword ? "text" : "password"}
                    />
                    <span onClick={() => toggleVisibility("confirmPassword")}>
                      {visibility.confirmPassword ? (
                        <IoEyeOffOutline className="eyeIcon" />
                      ) : (
                        <IoEyeOutline className="eyeIcon" />
                      )}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="changePasswordButton"
                onClick={() => setIsPasswordInputsShown(true)}
              >
                Change Password
              </div>
            )}

            <button className="updateButton">Update</button>
            {error && <span className="errorMessage">{error}</span>}
          </form>
        </div>
        {/* <div className="sideContainer">
          <div className="avatarCointainer">
            <img src={avatar[0] || "/noavatar.jpg"} alt="" className="avatar" />
            <div className="deleteImage" onClick={() => setAvatar([])}>
              <RiCloseLargeLine />
            </div>
          </div>
          <UploadWidget
            uwConfig={{
              cloudName: "dg04baaoh",
              uploadPreset: "estate",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatars",
            }}
            setState={setAvatar}
          />
        </div> */}
      </div>
    </div>
  );
}
