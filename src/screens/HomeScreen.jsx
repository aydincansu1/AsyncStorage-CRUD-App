import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import DeleteIcon from '../Icon/DeleteIcon';
import UpdateIcon from '../Icon/UpdateIcon';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (task.trim()) {
      const newTasks = [...tasks, {id: uuid.v4(), task: task.trim()}];
      setTasks(newTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTask('');
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const deleteTask = async id => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const editTask = id => {
    const existingTask = tasks.find(task => task.id === id);
    if (!existingTask) return;

    Alert.prompt(
      'Edit Task',
      'Enter the new task text to update',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: newText => {
            if (newText.trim()) {
              const updatedTasks = tasks.map(task =>
                task.id === id ? {...task, task: newText.trim()} : task,
              );
              setTasks(updatedTasks);
              AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            }
          },
        },
      ],
      'plain-text',
      existingTask.task,
    );
  };

  const confirmDelete = id => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteTask(id),
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskWrapper}>
        <Text style={styles.task}>{item.task}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => editTask(item.id)}>
            <UpdateIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => confirmDelete(item.id)}>
            <DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headerText}>Task List</Text>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={task}
              onChangeText={text => setTask(text)}
              placeholder="Add a Task"
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    marginTop: 40,
    marginBottom: 40,
    fontSize: 24,
    fontWeight: '700',
    color: '#232323',
    fontFamily: 'Poppins',
  },
  inputContainer: {
    width: 300,
    marginBottom: 40,
  },
  textInputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cecece',
    paddingLeft: 11, // Add space for the button
    height: 42,
    width: 300,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: '300',
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    width: 70,
    height: 42,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  taskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  taskWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cecece',
    borderRadius: 10,
    width: 300,
    height: 46,
    paddingLeft: 11,
    paddingRight: 11,
  },
  task: {
    flex: 1,
    fontSize: 16,
    color: '#232323',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
