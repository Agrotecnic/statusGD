import { testFirebaseConnection, validateDataProcessing } from '../utils/firebaseTest';
import '@testing-library/jest-dom';

const runTests = async () => {
  console.log('Starting Firebase Tests...');
  
  // Test Firebase Connection
  const connectionResults = await testFirebaseConnection();
  console.log('\nConnection Test Results:');
  console.table(connectionResults);

  if (connectionResults.errors.length > 0) {
    console.log('\nConnection Errors:');
    connectionResults.errors.forEach(error => console.error(`- ${error}`));
  }

  // Test Data Processing
  const sampleData = {
    users: [
      {
        id: 1,
        name: 'Test User',
        role: 'user'
      }
    ],
    metrics: {
      performance: {},
      usage: {}
    },
    performance: {
      kpis: [],
      trends: []
    }
  };

  console.log('\nTesting Data Processing...');
  const processingResults = await validateDataProcessing(sampleData);
  console.log('\nProcessing Test Results:');
  console.table(processingResults);

  if (processingResults.validations.length > 0) {
    console.log('\nValidations:');
    processingResults.validations.forEach(validation => 
      console.log(`- ${validation.field || 'General'}: ${validation.message}`)
    );
  }

  if (processingResults.errors.length > 0) {
    console.log('\nProcessing Errors:');
    processingResults.errors.forEach(error => console.error(`- ${error}`));
  }
};

runTests().catch(console.error);