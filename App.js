// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import * as FileSystem from 'expo-file-system';

// const fileName = 'x.json';
// const fileUri = `${FileSystem.documentDirectory}${fileName}`;

// export default function App() {
//   const [message, setMessage] = useState('');
//   const [displayedMessage, setDisplayedMessage] = useState(''); // No message on startup
//   const [input, setInput] = useState('');

//   // Function to read the message from x.json
//   const readMessageFromFile = async () => {
//     try {
//       const fileExists = await FileSystem.getInfoAsync(fileUri);
//       if (!fileExists.exists) {
//         setDisplayedMessage('File not found.'); // Display file not found message
//         return;
//       }

//       const fileContents = await FileSystem.readAsStringAsync(fileUri);
//       const jsonData = JSON.parse(fileContents);
//       setDisplayedMessage(jsonData.message); // Show only the message
//     } catch (error) {
//       console.error('Error reading the file:', error);
//       setDisplayedMessage('Error reading the file.');
//     }
//   };

//   // Function to write a new message to x.json
//   const writeMessageToFile = async () => {
//     try {
//       const newMessage = { message: input };
//       await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newMessage));
//       console.log(`File written at: ${fileUri}`)
//       setInput(''); // Clear the input field after writing
//       // Do not update displayedMessage here
//     } catch (error) {
//       console.error('Error writing to the file:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>JSON File Reader/Writer</Text>
      
//       <Text style={styles.label}>Enter your message:</Text>
//       <TextInput
//         style={styles.input}
//         value={input}
//         onChangeText={setInput}
//         placeholder="Type a message"
//       />

//       <View style={styles.buttonContainer}>
//         <Button title="Write" onPress={writeMessageToFile} />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button title="Read" onPress={readMessageFromFile} />
//       </View>

//       <Text style={styles.resultText}>Message in JSON file:</Text>
//       <Text style={styles.message}>{displayedMessage}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: '#cccccc',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//   },
//   buttonContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   resultText: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: '#333',
//   },
//   message: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NativeModules } from 'react-native';
const { FileSharing } = NativeModules;

const getFileUri = async () => {
  if (Platform.OS === 'ios') {
    // For iOS, we'll use the app's Documents directory
    return `${FileSystem.documentDirectory}x.json`;
  } else if (Platform.OS === 'android') {
    // For Android, we'll use the app's external directory
    return `${FileSystem.documentDirectory}x.json`;
  }
};

export default function App() {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [input, setInput] = useState('');
  const [fileUri, setFileUri] = useState('');

  useEffect(() => {
    const initializeFileUri = async () => {
      const uri = await getFileUri();
      setFileUri(uri);
      console.log('File URI:', uri);  // Log the file URI for debugging
    };
    initializeFileUri();
  }, []);

  const readMessageFromFile = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        setDisplayedMessage('File not found.');
        return;
      }

      const fileContents = await FileSystem.readAsStringAsync(fileUri);
      const jsonData = JSON.parse(fileContents);
      setDisplayedMessage(jsonData.message);
    } catch (error) {
      console.error('Error reading the file:', error);
      setDisplayedMessage('Error reading the file.');
    }
  };

  const writeMessageToFile = async () => {
    try {
      const newMessage = { message: input };
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newMessage));
      console.log(`File written at: ${fileUri}`);
      setInput('');
      
      if (Platform.OS === 'ios') {
        // Copy the file to the shared container
        FileSharing.copyFileToSharedContainer();
      }
      
      // Read the file immediately after writing to confirm
      // await readMessageFromFile();
    } catch (error) {
      console.error('Error writing to the file:', error);
      setDisplayedMessage('Error writing to the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JSON File Reader/Writer</Text>
      
      <Text style={styles.label}>Enter your message:</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
      />

      <View style={styles.buttonContainer}>
        <Button title="Write" onPress={writeMessageToFile} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Read" onPress={readMessageFromFile} />
      </View>

      <Text style={styles.resultText}>Message in JSON file:</Text>
      <Text style={styles.message}>{displayedMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
});