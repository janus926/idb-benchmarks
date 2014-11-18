if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var db;
var req = indexedDB.deleteDatabase('BenchDB');
req.onsuccess = function () {
  console.log("Deleted database successfully");
  generateAll();
};
req.onerror = function () {
  console.log("Couldn't delete database");
  generateAll();
}

function generateAll() {
  console.log('Generating contacts and inserting them in database');

  var request = window.indexedDB.open("BenchDB", 3);

  request.onerror = function(event) {
    alert("Unable to open database");
  };

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("contacts", { autoIncrement: true });

    objectStore.createIndex("info", "info", { unique: false });

    objectStore.transaction.oncomplete = function(event) {
      var customerObjectStore = db.transaction("contacts", "readwrite").objectStore("contacts");
      for (var i=0; i<2000; i++) {
        var contact = [];
        contact.push(
          Faker.Name.firstName(),
          Faker.Name.lastName(),
          Faker.Name.lastName(),
          Faker.PhoneNumber.phoneNumber(),
          Faker.Internet.email(),
          Faker.Company.companyName());

          console.log(contact.join(' '))
          customerObjectStore.add({ info: contact.join(' ') });
      }
      console.log(i + ' contacts inserted successfully.');
    };
  };
}

//function search(txt) {
//var objectStore = db.transaction("contacts").objectStore("contacts");
//var index = objectStore.index("info");
//var lowerBoundKeyRange = IDBKeyRange.lowerBound(txt);
//index.openCursor(lowerBoundKeyRange).onsuccess = function(event) {
//var cursor = event.target.result;
//if (cursor) {
//console.log(cursor)
//// Do something with the matches.
//cursor.continue();
//}
//};
//}

var contents = document.getElementById('contents');

function search() {
  var store = db.transaction("contacts") .objectStore("contacts");
  var time = Date.now();
  var request = store.openCursor();
  request.onsuccess = function(evt) {
    var cursor = evt.target.result;
    if (cursor) {
      cursor.continue();
    } else {
      document.getElementById('contents').innerHTML = 'Time spent traversing the whole database:' + (Date.now() - time) + 'ms<br/>';
    }
  };
}

document.getElementById('searchBtn').addEventListener('click', function(ev) {
  document.getElementById('contents').innerHTML = '';
  search();
});
