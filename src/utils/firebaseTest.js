// src/utils/firebaseTest.js
import { ref, set, get, onValue } from 'firebase/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import firebaseService from '../services/FirebaseService';

export const testFirebaseConnection = async () => {
  const results = {
    connection: false,
    auth: false,
    database: false,
    realtime: false,
    errors: []
  };

  try {
    // Use firebaseService instead of direct db reference
    const db = firebaseService.db;
    const auth = firebaseService.auth;

    // Test Database Connection
    const testRef = ref(db, 'connectionTest');
    
    // Test Write
    await set(testRef, {
      timestamp: Date.now(),
      status: 'testing'
    });
    results.connection = true;

    // Test Read
    const readResult = await get(testRef);
    if (readResult.exists()) {
      results.database = true;
    }

    // Test Realtime
    const realtimePromise = new Promise((resolve) => {
      const unsubscribe = onValue(testRef, () => {
        unsubscribe();
        resolve(true);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, 5000);
    });
    results.realtime = await realtimePromise;

    // Test Auth
    try {
      await signInWithEmailAndPassword(auth, process.env.REACT_APP_TEST_EMAIL, process.env.REACT_APP_TEST_PASSWORD);
      results.auth = true;
    } catch (authError) {
      results.errors.push(`Auth Error: ${authError.message}`);
    }
  } catch (error) {
    results.errors.push(`General Error: ${error.message}`);
  }
  return results;
};

export const validateDataProcessing = async (sampleData) => {
  const results = {
    success: false,
    validations: [],
    errors: []
  };

  try {
    // 1. Validate data structure
    const requiredFields = ['users', 'metrics', 'performance'];
    requiredFields.forEach(field => {
      if (!sampleData[field]) {
        results.validations.push({
          field,
          status: 'missing',
          message: `Required field ${field} is missing`
        });
      }
    });

    // 2. Validate data types
    if (sampleData.users && !Array.isArray(sampleData.users)) {
      results.validations.push({
        field: 'users',
        status: 'invalid',
        message: 'Users must be an array'
      });
    }

    if (sampleData.metrics && typeof sampleData.metrics !== 'object') {
      results.validations.push({
        field: 'metrics',
        status: 'invalid',
        message: 'Metrics must be an object'
      });
    }

    // 3. Validate data processing
    const processedData = await processData(sampleData);
    if (processedData && processedData.processed) {
      results.validations.push({
        status: 'success',
        message: 'Data processed successfully'
      });
      results.success = true;
    }
  } catch (error) {
    results.errors.push(`Processing Error: ${error.message}`);
  }
  return results;
};

// Helper function to process data
const processData = async (data) => {
  try {
    return {
      processed: true,
      timestamp: Date.now(),
      data: {
        ...data,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Error processing data: ${error.message}`);
  }
};