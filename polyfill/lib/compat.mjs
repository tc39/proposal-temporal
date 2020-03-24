export function unique(arr) {
  const obj = Object.create(null);
  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    obj[v] = v;
  }
  var res = [];
  for (var p in obj) {
    res.push(obj[p]);
  }
  return res;
}
