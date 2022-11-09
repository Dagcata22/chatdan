"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _Chat = _interopRequireDefault(require("./models/Chat"));
var _default = function _default(io) {
  var users = {};
  io.on('connection', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(socket) {
      var messages, updateNicknames;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              updateNicknames = function _updateNicknames() {
                io.sockets.emit('usernames', Object.keys(users));
              };
              _context2.next = 3;
              return _Chat["default"].find({}).limit(8).sort('-created');
            case 3:
              messages = _context2.sent;
              socket.emit('load old msgs', messages);
              socket.on('new user', function (data, cb) {
                if (data in users) {
                  cb(false);
                } else {
                  cb(true);
                  socket.nickname = data;
                  users[socket.nickname] = socket;
                  updateNicknames();
                }
              });

              // receive a message a broadcasting
              socket.on('send message', /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data, cb) {
                  var msg, index, name, newMsg;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          msg = data.trim();
                          if (!(msg.substr(0, 3) === '/w ')) {
                            _context.next = 7;
                            break;
                          }
                          msg = msg.substr(3);
                          index = msg.indexOf(' ');
                          if (index !== -1) {
                            name = msg.substring(0, index);
                            msg = msg.substring(index + 1);
                            if (name in users) {
                              users[name].emit('whisper', {
                                msg: msg,
                                nick: socket.nickname
                              });
                            } else {
                              cb('Error! Enter a valid User');
                            }
                          } else {
                            cb('Error! Please enter your message');
                          }
                          _context.next = 11;
                          break;
                        case 7:
                          newMsg = new _Chat["default"]({
                            msg: msg,
                            nick: socket.nickname
                          });
                          _context.next = 10;
                          return newMsg.save();
                        case 10:
                          io.sockets.emit('new message', {
                            msg: msg,
                            nick: socket.nickname
                          });
                        case 11:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));
                return function (_x2, _x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
              socket.on('disconnect', function (data) {
                if (!socket.nickname) return;
                delete users[socket.nickname];
                updateNicknames();
              });
            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};
exports["default"] = _default;