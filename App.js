import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EkleScreen from './harcama'; // EkleScreen bileşenini import et
import { Swipeable } from 'react-native-gesture-handler';  // Swipeable import

// HomeScreen (Ana Sayfa)
function HomeScreen({ navigation }) {
  const [expenses, setExpenses] = useState([
    { id: '1', title: 'Yemek Harcaması', date: '12.04.2024', amount: '250,00 TL', status: 'Onayda' },
    { id: '2', title: 'Konaklama', date: '12.04.2024', amount: '150,00 TL', status: 'Onayda' },
    { id: '3', title: 'Taksi', date: '12.04.2024', amount: '850,00 TL', status: 'Onayda' },
    { id: '4', title: 'Otopark', date: '12.04.2024', amount: '60,00 TL', status: 'Onayda' },
    { id: '5', title: 'Yemek Harcaması', date: '12.04.2024', amount: '1000,00 TL', status: 'Onayda' },
  ]);

  const addExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  // Harcamayı silme fonksiyonu
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  // Harcama öğesini sağa veya sola kaydırma işlemi
  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExpense(id)}>
      <Text style={styles.deleteText}>Sil</Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.expenseItem}>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.expenseAmount}>{item.amount}</Text>
          <Text style={styles.expenseStatus}>{item.status}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.img} source={{uri:"https://www.shutterstock.com/image-photo/headshot-close-face-portrait-young-260nw-2510015507.jpg"}}/>
        <Text style={styles.greeting}>Good Morning, Uğur</Text>
        <Text style={styles.subText}>How can we help you?</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.dateSelector}>
          <Text style={styles.dateText}>Mart 2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSelector}>
          <Text style={styles.filterText}>Aylık</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.expensesContainer}>
        <View style={styles.expensesHeader}>
          <Text style={styles.expensesTitle}>Harcamalar ({expenses.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Ekle', { addExpense })}>
            <Text style={styles.addExpense}>+ Yeni Ekle</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          style={styles.expensesList}
        />
      </View>
    </SafeAreaView>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

// App bileşeni
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen  
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Ekle"
          component={EkleScreen}
          options={({ navigation }) => ({
            title: "Harcama Ekle",
            headerStyle: {
              backgroundColor: '#fff', 
            },
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("./assets/arrow-left-s-line.png")} 
                  style={{ width: 30, height: 30, marginLeft: 11 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  img:{
    width:60,
    height:60,
    borderRadius:30
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#E3F2FD',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    flexDirection:"row",
    flexWrap:"wrap",
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    margin:15
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor:"#fff",
    padding:15,
    marginRight:15,
    marginLeft:15,
    borderRadius:15,
  },
  dateSelector: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  dateText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  filterSelector: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  expensesContainer: {
    flex: 1,
    margin: 20,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addExpense: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007BFF',
  },
  expensesList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expenseStatus: {
    fontSize: 14,
    color: '#A0522D',
    fontWeight: '500',
    backgroundColor: '#FDE8D9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingRight: 20,
    paddingLeft:20,
    borderRadius:20
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
