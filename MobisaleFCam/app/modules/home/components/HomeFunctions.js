import React from "react";
import { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { strings } from "locales/i18n";
import NavigationService from "app-libs/helpers/NavigationService";
import styles from "../styles";

export default class HomeFunctions extends Component {
	render() {
		return (
			<View style={styles.functionContainer}>
				<View style={styles.titleFunctionContainer}>
					<Text style={styles.title}>
						{strings("home.home_screen.prominent_features")}
					</Text>
				</View>

				<View style={styles.bodyFunctionContainer}>
					<View style={styles.oneRowFunction}>
						<View style={[styles.oneFunctionContainer]}>
							<TouchableOpacity
								style={styles.oneFunction}
								onPress={() =>
									NavigationService.navigate("TabListCustomerInfo")
								}
							>
								<Image
									style={styles.imgFunction}
									source={require("../../../assets/images/home/ic_40TDanh_sach_TTKH.png")}
								/>
								<Text style={styles.titleFunction}>
									{strings("home.home_screen.list_customer_information")}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.oneFunctionContainer}>
							<TouchableOpacity
								style={styles.oneFunction}
								onPress={() => NavigationService.navigate("ContractList")}
							>
								<Image
									style={styles.imgFunction}
									source={require("../../../assets/images/home/ic_40TDanh_sach_HD.png")}
								/>
								<Text style={styles.titleFunction}>
									{strings("home.home_screen.con_ls")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.oneRowFunction}>
						<View style={styles.oneFunctionContainer}>
							<TouchableOpacity
								style={styles.oneFunction}
								onPress={() => NavigationService.navigate("pcListCustomers")}
							>
								<Image
									style={styles.imgFunction}
									source={require("../../../assets/images/home/ic_40KH_tiem_nang.png")}
								/>
								<Text style={styles.titleFunction}>
									{strings("home.home_screen.potential_customer")}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.oneFunctionContainer}>
							<TouchableOpacity
								style={styles.oneFunction}
								onPress={() =>
									NavigationService.navigate("hideTabBottomTypeReportChoose")
								}
							>
								<Image
									style={styles.imgFunction}
									source={require("../../../assets/images/home/ic_40Bao_cao.png")}
								/>
								<Text style={styles.titleFunction}>
									{strings("home.home_screen.report")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					
					<View style={styles.oneRowFunction}>
						<View style={styles.oneFunctionContainer}>
							<TouchableOpacity
								style={styles.oneFunction}
								onPress={() => NavigationService.navigate("ExtraServiceLists")}
							>
								<Image
									style={styles.imgFunction}
									source={require("../../../assets/images/home/ic_extra-service.png")}
								/>
								<Text style={styles.titleFunction}>
									{strings("home.home_screen.extra_service")}
								</Text>
							</TouchableOpacity>
						</View>
						{/* fake 1 view column để extra service không bị tràn flex, nếu thêm 1 function thì xóa view dưới đi */}
						<View style={styles.oneFunctionContainer} />
					</View>
				</View>
			</View>
		);
	}
}
