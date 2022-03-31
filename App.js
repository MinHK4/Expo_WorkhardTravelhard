import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  const work = () => setWorking(true);
  const travel = () => setWorking(false);
  const onChangeText = (payload) => setText(payload);
  
  const saveTodo = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  const loadTodo = async () => {
    const str = await AsyncStorage.getItem(STORAGE_KEY);
    setTodos(JSON.parse(str));
  }
  const addTodo = async () => {
    if(text === "")
      return;
    
    setText("");

    // setTodos({
    //   ...todos,
    //   [Date.now()]: {text, work: working}
    // });

    const newTodos = Object.assign({}, todos, {
      [Date.now()]: {text, work:working}
    });
    setTodos(newTodos);
    
    await saveTodo(newTodos);    
  };
  const deleteTodo = async (key) => {
    await Alert.alert("Delete To do", "Are you sure?", [
      {text: "Cancel"},
      {text: "Yes, I'm sure", onPress: async () => {
        const newTodos = {...todos};
        delete newTodos[key];
        setTodos(newTodos);
        await saveTodo(newTodos);
      }}
    ]);
  }

  useEffect(()=>{
    loadTodo();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? 'white' : theme.grey,
            }}>
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey,
            }}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onSubmitEditing={addTodo}
        returnKeyType="done"
        onChangeText={onChangeText}
        placeholder={working ? 'What to do' : 'Where to go'}
        value={text}
        style={styles.input}
      />
      <ScrollView>
      {Object.keys(todos).map( (key) => 
          todos[key].work === working ? (
            <View key={key} style={styles.todo}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity onPress={()=>deleteTodo(key)}>
                <Fontisto name="trash" size={16} color="white" />
              </TouchableOpacity>
            </View> 
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
