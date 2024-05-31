import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MarksTable = ({data}) => {
  const subjects = Object.keys(data);
  let totalMarks = 0;
  let totalPossibleMarks = 0;

  // Calculate the total marks and total possible marks
  subjects.forEach(subject => {
    totalMarks += data[subject].marks;
    totalPossibleMarks += data[subject].totalMarks;
  });

  // Calculate the overall percentage
  const overallPercentage = ((totalMarks / totalPossibleMarks) * 100).toFixed(
    1,
  );

  return (
    <View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Subject</Text>
          <Text style={styles.tableHeaderText}>Marks</Text>
          <Text style={styles.tableHeaderText}>Percentage</Text>
        </View>
        {subjects.map((subject, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{subject}</Text>
            <Text style={styles.tableCell}>{data[subject].marks}</Text>
            <Text style={styles.tableCell}>
              {((data[subject].marks / data[subject].totalMarks) * 100).toFixed(
                1,
              )}
            </Text>
          </View>
        ))}
      </View>
      {!isNaN(overallPercentage) && (
        <View>
          <Text style={styles.overallPercentage}>
            Overall Percentage: {overallPercentage}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#104E8B',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  overallPercentage: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default MarksTable;
