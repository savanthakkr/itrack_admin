// src/utils/sortData.js

/**
 * Accesses the value of a nested property within an object using a dot notation string.
 * 
 * @param {Object} obj - The object to access the property on.
 * @param {string} path - The dot notation string representing the path to the property.
 * @returns {*} The value of the nested property or undefined if not found.
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  /**
   * Compares two values and handles undefined and null values gracefully.
   * 
   * @param {*} a - The first value to compare.
   * @param {*} b - The second value to compare.
   * @returns {number} -1 if a < b, 1 if a > b, 0 if equal.
   */
  const compareValues = (a, b) => {
    if (a === undefined || a === null) return 1;
    if (b === undefined || b === null) return -1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };
  
  /**
   * Sorts an array of objects by a specified field in ascending order, including nested fields.
   * 
   * @param {Array} data - The array of objects to be sorted.
   * @param {string} field - The field by which to sort the objects.
   * @returns {Array} The sorted array of objects.
   */
  const sortData = (data, field) => {
    if (!Array.isArray(data) || !field) return [];
  
    // Create a copy of the data to avoid mutating the original array
    const sortedData = [...data];
  
    // Perform sorting based on the field provided
    sortedData.sort((a, b) => {
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);
  
      return compareValues(aValue, bValue);
    });
  
    return sortedData;
  };
  
  export default sortData;
  