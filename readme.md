1.  ionic start dev-sqlite-database-v0 blank --type=angular
2.  cd dev-sqlite-database-v0
3.  ionic g service services/database
    ionic g page pages/developers
    ionic g page pages/developer
4.  npm install @ionic-native/sqlite @ionic-native/sqlite-porter
5. ionic cordova plugin add cordova-sqlite-storage
6. ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqlitereporter
