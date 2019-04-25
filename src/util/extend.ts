var extend = (...args: any[]): any => {

  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = args.length;

  // Check if a deep merge
  if (typeof args[0] ==='boolean') {
    deep = args[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = (obj) => {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = args[i];
    merge(obj);
  }

  return extended;

};

export default extend;