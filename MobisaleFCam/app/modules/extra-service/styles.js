import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Platform } from "react-native";

export default {
	// CONTRACT DETAIL
	nav_head_style: {
		backgroundColor: '#0B76FF',
	},
	nav_header_titleStyle: {
		fontWeight: 'bold',
		textAlign: 'center',
		alignSelf: 'center'
	},

	container: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 16,
		backgroundColor: '#fff'
	},
	innerContainer: {
		flex: 1
	},
	textTitle: {
		fontWeight: "500",
		fontSize: 14,
		color: '#444',
		lineHeight: 16,
		marginBottom: 8
	},
	spaceSession: {
		marginTop: 12
	},

	boxInfo: {
		borderWidth: 1, borderColor: '#9ec9ff',borderRadius: 6,
		padding: 12,
		backgroundColor:'#FFF'
	},
	boxSpace: {
		marginTop: 16
	},
	buttonContainer: {
		marginBottom: 24,
	},

	innerbookport: {
		height:38,
		borderWidth:1, borderColor:'#9EC9FF', borderRadius:6,
		paddingHorizontal:12, paddingTop: 8,
		backgroundColor:'#FFF'
	},

	// ---------------

	container: {
		flex: 1,
		width: "100%"
	},
	searchContainer: {
		paddingBottom: 10,
		paddingRight: 32,
		paddingLeft: 32,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0B76FF"
	},
	boxSearch: {
		height: 40,
		width: "100%",
		borderWidth: 1,
		borderColor: "#FFFFFF",
		borderRadius: 5,
		backgroundColor: "#FFFFFF"
	},
	viewInputSearch: {
		flex: 1,
		flexDirection: "row"
	},
	iconSearchBox: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	iconSearch: {
		height: 16,
		width: 16
	},
	inputSearchBox: {
		flex: 6,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	innerInputSearchBox: {
		flex: 1,
		justifyContent: "space-between",
		minHeight: 40
	},
	inputSearch: { flex: 1 },

	searchBorder: {
		height: "80%",
		borderRightWidth: 1,
		borderRightColor: "#C2D0E2"
	},
	iconFilterBox: {
		flex: 1
	},
	listInfoContainer: {
		flex: 1,
		position: "relative",
		// paddingBottom:30,
		backgroundColor: "#F8F9FB"
	},
	scrollView: {
		paddingTop: 16
	},
	btnAddBox: {
		position: "absolute",
		bottom: 0,
		right: 0
	},
	oneList: {
		// height:155,
		marginHorizontal: 24,
		// marginTop:15,
		marginBottom: 12
	},
	infoBox: {
		// height:115,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 6,
		paddingBottom: 0,
		borderWidth: 1,
		borderColor: "#C2D0E2",
		borderBottomWidth: 0,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		backgroundColor: "#FFFFFF"
	},
	oneInfo: {
		flex: 1,
		flexDirection: "row",
		marginBottom: 8
	},
	oneInfoN: {
		flexDirection: "row",
		marginBottom: 10
	},
	oneAddress: {
		flex: 2,
		flexDirection: "row",
		marginBottom: 10
	},
	infoTitle: {
		flex: 2,
		fontSize: 12,
		color: "#A9A9A9",
		textAlign: "left"
	},
	infoValue: {
		flex: 3,
		fontSize: 12,
		fontWeight: "500",
		textAlign: "right",
		color: "#444444"
	},
	createBox: {
		height: 35,
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#C2D0E2",
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6
	},
	btnCreate: {
		paddingLeft: 54,
		paddingRight: 54,
		...Platform.select({
		ios: {
			paddingVertical: 4
		},
		android: {
			paddingVertical: 9
		}
		}),
		justifyContent: "center",
		alignItems: "center"
	},
	txtBtnCreate: {
		color: "#3F93FF",
		fontSize: 14,
		fontWeight: "500"
	},
	containerFilter: {
		paddingRight: 24,
		paddingLeft: 24,
		backgroundColor: "#0B76FF"
	},
	filterTypeBox: {
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 10
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: -8
	},
	col: {
		flex: 1 / 2,
		paddingHorizontal: 8
	},
	btnFilterActive: {
		backgroundColor: "#FFFFFF",
		borderWidth: 0
	},
	btnFilterType: {
		width: "100%",
		height: 32,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#FFF",
		borderRadius: 20
	},
	textFilterType: {
		fontSize: 12,
		color: "#FFF"
	},
	textFilterTypeActive: {
		fontSize: 12,
		color: "#0B76FF"
	},

	// DETAIL
	infoContact: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 6,
		paddingBottom: 0,
		borderWidth: 1,
		borderColor: "#D0D8E2",
		borderRadius: 6,
		backgroundColor: "#FFFFFF"
	},
	headline: {
		marginBottom: 12
	},
	textInput: {
		height: 40,
		paddingRight: 12,
		paddingLeft: 100,
		fontSize: 12,
		color: "#444444",
		borderColor: "transparent",
		borderWidth: 0
	},
	textArea: {
		height: 96,
		paddingTop: 12
	},
	titleBox: {
        flexDirection:'row',
        marginTop: 16, marginBottom: 8, 
    },
    titleLeft: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#444444',
    },
    titleRight: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#0B76FF',
	},
};
