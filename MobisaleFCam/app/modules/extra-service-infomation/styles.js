var { StyleSheet } = require("react-native");
import Dimensions from "Dimensions";

const DEVICE_WIDTH = Dimensions.get("window").width;

const cusInfStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  cus_scrollview: {
    // flex: 1
  },
  inner_scrollview: {
    flex: 1,
    justifyContent: "space-between"
  },
  icon_form: {
    width: 20,
    height: 20
  },
  txt_action: {
    color: "#3F93FF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center"
  },
  textArea: {
    height: 96,
    textAlignVertical: "top",
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 12,
    fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 0,
    color: '#444444',
  },
  icon_delete: {
    flex: 0,
    marginLeft: 20,
    marginTop: 6
  }
});

export default cusInfStyle;
