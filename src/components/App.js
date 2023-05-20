import React from 'react';
import { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {CardsContext} from '../contexts/CardsContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import RegisterOkPopup from './RegisterOkPopup';
import ErrorPopup from './ErrorPopup';
import Spinner from './Spinner';

function App() {

//регистрация пользователя

  const navigate = useNavigate();

  const registrationUser = (data) => {
    auth.register(data)
    .then(() => {
      registrOkPopupVisible(true);
    })
    .catch((err) => {
      console.log(err)
      ErrorPopupVisible(true);
    })
  }

//авторизация пользователя

  const [loggedIn, setLoggedIn] = useState(null);

  const authorizationUser = (data) => {
    auth.autorize(data)
    .then((data) => {
      console.log(data)
      setLoggedIn(true);
      navigate('/')
      localStorage.setItem('token', data.token);
    })
    .catch(err => {
      console.log(err);
      ErrorPopupVisible(true);
    });
  }

//аутентификация пользователя

  const [emailUser, setUserData] = useState(null);

  const token = localStorage.getItem('token')
  const checkToken = () => {
    auth.getContent(token)
    .then((res) => {
      if (res) {
      setLoggedIn(true)
      setUserData(res.data.email)
      navigate('/')
      } else {
      setLoggedIn(false);
      }
    })
    .catch(() => {
      setLoggedIn(false);
    })
  }

  useEffect(() => {
    checkToken();
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  }

//эффект загрузки
  const [isLoading, setIsLoading] = useState(false);

//загрузка данных пользователя и карточек

  const [currentUser, setUserInfo] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setIsLoading(true)
    Promise.all([api.getInfoProfile(), api.getInitialCards()])
      .then(([userInfo, cards]) => {
        setUserInfo(userInfo);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false))
  }, []);

//лайки
  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.setLikeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

//удаление карточки
  const handleCardDelete = (card) => {
    setIsLoading(true)
    api.deleteCard (card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }

//изменение данных пользователя
  const handleUpdateUser = (dataUser) => {
    setIsLoading(true)
    api.setInfoProfile(dataUser)
      .then((data) => {
        setUserInfo(data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  };

//изменение аватара пользователя
  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true)
    api.setNewAvatar(avatar)
      .then((data) => {
        setUserInfo(data);
      })
      .then(() => {
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

//добавление новой карточки
  const handleAddPlaceSubmit = (dataNewPlace) => {
    setIsLoading(true)
    api.setNewCard(dataNewPlace)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

//логика попапов
  const [isNewCardPopupVisible, setNewCardPopupVisible] = useState(false);
  const [isPhotoCardPopupVisible, setPhotoCardPopupVisible] = useState(false);
  const [isProfilePopupVisible, setProfilePopupVisible] = useState(false);
  const [isAvatarPopupVisible, setAvatarPopupVisible] = useState(false);
  const [isDeleteCardPopupVisible, deleteCardPopupVisible] = useState(false);
  const [isRegistrOkPopupVisible, registrOkPopupVisible] = useState(false);
  const [isErrorPopupVisible, ErrorPopupVisible] = useState(false);

  const [selectedCard, setCardPopup] = useState(null);
  const [deletedCard, deletePopup] = useState(null);

  const handleOpenNewPlacePopup = () => {
    setNewCardPopupVisible(true);
  };

  const handleOpenEditProfilePopup = () => {
    setProfilePopupVisible(true);
  };

  const handleOpenNewAvatarPopup = () => {
    setAvatarPopupVisible(true);
  };

  const handleOpenPopupImage = (card) => {
    setPhotoCardPopupVisible(true);
    setCardPopup(card);
  };

  const handleOpenPopupDeleteCard = (card) => {
    deleteCardPopupVisible(true);
    deletePopup(card);
  };

  const closeRegistrOkPopup = () => {
    closeAllPopups()
    navigate('/signin')
  }

  const closeOverlay = (e) => {
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      closeAllPopups()
    }
  }

  useEffect(() => {
    const closeEsc = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    if (
      isNewCardPopupVisible ||
      isPhotoCardPopupVisible ||
      isProfilePopupVisible ||
      isAvatarPopupVisible ||
      isDeleteCardPopupVisible ||
      isRegistrOkPopupVisible ||
      isErrorPopupVisible
    ) {
      document.addEventListener("keydown", closeEsc)
    }
    return () => {
      document.removeEventListener("keydown", closeEsc);
    };
  }, [
    isNewCardPopupVisible,
    isPhotoCardPopupVisible,
    isProfilePopupVisible,
    isAvatarPopupVisible,
    isDeleteCardPopupVisible,
    isRegistrOkPopupVisible,
    isErrorPopupVisible
  ]);

  const closeAllPopups = () => {
    setProfilePopupVisible(false);
    setNewCardPopupVisible(false);
    setAvatarPopupVisible(false);
    setPhotoCardPopupVisible(false);
    deleteCardPopupVisible(false);
    ErrorPopupVisible(false);
    registrOkPopupVisible(false);
  }

  if (loggedIn === null) {
    return ( <Spinner />)
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <CardsContext.Provider value={cards}>
          <Routes>
            <Route
              path="/signup"
              element={
                <>
                  <Register regData={(data) => registrationUser(data)} />
                  <RegisterOkPopup
                    isOpen={isRegistrOkPopupVisible}
                    onClose={closeRegistrOkPopup}
                    closeOverlay={closeOverlay}
                  />
                  <ErrorPopup
                    isOpen={isErrorPopupVisible}
                    onClose={closeAllPopups}
                    closeOverlay={closeOverlay}
                  />
                </>
              }
            />
            <Route
              path="/signin"
              element={
                <>
                  <Login
                    authData={(data) => authorizationUser(data)}
                  />
                  <ErrorPopup
                    isOpen={isErrorPopupVisible}
                    onClose={closeAllPopups}
                    closeOverlay={closeOverlay}
                  />
                </>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute
                  loggedIn={loggedIn}
                  element={
                    <>
                      <Main
                        onEditProfile={() => handleOpenEditProfilePopup()}
                        onAddPlace={() => handleOpenNewPlacePopup()}
                        onEditAvatar={() => handleOpenNewAvatarPopup()}
                        onCardClick={(card) => handleOpenPopupImage(card)}
                        onLikeClick={(card) => handleCardLike(card)}
                        onCardDelete={(card) => handleOpenPopupDeleteCard(card)}
                        emailUser={emailUser}
                        isLoading={isLoading}
                        loggedIn={loggedIn}
                        handleLogOut={handleLogOut()}
                      />
                      <EditProfilePopup
                        isOpen={isProfilePopupVisible}
                        onClose={closeAllPopups}
                        closeOverlay={closeOverlay}
                        onUpdateUser={(dataUser) => handleUpdateUser(dataUser)}
                        isLoading={isLoading}
                      />
                      <EditAvatarPopup
                        isOpen={isAvatarPopupVisible}
                        onClose={closeAllPopups}
                        closeOverlay={closeOverlay}
                        onUpdateAvatar={(avatar) => handleUpdateAvatar(avatar)}
                        isLoading={isLoading}
                      />
                      <AddPlacePopup
                        isOpen={isNewCardPopupVisible}
                        onClose={closeAllPopups}
                        closeOverlay={closeOverlay}
                        onAddPlace={(dataNewPlace) =>
                          handleAddPlaceSubmit(dataNewPlace)
                        }
                        isLoading={isLoading}
                      />
                      <DeleteCardPopup
                        isOpen={isDeleteCardPopupVisible}
                        onClose={closeAllPopups}
                        closeOverlay={closeOverlay}
                        card={deletedCard}
                        onDeleteCard={(card) => handleCardDelete(card)}
                        isLoading={isLoading}
                      />
                      <ImagePopup
                        isOpen={isPhotoCardPopupVisible}
                        card={selectedCard}
                        onClose={closeAllPopups}
                        closeOverlay={closeOverlay}
                      />
                    </>
                  }
                />
              }
            />
           {/*  <Route
              path="/"
              element={
                loggedIn ? (
                  <Navigate to="/signin" replace />
                ) : (
                  <Navigate to="/signup" replace />
                )
              }
            /> */}
          </Routes>
        </CardsContext.Provider>
      </CurrentUserContext.Provider>
      <Footer />
    </div>
  );
}

export default App;