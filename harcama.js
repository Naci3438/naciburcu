import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { createStackNavigator } from "@react-navigation/stack";
import { PermissionsAndroid } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { launchImageLibrary } from "react-native-image-picker";

import * as ImagePicker from "expo-image-picker";
import { icon } from "@fortawesome/fontawesome-svg-core";

const requestPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === "granted") {
    uploadButton(); // İzin verildiyse galeri açılacak
  } else {
    console.log("Fotoğraf erişim izni reddedildi");
  }
};

const handleAddExpense = () => {
  if (!amount || !description || !categoryValue || !photo) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  const newExpense = {
    id: String(Math.random()),
    title: description,
    date: date.toISOString().split("T")[0],
    amount: amount + " " + currency,
    status: "Onayda",
  };
  addExpense(newExpense); // Yeni harcamayı ekliyoruz
  setModalVisible(true);

  setAmount("");
  setCurrency("TL");
  setDate(new Date());
  setDescription("");
  setPhoto(null);
  setCategoryValue(null);
};

const uploadButton = async () => {
  const options = {
    mediaType: "photo", // Sadece fotoğraf seçmek için
    includeBase64: false,
  };

  const result = await launchImageLibrary(options); // Burada launchImageLibrary'den doğru API kullanımı yapıldı

  if (result.assets && result.assets.length > 0) {
    setPhoto(result.assets[0].uri); // Seçilen fotoğrafın URI'sini kaydet
  } else {
    console.log("Fotoğraf seçimi iptal edildi veya hata oluştu.");
  }
};

