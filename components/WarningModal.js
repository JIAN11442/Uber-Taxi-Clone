import { useEffect } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import {
  setIsCancelDeleteFavouriteLocationCard,
  setIsDeleteFavouriteLocationCard,
  setStarIconFillStyle,
  setWarningPopUpVisibleForDeleteFavourite,
  setWarningPopUpVisibleForNull,
} from "../feature/useStateSlice";
import sanityClient from "../sanity";

const WarningModal = ({ type, origin }) => {
  const dispatch = useDispatch();
  const removeFavouriteLocation = () => {
    const originLocation = origin.description;
    sanityClient.fetch(`*[_type == 'favouriteLocation']{...,}`).then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].address == originLocation) {
          sanityClient.delete(`${data[i]._id}`).then(() => {
            console.log(`already delete favourite location`);
            console.log(`id : ${data[i]._id}`);
            console.log(`location : ${data[i].address}`);
          });
        }
      }
    });
  };
  // console.log(origin);
  useEffect(() => {
    if (type == "null") {
      Alert.alert(
        "Warning",
        "Have not any origin, can't add to Favourite List"
      );
    } else if (type == "Incompleted") {
      Alert.alert("Warning", "Your origin is available place");
    } else if (type == "removeFavourite") {
      Alert.alert("Warning", "Sure to remove from favourite list?", [
        {
          text: "Cancel",
          onPress: () => {
            dispatch(setIsCancelDeleteFavouriteLocationCard(true));
            // console.log("Cancel Remove From Favourite");
          },
          style: "cancel",
        },
        {
          text: "Sure",
          onPress: () => {
            removeFavouriteLocation();
            dispatch(setIsDeleteFavouriteLocationCard(true));
            dispatch(setStarIconFillStyle("transparent"));
          },
        },
      ]);
    }
    dispatch(setWarningPopUpVisibleForNull(false));
    dispatch(setWarningPopUpVisibleForDeleteFavourite(false));
  }, [origin]);
  return null;
};

export default WarningModal;