const ExpenseAddScreen = ({ route, navigation }) => {
  const { addExpense } = route.params; // HomeScreen'den gelen fonksiyonu al
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TL");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyItems, setCurrencyItems] = useState([
    {
      label: "Türk Lirası (TL)",
      value: "TL",
      icon: () => (
        <Image source={require("./assets/Turkey.png")} style={styles.icon} />
      ),
    },
    { label: "USD ($)", value: "USD" },
    { label: "Euro (€)", value: "EUR" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false); // Modal'ı kapatır
    setNaPressed(false); // naPressed değeri sıfırlanır
    setIsPressed(false); // isPressed değeri sıfırlanır
  };

  const [naPressed, setNaPressed] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Gıda", value: "gida" },
    { label: "Ulaşım", value: "ulasim" },
    { label: "Taksi", value: "taksi" },
    { label: "Eğlence", value: "eglence" },
  ]);

  const handleDateChange = (event, selectedDate) => {
    setDate(selectedDate || date);
    setShowDatePicker(true);
  };

  const handleAddExpense = () => {
    const newExpense = {
      id: String(Math.random()), // Benzersiz bir id oluşturuyoruz
      title: description,
      date: date.toISOString().split("T")[0],
      amount: amount + " " + currency,
      status: "Onayda",
    };
    addExpense(newExpense); // Yeni harcamayı ekliyoruz
    setModalVisible(true); // Modal'ı açıyoruz
    setAmount("");
    setDescription("");
    setCategoryValue(null);
  };
  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker);
    setCategoryOpen(false); // Kategori seçim spinnerını kapat
    setCurrencyOpen(false); // Para birimi seçim spinnerını kapat
  };

  const handleCategoryToggle = (open) => {
    setCategoryOpen(open);
    if (open) {
      setShowDatePicker(false); // Tarih seçiciyi kapat
      setCurrencyOpen(false); // Para birimi seçim spinnerını kapat
    }
  };

  const handleCurrencyToggle = (open) => {
    setCurrencyOpen(open);
    if (open) {
      setShowDatePicker(false); // Tarih seçiciyi kapat
      setCategoryOpen(false); // Kategori seçim spinnerını kapat
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={[
          styles.container,
          isPressed && styles.pressed,
          naPressed && styles.pres,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
          >
            <Text style={styles.title}>Harcama Detayı</Text>

            {/* Harcama Miktarı ve Para Birimi Seçimi */}
            <View style={styles.amountContainer}>
              {/* TL simgesi için resim */}
              <Image
                style={{
                  position: "absolute",
                  left: 13,
                  height: 20,
                  resizeMode: "contain", // Resmin boyutunu korur
                }}
                source={require("./assets/bayrak.jpg")} // Kendi resminiz burada
              />

              <TextInput
                style={styles.amountInput}
                placeholder="5000"
                keyboardType="numeric"
                value={amount} // State bağlı
                onChangeText={setAmount}
              />

              <View style={styles.currencyPicker}>
                <DropDownPicker
                  open={currencyOpen}
                  value={currency}
                  items={currencyItems}
                  setOpen={handleCurrencyToggle}
                  setValue={setCurrency}
                  setItems={setCurrencyItems}
                  placeholder="TL"
                  style={styles.currencyDropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={1000} // Z-index düzeltildi
                  zIndexInverse={500} // Z-index düzeltildi
                />
              </View>
            </View>

            {/* Tarih Seçimi */}
            <TouchableOpacity
              onPress={handleDatePickerToggle} // Tarih seçici açılıp kapanması için
              style={styles.dateInput}
            >
              <Image
                style={styles.foto}
                source={require("./assets/calendar-2-line (1).png")}
              />
              <Text>{date.toISOString().split("T")[0]}</Text>
              {/* Seçilen tarih burada gösterilir */}
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date} // Şu anki tarih
                mode="date" // Sadece tarih gösterilsin
                display="spinner" // Standart görünüm
                onChange={handleDateChange} // Tarih değişince handleDateChange fonksiyonu çalışacak
                themeVariant="light"
                locale="tr"
              />
            )}
            {/* Kategori Seçimi */}
            <View style={{ marginHorizontal: 12, zIndex: 100 }}>
              <DropDownPicker
                open={categoryOpen}
                value={categoryValue}
                items={categoryItems}
                setOpen={handleCategoryToggle}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                placeholder="Kategori Seçimi"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                itemSeparator
                itemSeparatorStyle={styles.itemSeparator}
                placeholderStyle={{ color: "#868C98" }}
              />
            </View>

            <View>
              <TextInput
                style={styles.input}
                placeholder="Açıklama"
                value={description}
                onChangeText={setDescription}
              />
              <Image
                style={styles.note}
                source={require("./assets/sticky-note-line (1).png")}
              />
            </View>
            {/* Harcama Fişi/Faturası */}
            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={uploadButton}
              >
                <Text
                  style={{
                    color: "#525866",
                    fontSize: 15,
                    fontWeight: "500",
                    lineHeight: 20,
                  }}
                >
                  Göz At
                </Text>
              </TouchableOpacity>
              <Text style={styles.uploadText}>
                JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
              </Text>
              {/* {photo && (
                <Image source={{ uri: photo }} style={styles.selectedImage} />
              )} */}
              <Text style={{ marginTop: 30, fontSize: 15, marginBottom: 10 }}>
                Harcama Fişi/Faturası
              </Text>
              <Image
                style={{ width: 35, height: 35, resizeMode: "contain" }}
                source={require("./assets/upload.png")}
              />
            </View>

            {/* Ekle Butonu */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                !(amount && date && description && categoryValue) && {
                  backgroundColor: "#ccc",
                },
              ]}
              onPressIn={handlePressIn}
              onPress={handleAddExpense}
              disabled={!(amount && date && description && categoryValue)} // Eğer eksik alan varsa buton devre dışı
            >
              <Text style={styles.submitText}>Ekle</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)} // Android'deki geri tuşu ile kapatma
            >
              <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.modalBackground}>
                  <TouchableWithoutFeedback>
                    {/* Modal içeriğinin tıklama ile kapanmamasını sağlamak için ikinci bir kaplayıcı */}
                    <View style={styles.modalContainer}>
                      <View
                        style={[
                          styles.modalStyle,
                          Platform.OS === "android"
                            ? styles.androidShadow
                            : styles.iosShadow,
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "500",
                            lineHeight: 24,
                            top: 5,
                          }}
                        >
                          Bilgilendirme
                        </Text>
                      </View>
                      <View style={styles.modalContent}>
                        <Image
                          style={styles.checkIcon}
                          source={require("./assets/check.png")}
                        />
                      </View>
                      <View style={styles.textCon}>
                        <Text style={styles.modalText}>
                          Harcama başarılı bir
                        </Text>
                        <Text
                          style={{
                            fontSize: 20,
                            marginTop: 2,
                            fontWeight: "500",
                            lineHeight: 32,
                          }}
                        >
                          şekilde eklendi.
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleCloseModal}
                      >
                        <View style={styles.okButton}>
                          <Text style={styles.closeButtonText}>Tamam</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  modalBackground: {
    backgroundColor: "red", // Yarı şeffaf siyah arka plan
  },
  pressed: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    opacity: 0.1,
  },
  pres: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    opacity: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    marginTop: 15,
    marginLeft: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: 12,
    marginRight: 12,
    flexDirection: "row",
    marginBottom: 15,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 30,
    padding: 10,
    fontSize: 16,
    marginLeft: 0,
    borderWidth: 1.5,
    padding: 15,
    paddingLeft: 32,
  },
  currencyPicker: {
    marginLeft: 10,
    width: 170,
  },
  currencyDropdown: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 20,
    zIndex: 200,
    borderWidth: 1.5,
    padding: 15,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderWidth: 1.5,
    padding: 10,
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    borderWidth: 1.5,
    padding: 15,
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 30,
    marginBottom: 16,
    borderWidth: 1.5,
    padding: 15,
    marginBottom: 15,
    zIndex: -5000,
    fontSize: 30,
    color: "#868C98",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    marginHorizontal: 12,
    borderWidth: 1.5,
    padding: 15,
    marginBottom: 15,
    paddingLeft: 40,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#E2E4E9",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    height: 300,
    justifyContent: "center",
    marginHorizontal: 12,
    borderWidth: 1.5,
    padding: 15,
    flexDirection: "column-reverse",
    height: 250,
    borderStyle: "dashed",
  },
  uploadButton: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 15,
    marginTop: 30,
    width: "30%",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E4E9",
    shadowColor: "#E2E4E9",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  uploadText: {  
    fontSize: 13,
    color: "#ccc",
    fontWeight: "400",
  },
  submitButton: {
    backgroundColor: "#6DAED6",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 5,
    top: 165,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  note: {
    position: "absolute",
    top: 14,
    left: 25,
    width: 25,
    height: 25,
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 10,
  },
  // modalContainer: {
  //   top: 600,
  //   backgroundColor: "#fff",
  //   height: 300,
  //   borderRadius: 20,
  //   marginHorizontal: 5,
  //   borderWidth: 0.3,
  //   borderColor: "blue",
  // },
  modalContent: {
    alignItems: "center",
    marginTop: "auto",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 32,
  },
  checkIcon: {
    width: 100,
    height: 100,
  },
  okButton: {
    alignItems: "center",
    marginTop: "auto",
    top: 30,

    marginBottom: 30,
    backgroundColor: "#6DAED6",
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 12,
  },
  textCon: {
    marginTop: "auto",
    alignItems: "center",
    marginBottom: 10,
    // paddingHorizontal: 110,
  },
  modalBackground: {
    flex: 1, // Bütün ekranı kaplasın
    backgroundColor: "#2C4656CC", // Yarı şeffaf siyah arka plan
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 360,
    marginHorizontal: 10,
    position: "absolute",
    paddingVertical: 20,
    bottom: 20,
    width: "95%",
    marginBottom: 30,
  },
  foto: {
    position: "absolute",
    width: 20,
    height: 20,
    left: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  modalStyle: {
    alignItems: "center",
    borderBottomWidth: 0.2,
    paddingBottom: 30,
    opacity: 1,
  },
  androidShadow: {
    elevation: 5, // Android için gölge
  },
  iosShadow: {
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  labelStyle: {
    fontSize: 50,
    color: "red",
  },
  itemSeparator: {
    height: 0, // Çizginin kalınlığı
    backgroundColor: "#ccc", // Çizginin rengi
    marginVertical: 1, // Çizgi ile öğe arasında boşluk
  },
});

export default ExpenseAddScreen;
